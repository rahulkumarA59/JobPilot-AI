package com.jobpilotai.backend.ai.gateway.domain;

public enum PromptType {
    RESUME_TAILORING("Resume Tailoring"),
    COVER_LETTER("Cover Letter"),
    SKILL_GAP("Skill Gap Analysis"),
    LEARNING_ROADMAP("Learning Roadmap"),
    CAREER_ADVICE("Career Advice"),
    RESUME_PARSING("Resume Parsing"),
    JOB_MATCHING("Job Matching");

    private final String displayName;

    PromptType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
