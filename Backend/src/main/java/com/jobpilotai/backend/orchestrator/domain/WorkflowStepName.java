package com.jobpilotai.backend.orchestrator.domain;

public enum WorkflowStepName {
    RESUME_UPLOAD("Resume Upload"),
    RESUME_PARSING("Resume Parsing"),
    CANDIDATE_PROFILE_GENERATION("Candidate Profile Generation"),
    JOB_COLLECTION("Job Collection"),
    JOB_MATCHING("Job Matching"),
    RESUME_TAILORING("Resume Tailoring"),
    COVER_LETTER_GENERATION("Cover Letter Generation"),
    APPLICATION_QUEUE("Application Queue"),
    BROWSER_AUTOMATION("Browser Automation"),
    APPLICATION_TRACKING("Application Tracking"),
    NOTIFICATION("Notification");

    private final String displayName;

    WorkflowStepName(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
