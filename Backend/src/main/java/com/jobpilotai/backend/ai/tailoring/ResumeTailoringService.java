package com.jobpilotai.backend.ai.tailoring;

import com.jobpilotai.backend.ai.dto.SkillGap;
import com.jobpilotai.backend.ai.dto.TailoredResumeSuggestion;
import com.jobpilotai.backend.ai.matching.SkillGapAnalyzer;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Job;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Provides deterministic rules for resume tailoring.
 */
@Service
public class ResumeTailoringService {

    private final SkillGapAnalyzer skillGapAnalyzer;

    public ResumeTailoringService(SkillGapAnalyzer skillGapAnalyzer) {
        this.skillGapAnalyzer = skillGapAnalyzer;
    }

    public TailoredResumeSuggestion generateTailoringSuggestions(CandidateProfile candidate, Job job) {
        SkillGap gap = skillGapAnalyzer.analyzeSkillGap(candidate, job);

        List<String> missing = gap.getMissingSkills();
        List<String> sectionImprovements = new ArrayList<>();
        List<String> bulletPoints = new ArrayList<>();
        List<String> tips = new ArrayList<>();

        if (!missing.isEmpty()) {
            sectionImprovements.add("Add a 'Skills' section mentioning: " + String.join(", ", missing));
        }
        
        if (job.getExperienceLevel() != null && job.getExperienceLevel().toLowerCase().contains("senior")) {
            bulletPoints.add("Highlight leadership and mentoring experience.");
            bulletPoints.add("Use strong action verbs (e.g., 'Architected', 'Spearheaded').");
            tips.add("Senior roles require impact metrics. Ensure 80% of bullets have numbers.");
        } else {
            bulletPoints.add("Focus on execution and learning capacity.");
            tips.add("Keep resume to 1 page if experience is < 5 years.");
        }

        tips.add("Ensure exact match of keywords for ATS.");

        double density = gap.getStrongSkills().size() * 0.05; // Mock density

        return TailoredResumeSuggestion.builder()
                .missingKeywords(missing)
                .recommendedKeywords(gap.getRecommendedSkills())
                .keywordDensity(density)
                .sectionImprovements(sectionImprovements)
                .bulletPointSuggestions(bulletPoints)
                .atsOptimizationTips(tips)
                .build();
    }
}
