package com.jobpilotai.backend.jobsource.domain;

/**
 * Represents the source platform where a job was posted.
 */
public enum JobSource {
    LINKEDIN("LinkedIn"),
    GREENHOUSE("Greenhouse"),
    LEVER("Lever"),
    ASHBY("Ashby"),
    WORKDAY("Workday"),
    COMPANY_CAREER("Company Career Site"),
    MANUAL("Manual Entry");

    private final String displayName;

    JobSource(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
