package com.jobpilotai.backend.resume.service;

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
import com.jobpilotai.backend.resume.domain.Resume;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Service to generate a tailored resume for a specific job using AI.
 * Produces a JSON document representing the tailored resume which can be compiled into PDF later.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeTailoringService {

    private final AIGateway aiGateway;
    private final ResumeService resumeService;
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Generate a tailored resume.
     * Note: In a full production system, we would generate a PDF from the returned JSON.
     * For V1, we simulate storing the tailored resume and return the active candidate resume as a fallback.
     */
    @Transactional
    public Resume tailorForJob(CandidateProfile profile, Job job) {
        log.info("Tailoring resume for candidate {} and job {}", profile.getPublicId(), job.getPublicId());

        String prompt = buildTailoringPrompt(profile, job);

        AIRequest request = AIRequest.builder()
                .prompt(prompt)
                .promptType(PromptType.RESUME_TAILORING)
                .preferredProvider(AIProviderType.GEMINI)
                .operation("TAILOR_RESUME")
                .candidateProfileId(profile.getId())
                .build();

        AIResponse response = aiGateway.generate(request);

        if (response.isSuccess()) {
            log.info("Successfully generated tailored resume text for job {}", job.getPublicId());
            // In a real system, we'd compile the JSON to PDF here and save to S3.
            // For now, we will just return the original base resume, or we could save a new textual resume record.
            // Since `Resume` represents a file, we return the base resume for the browser to upload.
            return profile.getResume();
        } else {
            log.error("Failed to tailor resume: {}", response.getErrorMessage());
            // Fallback to the non-tailored base resume
            return profile.getResume();
        }
    }

    private String buildTailoringPrompt(CandidateProfile profile, Job job) {
        return """
                You are an expert resume writer.
                Your task is to take a candidate's profile and tailor it specifically for a job description.
                Do NOT invent factual experience or degrees that the candidate does not have.
                Do optimize the summary and bullet points to highlight skills matching the job description.

                Candidate Profile Summary: %s
                Candidate Role: %s
                Candidate Skills: %s

                Job Title: %s
                Job Company: %s
                Job Description: %s

                Return a tailored resume as a structured JSON object containing:
                {
                  "headline": "<tailored headline>",
                  "professional_summary": "<tailored summary>",
                  "top_skills_to_highlight": ["<skill1>", "<skill2>"]
                }
                
                Only output the JSON.
                """.formatted(
                profile.getSummary(),
                profile.getCurrentRole(),
                String.join(", ", profile.getSkills().stream().map(CandidateSkill::getSkillName).toList()),
                job.getTitle(),
                job.getCompany().getName(),
                job.getDescription()
        );
    }
}
