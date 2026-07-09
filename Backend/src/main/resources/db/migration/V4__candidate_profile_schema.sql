-- Migration for Candidate Profile module
-- Creates tables for candidate profiles, skills, experiences, and projects

CREATE TABLE IF NOT EXISTS candidate_profiles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    public_id VARCHAR(36) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    resume_id BIGINT NOT NULL,
    headline VARCHAR(200),
    summary VARCHAR(2000),
    total_experience_years INT,
    "current_role" VARCHAR(150),
    current_company VARCHAR(200),
    highest_education VARCHAR(150),
    current_location VARCHAR(150),
    preferred_locations VARCHAR(1000),
    expected_salary BIGINT,
    notice_period VARCHAR(100),
    profile_strength INT,
    completeness_score INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(120),
    updated_by VARCHAR(120),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    KEY idx_user_resume (user_id, resume_id),
    KEY idx_candidate_profiles_public_id (public_id)
) ;

CREATE TABLE IF NOT EXISTS candidate_skills (
    id BIGINT NOT NULL AUTO_INCREMENT,
    profile_id BIGINT NOT NULL,
    skill_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    proficiency VARCHAR(20) NOT NULL,
    experience_years INT,
    confidence_score INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (profile_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    KEY idx_candidate_skills_profile (profile_id)
) ;

CREATE TABLE IF NOT EXISTS candidate_experiences (
    id BIGINT NOT NULL AUTO_INCREMENT,
    profile_id BIGINT NOT NULL,
    company VARCHAR(200) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    start_date DATE,
    end_date DATE,
    duration VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (profile_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    KEY idx_candidate_experiences_profile (profile_id)
) ;

CREATE TABLE IF NOT EXISTS candidate_experience_technologies (
    experience_id BIGINT NOT NULL,
    technology VARCHAR(100) NOT NULL,
    FOREIGN KEY (experience_id) REFERENCES candidate_experiences(id) ON DELETE CASCADE,
    KEY idx_experience (experience_id)
) ;

CREATE TABLE IF NOT EXISTS candidate_projects (
    id BIGINT NOT NULL AUTO_INCREMENT,
    profile_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (profile_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    KEY idx_candidate_projects_profile (profile_id)
) ;

CREATE TABLE IF NOT EXISTS candidate_project_technologies (
    project_id BIGINT NOT NULL,
    technology VARCHAR(100) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES candidate_projects(id) ON DELETE CASCADE,
    KEY idx_project (project_id)
) ;
