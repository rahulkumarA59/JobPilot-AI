-- Migration for AI Orchestrator Platform
-- Creates tables for workflow orchestration, steps, events, and logs

CREATE TABLE IF NOT EXISTS orchestrator_workflows (
    id BIGINT NOT NULL AUTO_INCREMENT,
    public_id VARCHAR(36) NOT NULL UNIQUE,
    candidate_profile_id BIGINT,
    workflow_type VARCHAR(80) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
    current_step VARCHAR(120),
    total_steps INT NOT NULL DEFAULT 0,
    completed_steps INT NOT NULL DEFAULT 0,
    started_at TIMESTAMP NULL,
    finished_at TIMESTAMP NULL,
    duration BIGINT DEFAULT 0,
    retry_count INT NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(120),
    updated_by VARCHAR(120),
    PRIMARY KEY (id),
    KEY idx_orch_wf_status (status),
    KEY idx_orch_wf_candidate (candidate_profile_id),
    KEY idx_orch_wf_type (workflow_type)
) ;

CREATE TABLE IF NOT EXISTS orchestrator_steps (
    id BIGINT NOT NULL AUTO_INCREMENT,
    workflow_id BIGINT NOT NULL,
    step_name VARCHAR(120) NOT NULL,
    step_order INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    depends_on VARCHAR(500),
    started_at TIMESTAMP NULL,
    finished_at TIMESTAMP NULL,
    duration BIGINT DEFAULT 0,
    retry_count INT NOT NULL DEFAULT 0,
    error_message TEXT,
    output_reference VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (workflow_id) REFERENCES orchestrator_workflows(id) ON DELETE CASCADE,
    KEY idx_orch_step_workflow (workflow_id),
    KEY idx_orch_step_status (status)
) ;

CREATE TABLE IF NOT EXISTS orchestrator_events (
    id BIGINT NOT NULL AUTO_INCREMENT,
    workflow_id BIGINT NOT NULL,
    event_type VARCHAR(80) NOT NULL,
    step_name VARCHAR(120),
    payload TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (workflow_id) REFERENCES orchestrator_workflows(id) ON DELETE CASCADE,
    KEY idx_orch_event_workflow (workflow_id),
    KEY idx_orch_event_type (event_type)
) ;

CREATE TABLE IF NOT EXISTS orchestrator_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    workflow_id BIGINT NOT NULL,
    step_name VARCHAR(120),
    log_level VARCHAR(20) NOT NULL DEFAULT 'INFO',
    message TEXT NOT NULL,
    execution_time BIGINT,
    failure_reason TEXT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (workflow_id) REFERENCES orchestrator_workflows(id) ON DELETE CASCADE,
    KEY idx_orch_log_workflow (workflow_id),
    KEY idx_orch_log_level (log_level)
) ;
