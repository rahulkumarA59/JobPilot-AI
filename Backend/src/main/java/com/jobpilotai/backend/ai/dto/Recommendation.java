package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Recommendation {
    private List<RankedJob> topJobs;
    private List<String> topCompanies;
    private LearningRoadmap learningRoadmap;
    private List<String> resumeImprovements;
    private List<String> recommendedProjects;
    private List<String> recommendedCertifications;
}
