package com.jobpilotai.backend.browserautomation.domain;

public enum AutomationStatus {
    CREATED,
    QUEUED,
    STARTING,
    RUNNING,
    WAITING,
    UPLOADING,
    SUBMITTING,
    VERIFYING,
    COMPLETED,
    FAILED,
    CANCELLED,
    RETRYING;

    public boolean isTerminal() {
        return this == COMPLETED || this == FAILED || this == CANCELLED;
    }
}
