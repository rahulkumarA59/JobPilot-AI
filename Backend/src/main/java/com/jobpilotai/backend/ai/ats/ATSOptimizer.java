package com.jobpilotai.backend.ai.ats;

import com.jobpilotai.backend.ai.dto.ATSReport;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Deterministic ATS optimization logic.
 */
@Service
public class ATSOptimizer {

    public ATSReport optimize(CandidateProfile profile) {
        List<String> suggestions = new ArrayList<>();
        
        int sectionScore = 100;
        if (profile.getSummary() == null || profile.getSummary().isBlank()) {
            sectionScore -= 20;
            suggestions.add("Add a professional summary.");
        }
        if (profile.getExperiences().isEmpty()) {
            sectionScore -= 40;
            suggestions.add("Add work experience sections.");
        }
        if (profile.getSkills().isEmpty()) {
            sectionScore -= 40;
            suggestions.add("Add a dedicated skills section.");
        }

        int formattingScore = 90; // Default good formatting for parsed resumes
        int experienceScore = profile.getTotalExperienceYears() != null && profile.getTotalExperienceYears() > 0 ? 100 : 50;
        int skillScore = profile.getSkills().size() > 5 ? 100 : 50;
        int keywordScore = 80; // Default without job context

        int atsScore = (sectionScore + formattingScore + experienceScore + skillScore + keywordScore) / 5;

        return ATSReport.builder()
                .atsScore(atsScore)
                .sectionScore(sectionScore)
                .keywordScore(keywordScore)
                .formattingScore(formattingScore)
                .experienceScore(experienceScore)
                .skillScore(skillScore)
                .suggestions(suggestions)
                .build();
    }
}
