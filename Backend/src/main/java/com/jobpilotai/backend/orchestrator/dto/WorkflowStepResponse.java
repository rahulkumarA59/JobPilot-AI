package com.jobpilotai.backend.orchestrator.dto;

import java.time.Instant;

public record WorkflowStepResponse(
        String stepName,
        int stepOrder,
        String status,
        String dependsOn,
        Instant startedAt,
        Instant finishedAt,
        long duration,
        int retryCount,
        String errorMessage,
        String outputReference
) {}
