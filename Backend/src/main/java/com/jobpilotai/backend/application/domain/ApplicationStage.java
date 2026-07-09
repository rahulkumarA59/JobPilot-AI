package com.jobpilotai.backend.application.domain;

public enum ApplicationStage {
    QUEUED,
    READY,
    PREPARING,
    READY_TO_APPLY,
    APPLYING,
    APPLIED,
    APPLICATION_CONFIRMED,
    ASSESSMENT,
    INTERVIEW,
    OFFER,
    HIRED,
    REJECTED,
    WITHDRAWN,
    FAILED;

    public boolean isTerminal() {
        return this == HIRED || this == REJECTED || this == WITHDRAWN || this == FAILED;
    }
}
