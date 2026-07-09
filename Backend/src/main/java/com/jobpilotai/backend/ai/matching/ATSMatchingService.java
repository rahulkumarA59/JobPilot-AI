package com.jobpilotai.backend.ai.matching;

import com.jobpilotai.backend.ai.dto.ExplainabilityReport;
import com.jobpilotai.backend.ai.dto.MatchResult;
import com.jobpilotai.backend.ai.dto.SkillGap;
import com.jobpilotai.backend.ai.explainability.ExplainabilityService;
import com.jobpilotai.backend.ai.rules.ScoringRules;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.enums.RemoteType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Calculates ATS match scores deterministically based on rule weights.
 */
@Service
public class ATSMatchingService {

    private static final Logger log = LoggerFactory.getLogger(ATSMatchingService.class);

    private final ScoringRules rules;
    private final SkillGapAnalyzer skillGapAnalyzer;
    private final ExplainabilityService explainabilityService;

    public ATSMatchingService(ScoringRules rules,
                              SkillGapAnalyzer skillGapAnalyzer,
                              ExplainabilityService explainabilityService) {
        this.rules = rules;
        this.skillGapAnalyzer = skillGapAnalyzer;
        this.explainabilityService = explainabilityService;
    }

    public MatchResult calculateMatch(CandidateProfile candidate, Job job) {
        log.debug("Matching Started: Candidate {} to Job {}", candidate.getId(), job.getId());
        List<ExplainabilityReport> explanations = new ArrayList<>();

        // 1. Skill Score
        SkillGap gap = skillGapAnalyzer.analyzeSkillGap(candidate, job);
        int totalSkills = job.getSkills().size();
        int skillScoreRaw = totalSkills == 0 ? 100 : (gap.getStrongSkills().size() * 100) / totalSkills;
        if (!gap.getStrongSkills().isEmpty()) {
            explanations.add(explainabilityService.generateMatchExplanation(gap.getStrongSkills(), "Skills"));
        }
        if (!gap.getMissingSkills().isEmpty()) {
            explanations.add(explainabilityService.generateMissingSkillExplanation(gap.getMissingSkills(), "Skills"));
        }

        // 2. Experience Score
        int expScoreRaw = 100; // Default if job doesn't specify
        String jobLevel = job.getExperienceLevel();
        if (jobLevel != null && candidate.getTotalExperienceYears() != null) {
            int candidateYears = candidate.getTotalExperienceYears();
            int requiredYears = parseRequiredYears(jobLevel);
            if (requiredYears > 0) {
                if (candidateYears >= requiredYears) {
                    expScoreRaw = 100;
                    explanations.add(explainabilityService.generateGenericExplanation(
                            "You meet the experience requirement of " + requiredYears + "+ years.", "Positive", "Experience"));
                } else {
                    expScoreRaw = (int) (((double) candidateYears / requiredYears) * 100);
                    explanations.add(explainabilityService.generateExperienceExplanation(requiredYears, "Experience"));
                }
            }
        }

        // 3. Education Score
        int eduScoreRaw = 100; // Default assumption for V1
        // V1 deterministic logic: just grant full score unless explicitly missing

        // 4. Location Score
        int locScoreRaw = 100;
        if (job.getLocation() != null && candidate.getCurrentLocation() != null) {
            if (!candidate.getCurrentLocation().toLowerCase().contains(job.getLocation().toLowerCase())) {
                locScoreRaw = 50; // Partial match if different
                explanations.add(explainabilityService.generateGenericExplanation(
                        "Job location (" + job.getLocation() + ") differs from your current location.", "Neutral", "Location"));
            }
        }

        // 5. Salary Score
        int salScoreRaw = 100;
        if (candidate.getExpectedSalary() != null && job.getSalaryMax() != null) {
            if (candidate.getExpectedSalary() > job.getSalaryMax()) {
                salScoreRaw = 50;
                explanations.add(explainabilityService.generateGenericExplanation(
                        "Expected salary exceeds job maximum.", "Negative", "Salary"));
            }
        }

        // 6. Remote Score
        int remScoreRaw = 100;
        if (job.getRemoteType() != RemoteType.REMOTE && candidate.getPreferredLocations() != null
                && candidate.getPreferredLocations().toLowerCase().contains("remote")) {
            remScoreRaw = 0; // Candidate wants remote, job isn't
            explanations.add(explainabilityService.generateGenericExplanation(
                    "You prefer remote, but this job is " + job.getRemoteType(), "Negative", "Remote"));
        }

        // Weighted Total
        int totalScore = 
            (skillScoreRaw * rules.getSkillWeight() / 100) +
            (expScoreRaw * rules.getExperienceWeight() / 100) +
            (eduScoreRaw * rules.getEducationWeight() / 100) +
            (locScoreRaw * rules.getLocationWeight() / 100) +
            (salScoreRaw * rules.getSalaryWeight() / 100) +
            (remScoreRaw * rules.getRemoteWeight() / 100);

        log.debug("Matching Completed: Candidate {} to Job {}, Score: {}", candidate.getId(), job.getId(), totalScore);

        return MatchResult.builder()
                .jobId(job.getId())
                .candidateId(candidate.getId())
                .overallScore(totalScore)
                .skillScore(skillScoreRaw)
                .experienceScore(expScoreRaw)
                .educationScore(eduScoreRaw)
                .locationScore(locScoreRaw)
                .salaryScore(salScoreRaw)
                .remoteScore(remScoreRaw)
                .explanations(explanations)
                .build();
    }

    private int parseRequiredYears(String experienceLevel) {
        String lower = experienceLevel.toLowerCase();
        if (lower.contains("senior") || lower.contains("sr")) return 5;
        if (lower.contains("mid") || lower.contains("intermediate")) return 3;
        if (lower.contains("entry") || lower.contains("junior")) return 1;
        if (lower.contains("principal") || lower.contains("staff") || lower.contains("lead")) return 8;
        return 0; // Unknown or none specified
    }
}
