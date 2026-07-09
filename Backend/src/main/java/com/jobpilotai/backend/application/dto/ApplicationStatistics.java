package com.jobpilotai.backend.application.dto;

import lombok.Data;

import java.util.Map;

@Data
public class ApplicationStatistics {
    private int totalApplications;
    private int applied;
    private int inProgress;
    private int failed;
    private int successful;
    private Map<String, Integer> stageDistribution;
}
