package com.jobpilotai.backend.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobpilotai.backend.ai.gateway.AIGateway;
import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.domain.PromptType;
import com.jobpilotai.backend.ai.gateway.dto.AIRequest;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.candidateprofile.domain.CandidateSkill;
import com.jobpilotai.backend.job.domain.Job;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service to generate dynamic cover letters using AI.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CoverLetterService {

    private final AIGateway aiGateway;
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Generate a cover letter text tailored to the job.
     * @return The generated cover letter text, or a fallback if generation fails.
     */
    public String generateCoverLetter(CandidateProfile profile, Job job) {
        log.info("Generating cover letter for candidate {} and job {}", profile.getPublicId(), job.getPublicId());

        String prompt = buildCoverLetterPrompt(profile, job);

        AIRequest request = AIRequest.builder()
                .prompt(prompt)
                .promptType(PromptType.COVER_LETTER)
                .preferredProvider(AIProviderType.GEMINI)
                .operation("GENERATE_COVER_LETTER")
                .candidateProfileId(profile.getId())
                .build();

        AIResponse response = aiGateway.generate(request);

        if (response.isSuccess()) {
            log.info("Successfully generated cover letter for job {}", job.getPublicId());
            return response.getContent().trim();
        } else {
            log.error("Failed to generate cover letter: {}", response.getErrorMessage());
            // Fallback generic cover letter
            return "Dear Hiring Manager at " + job.getCompany().getName() + ",\n\n" +
                   "I am writing to express my interest in the " + job.getTitle() + " position. " +
                   "Please find my resume attached.\n\n" +
                   "Sincerely,\n" +
                   profile.getUser().getFirstName() + " " + profile.getUser().getLastName();
        }
    }

    private String buildCoverLetterPrompt(CandidateProfile profile, Job job) {
        return """
                Write a professional, compelling cover letter for the following candidate applying to the specified job.
                The cover letter should be directly addressable, highlight why the candidate's skills are a match for the specific requirements of the job description, and be no more than 3 paragraphs.
                DO NOT output JSON. Just output the plain text of the cover letter. Do not include markdown formatting or placeholder brackets (like [Company Name]). Fill them in with the real data provided.

                Candidate Name: %s %s
                Candidate Profile Summary: %s
                Candidate Role: %s
                Candidate Skills: %s

                Job Title: %s
                Job Company: %s
                Job Description: %s
                """.formatted(
                profile.getUser().getFirstName(), profile.getUser().getLastName(),
                profile.getSummary(),
                profile.getCurrentRole(),
                String.join(", ", profile.getSkills().stream().map(CandidateSkill::getSkillName).toList()),
                job.getTitle(),
                job.getCompany().getName(),
                job.getDescription()
        );
    }
}
