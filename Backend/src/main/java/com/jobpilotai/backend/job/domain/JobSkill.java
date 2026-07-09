package com.jobpilotai.backend.job.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a skill requirement for a job posting.
 * Structured child entity — replaces the comma-separated skills field.
 */
@Getter
@Setter
@Entity
@Table(name = "job_skills", indexes = {
    @Index(name = "idx_job_skills_job_id", columnList = "job_id")
})
public class JobSkill extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "skill_name", nullable = false, length = 150)
    private String skillName;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "required", nullable = false)
    private boolean required = true;

    @Column(name = "priority", nullable = false)
    private int priority = 0;
}
