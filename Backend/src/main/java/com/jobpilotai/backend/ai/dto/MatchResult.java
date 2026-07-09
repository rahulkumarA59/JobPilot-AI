package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class MatchResult {
    private Long jobId;
    private Long candidateId;
    private int overallScore;
    private int skillScore;
    private int experienceScore;
    private int educationScore;
    private int locationScore;
    private int salaryScore;
    private int remoteScore;
    private List<ExplainabilityReport> explanations;
}
