package com.jobpilotai.backend.job.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Response DTO for company details.
 */
@Getter
@Setter
public class CompanyResponse {

    @JsonProperty("public_id")
    private UUID publicId;

    private String name;

    private String website;

    @JsonProperty("logo_url")
    private String logoUrl;

    private String industry;

    private String headquarters;

    private String size;

    private String description;

    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonProperty("updated_at")
    private Instant updatedAt;
}
