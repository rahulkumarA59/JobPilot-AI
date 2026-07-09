-- Migration for AI Gateway Platform
-- Creates table for AI usage tracking

CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    public_id VARCHAR(36) NOT NULL UNIQUE,
    provider VARCHAR(50) NOT NULL,
    model_name VARCHAR(120),
    operation VARCHAR(120),
    candidate_profile_id BIGINT,
    workflow_id BIGINT,
    application_id BIGINT,
    prompt_type VARCHAR(80),
    estimated_input_tokens INT DEFAULT 0,
    estimated_output_tokens INT DEFAULT 0,
    estimated_total_tokens INT DEFAULT 0,
    estimated_cost DECIMAL(10, 6) DEFAULT 0.000000,
    latency_ms BIGINT DEFAULT 0,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_ai_usage_provider (provider),
    KEY idx_ai_usage_candidate (candidate_profile_id),
    KEY idx_ai_usage_workflow (workflow_id),
    KEY idx_ai_usage_application (application_id),
    KEY idx_ai_usage_created_at (created_at)
) ;
