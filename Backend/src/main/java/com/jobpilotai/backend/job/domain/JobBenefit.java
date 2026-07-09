package com.jobpilotai.backend.job.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a benefit offered for a job posting.
 * Structured child entity — replaces the flat text benefits field.
 */
@Getter
@Setter
@Entity
@Table(name = "job_benefits", indexes = {
    @Index(name = "idx_job_benefits_job_id", columnList = "job_id")
})
public class JobBenefit extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "benefit", nullable = false, length = 500)
    private String benefit;
}
