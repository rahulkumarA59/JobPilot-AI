package com.jobpilotai.backend.job.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobpilotai.backend.ai.gateway.AIGateway;
import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.domain.PromptType;
import com.jobpilotai.backend.ai.gateway.dto.AIRequest;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.candidateprofile.domain.CandidateSkill;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.domain.JobSkill;
import com.jobpilotai.backend.job.dto.MatchedJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobMatchingService {

    private final AIGateway aiGateway;
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Filters and ranks jobs against the candidate profile.
     * First applies a deterministic filter (skills, title match, etc).
     * Then uses the AI Gateway to score the remaining jobs semantically.
     */
    public List<MatchedJob> matchJobs(CandidateProfile profile, List<Job> allJobs) {
        log.info("Starting job matching for profile {}. Total jobs to evaluate: {}", profile.getPublicId(), allJobs.size());

        List<MatchedJob> preFilteredJobs = new ArrayList<>();

        for (Job job : allJobs) {
            int skillOverlap = calculateSkillOverlap(profile, job);
            
            // Deterministic pre-filter: We only send jobs to AI if they have at least 20% skill overlap
            // or if the job has no explicit skills listed (we'll let AI decide).
            if (skillOverlap >= 20 || job.getSkills().isEmpty()) {
                MatchedJob matched = MatchedJob.builder()
                        .job(job)
                        .skillOverlapPercentage(skillOverlap)
                        .build();
                preFilteredJobs.add(matched);
            }
        }

        log.info("Jobs passing deterministic filter: {}", preFilteredJobs.size());

        List<MatchedJob> finalMatches = new ArrayList<>();
        
        for (MatchedJob matchedJob : preFilteredJobs) {
            try {
                // Call AI for semantic scoring
                enrichWithAIScore(profile, matchedJob);
                
                // Only keep jobs with score >= 60
                if (matchedJob.getMatchScore() >= 60) {
                    finalMatches.add(matchedJob);
                }
            } catch (Exception e) {
                log.error("Error scoring job {} with AI: {}", matchedJob.getJob().getPublicId(), e.getMessage());
            }
        }

        // Sort by score descending
        finalMatches.sort(Comparator.comparingInt(MatchedJob::getMatchScore).reversed());

        log.info("AI matching complete. Final approved jobs: {}", finalMatches.size());
        return finalMatches;
    }

    private void enrichWithAIScore(CandidateProfile profile, MatchedJob matchedJob) {
        String prompt = buildPrompt(profile, matchedJob.getJob());
        
        AIRequest request = AIRequest.builder()
                .prompt(prompt)
                .promptType(PromptType.JOB_MATCHING)
                .preferredProvider(AIProviderType.GEMINI)
                .operation("JOB_SCORING")
                .candidateProfileId(profile.getId())
                .build();

        AIResponse response = aiGateway.generate(request);

        if (response.isSuccess()) {
            parseAIResponse(response.getContent(), matchedJob);
        } else {
            throw new RuntimeException("AI scoring failed: " + response.getErrorMessage());
        }
    }

    private String buildPrompt(CandidateProfile profile, Job job) {
        return """
                You are an expert technical recruiter and ATS screening algorithm.
                Your task is to evaluate the fit between a candidate's profile and a job description.
                
                Evaluate the following constraints and produce a JSON output.
                
                Candidate Summary: %s
                Candidate Current Role: %s
                Candidate Years Experience: %d
                Candidate Education: %s
                Candidate Skills: %s
                
                Job Title: %s
                Job Company: %s
                Job Description: %s
                
                Provide the output strictly in the following JSON format:
                {
                  "score": <0-100 integer representing the match quality>,
                  "reasoning": "<1-2 sentence explanation of why this score was given>",
                  "analysis": "<detailed breakdown of strengths and gaps>"
                }
                
                Do not include markdown blocks, just raw JSON.
                """.formatted(
                profile.getSummary(),
                profile.getCurrentRole(),
                profile.getTotalExperienceYears() != null ? profile.getTotalExperienceYears() : 0,
                profile.getHighestEducation(),
                String.join(", ", profile.getSkills().stream().map(CandidateSkill::getSkillName).toList()),
                job.getTitle(),
                job.getCompany().getName(),
                job.getDescription()
        );
    }

    private void parseAIResponse(String content, MatchedJob matchedJob) {
        try {
            // Clean markdown blocks if AI ignored instructions
            if (content.startsWith("```json")) {
                content = content.replace("```json", "").replace("```", "").trim();
            } else if (content.startsWith("```")) {
                content = content.replace("```", "").trim();
            }

            JsonNode root = mapper.readTree(content);
            matchedJob.setMatchScore(root.path("score").asInt(0));
            matchedJob.setMatchReasons(root.path("reasoning").asText("No reasoning provided."));
            matchedJob.setAiAnalysis(root.path("analysis").asText("No analysis provided."));
        } catch (Exception e) {
            log.warn("Failed to parse AI response as JSON: {}. Falling back to default score.", e.getMessage());
            matchedJob.setMatchScore(50);
            matchedJob.setMatchReasons("Failed to parse AI reasoning.");
        }
    }

    private int calculateSkillOverlap(CandidateProfile profile, Job job) {
        if (job.getSkills() == null || job.getSkills().isEmpty()) {
            return 100;
        }

        List<String> candidateSkills = profile.getSkills().stream()
                .map(s -> s.getSkillName().toLowerCase())
                .toList();

        long matchedCount = job.getSkills().stream()
                .map(JobSkill::getSkillName)
                .map(String::toLowerCase)
                .filter(candidateSkills::contains)
                .count();

        return (int) ((matchedCount * 100) / job.getSkills().size());
    }
}
