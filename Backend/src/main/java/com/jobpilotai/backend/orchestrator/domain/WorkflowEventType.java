package com.jobpilotai.backend.orchestrator.domain;

public enum WorkflowEventType {
    WORKFLOW_STARTED,
    WORKFLOW_COMPLETED,
    WORKFLOW_FAILED,
    WORKFLOW_PAUSED,
    WORKFLOW_RESUMED,
    WORKFLOW_CANCELLED,
    STEP_STARTED,
    STEP_COMPLETED,
    STEP_FAILED,
    STEP_SKIPPED,
    RETRY_STARTED,
    RETRY_COMPLETED
}
