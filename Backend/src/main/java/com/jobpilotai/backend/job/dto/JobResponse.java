package com.jobpilotai.backend.job.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for job posting details.
 */
@Getter
@Setter
public class JobResponse {

    @JsonProperty("public_id")
    private UUID publicId;

    private String source;

    @JsonProperty("external_job_id")
    private String externalJobId;

    private String title;

    private String description;

    private CompanyResponse company;

    private String location;

    @JsonProperty("remote_type")
    private String remoteType;

    @JsonProperty("employment_type")
    private String employmentType;

    @JsonProperty("experience_level")
    private String experienceLevel;

    @JsonProperty("salary_min")
    private Long salaryMin;

    @JsonProperty("salary_max")
    private Long salaryMax;

    private String currency;

    @JsonProperty("apply_url")
    private String applyUrl;

    @JsonProperty("job_url")
    private String jobUrl;

    @JsonProperty("posted_date")
    private LocalDate postedDate;

    @JsonProperty("expires_date")
    private LocalDate expiresDate;

    private String status;

    private List<JobSkillResponse> skills;

    private List<String> benefits;

    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonProperty("updated_at")
    private Instant updatedAt;
}
