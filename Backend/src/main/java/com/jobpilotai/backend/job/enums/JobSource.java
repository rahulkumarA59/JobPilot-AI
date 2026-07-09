package com.jobpilotai.backend.job.enums;

/**
 * Represents the source platform where a job was discovered.
 * Every future connector maps to one of these sources.
 */
public enum JobSource {
    LINKEDIN("LinkedIn"),
    GREENHOUSE("Greenhouse"),
    LEVER("Lever"),
    WORKDAY("Workday"),
    ASHBY("Ashby"),
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
