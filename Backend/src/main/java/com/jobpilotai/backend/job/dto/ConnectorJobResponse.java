package com.jobpilotai.backend.job.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Response DTO for connector execution results.
 */
@Getter
@Setter
@Builder
public class ConnectorJobResponse {

    private String source;

    @JsonProperty("jobs_fetched")
    private int jobsFetched;

    @JsonProperty("jobs_saved")
    private int jobsSaved;

    @JsonProperty("duplicates_skipped")
    private int duplicatesSkipped;

    @JsonProperty("validation_failures")
    private int validationFailures;

    @JsonProperty("connector_healthy")
    private boolean connectorHealthy;

    @JsonProperty("execution_time_ms")
    private long executionTimeMs;

    @JsonProperty("executed_at")
    private Instant executedAt;
}
