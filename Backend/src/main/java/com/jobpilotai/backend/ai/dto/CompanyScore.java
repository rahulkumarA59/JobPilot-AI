package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyScore {
    private int hiringProbability; // 0-100
    private String competitionLevel; // "Low", "Medium", "High"
    private int careerGrowth; // 0-100
    private String interviewDifficulty; // "Easy", "Medium", "Hard"
}
