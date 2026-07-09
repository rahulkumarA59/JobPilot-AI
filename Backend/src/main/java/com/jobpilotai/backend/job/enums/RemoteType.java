package com.jobpilotai.backend.job.enums;

/**
 * Represents the work location type for a job posting.
 */
public enum RemoteType {
    REMOTE("Remote"),
    HYBRID("Hybrid"),
    ONSITE("On-site");

    private final String displayName;

    RemoteType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
