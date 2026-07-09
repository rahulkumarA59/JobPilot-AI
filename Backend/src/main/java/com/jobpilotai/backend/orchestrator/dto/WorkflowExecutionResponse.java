package com.jobpilotai.backend.orchestrator.dto;

import java.time.Instant;
import java.util.UUID;

public record WorkflowExecutionResponse(
        UUID workflowPublicId,
        String workflowType,
        String status,
        String currentStep,
        double progressPercent,
        long elapsedMs,
        Instant startedAt
) {}
