package com.jobpilotai.backend.job.enums;

/**
 * Represents the lifecycle status of a job posting.
 */
public enum JobStatus {
    ACTIVE("Active"),
    EXPIRED("Expired"),
    CLOSED("Closed"),
    DRAFT("Draft");

    private final String displayName;

    JobStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
