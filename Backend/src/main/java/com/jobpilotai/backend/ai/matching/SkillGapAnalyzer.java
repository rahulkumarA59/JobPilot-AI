package com.jobpilotai.backend.ai.matching;

import com.jobpilotai.backend.ai.dto.SkillGap;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.candidateprofile.domain.CandidateSkill;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.domain.JobSkill;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Detects missing, weak, strong, and recommended skills.
 */
@Service
public class SkillGapAnalyzer {

    public SkillGap analyzeSkillGap(CandidateProfile candidate, Job job) {
        Set<String> candidateSkills = candidate.getSkills().stream()
                .map(CandidateSkill::getSkillName)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        Set<String> jobSkills = job.getSkills().stream()
                .map(JobSkill::getSkillName)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<String> missingSkills = jobSkills.stream()
                .filter(skill -> !candidateSkills.contains(skill))
                .collect(Collectors.toList());

        List<String> strongSkills = jobSkills.stream()
                .filter(candidateSkills::contains)
                .collect(Collectors.toList());

        // Simple heuristic for weak skills: If they have it but it's beginner
        List<String> weakSkills = candidate.getSkills().stream()
                .filter(s -> jobSkills.contains(s.getSkillName().toLowerCase()))
                .filter(s -> s.getProficiency() == CandidateSkill.Proficiency.BEGINNER)
                .map(CandidateSkill::getSkillName)
                .collect(Collectors.toList());

        // Recommended skills: missing + weak
        List<String> recommendedSkills = missingSkills;

        int priorityScore = calculatePriorityScore(missingSkills.size(), jobSkills.size());
        String learningDifficulty = calculateDifficulty(missingSkills.size());
        int estimatedLearningTime = missingSkills.size() * 2; // Arbitrary 2 weeks per skill for V1

        return SkillGap.builder()
                .missingSkills(missingSkills)
                .weakSkills(weakSkills)
                .strongSkills(strongSkills)
                .recommendedSkills(recommendedSkills)
                .priorityScore(priorityScore)
                .learningDifficulty(learningDifficulty)
                .estimatedLearningTimeWeeks(estimatedLearningTime)
                .build();
    }

    private int calculatePriorityScore(int missing, int total) {
        if (total == 0) return 0;
        double ratio = (double) missing / total;
        return (int) (ratio * 100);
    }

    private String calculateDifficulty(int missingCount) {
        if (missingCount == 0) return "None";
        if (missingCount <= 2) return "Easy";
        if (missingCount <= 5) return "Medium";
        return "Hard";
    }
}
