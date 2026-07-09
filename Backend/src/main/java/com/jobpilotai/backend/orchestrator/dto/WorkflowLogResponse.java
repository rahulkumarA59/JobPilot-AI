package com.jobpilotai.backend.orchestrator.dto;

import java.time.Instant;

public record WorkflowLogResponse(
        String stepName,
        String logLevel,
        String message,
        Long executionTime,
        String failureReason,
        int retryCount,
        Instant createdAt
) {}
