package com.jobpilotai.backend.orchestrator.domain;

public enum WorkflowType {
    FULL_APPLICATION("Full Application Pipeline"),
    RESUME_ONLY("Resume Upload & Parse"),
    JOB_MATCH("Job Collection & Matching"),
    APPLICATION_SUBMIT("Application Submission");

    private final String displayName;

    WorkflowType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
