package com.jobpilotai.backend.job.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;

/**
 * Response DTO for job analytics data.
 */
@Getter
@Setter
@Builder
public class JobAnalyticsResponse {

    @JsonProperty("total_jobs")
    private long totalJobs;

    @JsonProperty("active_jobs")
    private long activeJobs;

    @JsonProperty("expired_jobs")
    private long expiredJobs;

    @JsonProperty("jobs_per_source")
    private Map<String, Long> jobsPerSource;

    @JsonProperty("jobs_per_company")
    private Map<String, Long> jobsPerCompany;

    @JsonProperty("remote_percentage")
    private double remotePercentage;

    @JsonProperty("average_salary_min")
    private double averageSalaryMin;

    @JsonProperty("average_salary_max")
    private double averageSalaryMax;

    @JsonProperty("top_skills")
    private Map<String, Long> topSkills;

    @JsonProperty("top_hiring_companies")
    private Map<String, Long> topHiringCompanies;

    @JsonProperty("jobs_per_employment_type")
    private Map<String, Long> jobsPerEmploymentType;

    @JsonProperty("jobs_per_remote_type")
    private Map<String, Long> jobsPerRemoteType;

    @JsonProperty("generated_at")
    private Instant generatedAt;
}
