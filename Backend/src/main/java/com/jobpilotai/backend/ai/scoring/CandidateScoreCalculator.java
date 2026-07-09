package com.jobpilotai.backend.ai.scoring;

import com.jobpilotai.backend.ai.dto.CandidateScore;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import org.springframework.stereotype.Service;

/**
 * Calculates generic quality scores for a CandidateProfile.
 */
@Service
public class CandidateScoreCalculator {

    public CandidateScore calculateScore(CandidateProfile profile) {
        int profileQuality = 0;
        
        // V1 deterministic completeness check
        if (profile.getSummary() != null && !profile.getSummary().isBlank()) profileQuality += 20;
        if (profile.getCurrentRole() != null) profileQuality += 10;
        if (!profile.getExperiences().isEmpty()) profileQuality += 30;
        if (!profile.getSkills().isEmpty()) profileQuality += 30;
        if (profile.getHighestEducation() != null) profileQuality += 10;

        int applicationReadiness = profileQuality > 80 ? 100 : profileQuality;
        int readinessScore = (profileQuality + applicationReadiness) / 2;
        int overallScore = (profileQuality + readinessScore + applicationReadiness) / 3;

        return CandidateScore.builder()
                .candidateScore(overallScore)
                .profileQuality(profileQuality)
                .readinessScore(readinessScore)
                .applicationReadiness(applicationReadiness)
                .build();
    }
}
