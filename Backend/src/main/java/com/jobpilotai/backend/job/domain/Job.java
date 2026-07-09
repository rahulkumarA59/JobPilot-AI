package com.jobpilotai.backend.job.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import com.jobpilotai.backend.job.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Standard job model for the Job Intelligence Platform.
 * Every connector (LinkedIn, Greenhouse, Lever, Workday, etc.)
 * normalises its data into this entity.
 */
@Getter
@Setter
@Entity
@Table(name = "jobs", indexes = {
    @Index(name = "idx_jobs_public_id", columnList = "public_id"),
    @Index(name = "idx_jobs_source_external_id", columnList = "source, external_job_id", unique = true),
    @Index(name = "idx_jobs_checksum", columnList = "checksum"),
    @Index(name = "idx_jobs_company_id", columnList = "company_id"),
    @Index(name = "idx_jobs_status", columnList = "status")
})
public class Job extends BaseEntity {

    @org.hibernate.annotations.JdbcTypeCode(java.sql.Types.VARCHAR)
    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private UUID publicId;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false, length = 30)
    private JobSource source;

    @Column(name = "external_job_id", nullable = false, length = 255)
    private String externalJobId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "location", length = 200)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "remote_type", length = 20)
    private RemoteType remoteType;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", length = 20)
    private EmploymentType employmentType;

    @Column(name = "experience_level", length = 50)
    private String experienceLevel;

    @Column(name = "salary_min")
    private Long salaryMin;

    @Column(name = "salary_max")
    private Long salaryMax;

    @Column(name = "currency", length = 10)
    private String currency;

    @Column(name = "apply_url", length = 500)
    private String applyUrl;

    @Column(name = "job_url", length = 500)
    private String jobUrl;

    @Column(name = "posted_date")
    private LocalDate postedDate;

    @Column(name = "expires_date")
    private LocalDate expiresDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private JobStatus status = JobStatus.ACTIVE;

    @Column(name = "checksum", nullable = false, length = 64, unique = true)
    private String checksum;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobSkill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobBenefit> benefits = new ArrayList<>();

    @PrePersist
    private void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
        if (status == null) {
            status = JobStatus.ACTIVE;
        }
    }
}
