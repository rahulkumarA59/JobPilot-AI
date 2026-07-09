package com.jobpilotai.backend.ai.coverletter;

import com.jobpilotai.backend.ai.dto.CoverLetterTemplate;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Job;
import org.springframework.stereotype.Service;

/**
 * Generates deterministic cover letter templates.
 */
@Service
public class CoverLetterService {

    public CoverLetterTemplate generateTemplate(CandidateProfile candidate, Job job) {
        String level = job.getExperienceLevel() != null ? job.getExperienceLevel().toLowerCase() : "experienced";
        String type = "EXPERIENCED";
        String tone = "Professional";
        
        if (level.contains("intern") || level.contains("entry")) {
            type = "ENTRY_LEVEL";
            tone = "Enthusiastic";
        } else if (level.contains("senior") || level.contains("lead")) {
            type = "SENIOR";
            tone = "Authoritative";
        }

        String template = String.format(
            "Dear Hiring Manager at %s,\n\n" +
            "I am excited to apply for the %s position. " +
            "With my background in %s and experience spanning %d years, " +
            "I am confident in my ability to bring value to your team.\n\n" +
            "[Add specific project achievement here]\n\n" +
            "Thank you for your time and consideration.\n\n" +
            "Sincerely,\n%s",
            job.getCompany().getName(),
            job.getTitle(),
            candidate.getCurrentRole() != null ? candidate.getCurrentRole() : "software engineering",
            candidate.getTotalExperienceYears() != null ? candidate.getTotalExperienceYears() : 0,
            candidate.getUser().getFullName()
        );

        return CoverLetterTemplate.builder()
                .type(type)
                .content(template)
                .tone(tone)
                .build();
    }
}
