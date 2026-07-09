-- Migration for Browser Automation Platform
-- Creates tables for tracking executions and screenshots

CREATE TABLE IF NOT EXISTS automation_executions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    public_id VARCHAR(36) NOT NULL UNIQUE,
    application_id BIGINT NOT NULL,
    workflow_id VARCHAR(120),
    current_step VARCHAR(120),
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
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
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    KEY idx_auto_exec_application (application_id),
    KEY idx_auto_exec_status (status)
) ;

CREATE TABLE IF NOT EXISTS automation_screenshots (
    id BIGINT NOT NULL AUTO_INCREMENT,
    execution_id BIGINT NOT NULL,
    screenshot_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(1024) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (execution_id) REFERENCES automation_executions(id) ON DELETE CASCADE,
    KEY idx_auto_screenshot_exec (execution_id)
) ;
