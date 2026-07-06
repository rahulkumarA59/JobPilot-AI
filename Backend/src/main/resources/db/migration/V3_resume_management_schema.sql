-- (Deprecated) V3_resume_management_schema.sql
-- Resume Management schema (metadata only; files stored on disk via FileStorageService)

CREATE TABLE resumes (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    public_id CHAR(36) NOT NULL UNIQUE,

    user_id BIGINT NOT NULL,

    original_filename VARCHAR(512) NOT NULL,
    stored_filename VARCHAR(512) NOT NULL,
    file_path VARCHAR(1024) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    checksum CHAR(64) NOT NULL,

    active BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMP NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(120),
    updated_by VARCHAR(120),

    CONSTRAINT fk_resumes_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_user_checksum ON resumes(user_id, checksum);
CREATE INDEX idx_resumes_active ON resumes(active);


CREATE TABLE resume_versions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    resume_id BIGINT NOT NULL,

    version_number INT NOT NULL,
    version_name VARCHAR(255) NOT NULL,
    source VARCHAR(20) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_by VARCHAR(120),
    updated_by VARCHAR(120),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    CONSTRAINT fk_resume_versions_resume
        FOREIGN KEY (resume_id) REFERENCES resumes (id)
);

CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);
CREATE INDEX idx_resume_versions_resume_number ON resume_versions(resume_id, version_number);

