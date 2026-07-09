package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateScore {
    private int candidateScore; // Overall rating
    private int profileQuality; // Completeness and detail
    private int readinessScore; // Preparedness for interviews
    private int applicationReadiness; // Preparedness to apply
}
