package com.jobpilotai.backend.orchestrator.domain;

public enum WorkflowStatus {
    CREATED,
    READY,
    RUNNING,
    WAITING,
    PAUSED,
    FAILED,
    COMPLETED,
    CANCELLED;

    public boolean isTerminal() {
        return this == COMPLETED || this == FAILED || this == CANCELLED;
    }

    public boolean isActive() {
        return this == RUNNING || this == WAITING;
    }
}
