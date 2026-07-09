package com.jobpilotai.backend.job.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;

/**
 * Response DTO for company-level analytics.
 */
@Getter
@Setter
@Builder
public class CompanyAnalyticsResponse {

    @JsonProperty("total_companies")
    private long totalCompanies;

    @JsonProperty("companies_per_industry")
    private Map<String, Long> companiesPerIndustry;

    @JsonProperty("companies_per_size")
    private Map<String, Long> companiesPerSize;

    @JsonProperty("top_hiring_companies")
    private Map<String, Long> topHiringCompanies;

    @JsonProperty("average_jobs_per_company")
    private double averageJobsPerCompany;

    @JsonProperty("generated_at")
    private Instant generatedAt;
}
