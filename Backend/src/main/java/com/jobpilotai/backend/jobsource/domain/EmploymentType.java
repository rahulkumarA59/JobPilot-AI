package com.jobpilotai.backend.jobsource.domain;

/**
 * Represents the employment type for a job posting.
 */
public enum EmploymentType {
    FULL_TIME("Full-time"),
    PART_TIME("Part-time"),
    INTERNSHIP("Internship"),
    CONTRACT("Contract");

    private final String displayName;

    EmploymentType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
