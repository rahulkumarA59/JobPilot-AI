package com.jobpilotai.backend.orchestrator.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record WorkflowResponse(
        UUID publicId,
        String workflowType,
        String status,
        String currentStep,
        int totalSteps,
        int completedSteps,
        Instant startedAt,
        Instant finishedAt,
        long duration,
        int retryCount,
        String errorMessage,
        List<WorkflowStepResponse> steps
) {}
