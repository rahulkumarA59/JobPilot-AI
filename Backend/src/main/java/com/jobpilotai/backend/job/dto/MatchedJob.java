package com.jobpilotai.backend.job.dto;

import com.jobpilotai.backend.job.domain.Job;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MatchedJob {
    private Job job;
    private int matchScore; // 0-100
    private String matchReasons;
    private int skillOverlapPercentage;
    private String aiAnalysis;
}
