package com.jobpilotai.backend.ai.explainability;

import com.jobpilotai.backend.ai.dto.ExplainabilityReport;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Generates structured explanations for AI decisions.
 */
@Service
public class ExplainabilityService {

    public ExplainabilityReport generateMatchExplanation(List<String> matchedSkills, String category) {
        String skillsStr = String.join(", ", matchedSkills);
        String reason = "Matched because you know " + skillsStr + ".";
        return ExplainabilityReport.builder()
                .reason(reason)
                .impact("Positive")
                .category(category)
                .build();
    }

    public ExplainabilityReport generateMissingSkillExplanation(List<String> missingSkills, String category) {
        String skillsStr = String.join(", ", missingSkills);
        String reason = "Missing " + skillsStr + ".";
        return ExplainabilityReport.builder()
                .reason(reason)
                .impact("Negative")
                .category(category)
                .build();
    }

    public ExplainabilityReport generateAtsIncreaseExplanation(int points, String category) {
        String reason = "Resume ATS score increased by " + points + " points.";
        return ExplainabilityReport.builder()
                .reason(reason)
                .impact("Positive")
                .category(category)
                .build();
    }

    public ExplainabilityReport generateExperienceExplanation(Integer requiredYears, String category) {
        String reason = "Company prefers " + requiredYears + "+ years experience.";
        return ExplainabilityReport.builder()
                .reason(reason)
                .impact("Neutral")
                .category(category)
                .build();
    }

    public ExplainabilityReport generateGenericExplanation(String reason, String impact, String category) {
        return ExplainabilityReport.builder()
                .reason(reason)
                .impact(impact)
                .category(category)
                .build();
    }
}
