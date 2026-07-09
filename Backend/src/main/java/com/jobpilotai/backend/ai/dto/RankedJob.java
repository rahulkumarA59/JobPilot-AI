package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RankedJob {
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private int rank;
    private int matchScore;
    private Long salary;
    private double companyRating;
    private boolean remoteMatch;
}
