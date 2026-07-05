package com.jobpilotai.backend.common.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class HealthResponse {

    String application;
    String version;
    String databaseStatus;
    Instant timestamp;
}
