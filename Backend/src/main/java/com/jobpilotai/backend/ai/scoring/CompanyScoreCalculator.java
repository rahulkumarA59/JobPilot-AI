package com.jobpilotai.backend.ai.scoring;

import com.jobpilotai.backend.ai.dto.CompanyScore;
import com.jobpilotai.backend.job.domain.Company;
import org.springframework.stereotype.Service;

/**
 * Calculates scores and probabilities related to a Company.
 */
@Service
public class CompanyScoreCalculator {

    public CompanyScore calculateScore(Company company) {
        // V1 deterministic fallback based on size and industry
        String size = company.getSize() != null ? company.getSize() : "Unknown";
        
        int hiringProbability = 50; // Default
        String competitionLevel = "Medium";
        int careerGrowth = 60;
        String interviewDifficulty = "Medium";

        if (size.contains("10,001") || size.contains("5001")) {
            hiringProbability = 40;
            competitionLevel = "High";
            careerGrowth = 80;
            interviewDifficulty = "Hard";
        } else if (size.contains("1-10") || size.contains("11-50")) {
            hiringProbability = 70;
            competitionLevel = "Low";
            careerGrowth = 90; // Startups = high growth potential
            interviewDifficulty = "Easy";
        }

        return CompanyScore.builder()
                .hiringProbability(hiringProbability)
                .competitionLevel(competitionLevel)
                .careerGrowth(careerGrowth)
                .interviewDifficulty(interviewDifficulty)
                .build();
    }
}
