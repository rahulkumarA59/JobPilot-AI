package com.jobpilotai.backend.jobsource.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Represents a job posting from various sources.
 * Unified format for jobs from LinkedIn, Greenhouse, Lever, Ashby, Workday, etc.
 */
@Getter
@Setter
@Entity
@Table(name = "job_postings", indexes = {
    @Index(name = "idx_source_external_id", columnList = "source, external_job_id", unique = true),
    @Index(name = "idx_checksum", columnList = "checksum"),
    @Index(name = "idx_public_id", columnList = "public_id"),
    @Index(name = "idx_company_id", columnList = "company_id"),
    @Index(name = "idx_active", columnList = "active")
})
public class JobPosting extends BaseEntity {

    @org.hibernate.annotations.JdbcTypeCode(java.sql.Types.VARCHAR)
    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private UUID publicId;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false, length = 30)
    private JobSource source;

    @Column(name = "external_job_id", nullable = false, length = 255)
    private String externalJobId; // Job ID from source platform

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private JobCompany company;

    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "location", length = 200)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "remote_type", length = 20)
    private RemoteType remoteType;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", length = 20)
    private EmploymentType employmentType;

    @Column(name = "experience_level", length = 50)
    private String experienceLevel; // e.g., "Entry-level", "Mid-level", "Senior", "Executive"

    @Column(name = "salary_min")
    private Long salaryMin;

    @Column(name = "salary_max")
    private Long salaryMax;

    @Column(name = "currency", length = 10)
    private String currency; // e.g., "USD", "EUR", "INR"

    @Column(name = "skills", columnDefinition = "LONGTEXT")
    private String skills; // JSON or comma-separated list

    @Column(name = "responsibilities", columnDefinition = "LONGTEXT")
    private String responsibilities;

    @Column(name = "qualifications", columnDefinition = "LONGTEXT")
    private String qualifications;

    @Column(name = "benefits", columnDefinition = "LONGTEXT")
    private String benefits;

    @Column(name = "apply_url", length = 500)
    private String applyUrl;

    @Column(name = "job_url", length = 500)
    private String jobUrl;

    @Column(name = "posted_date")
    private LocalDate postedDate;

    @Column(name = "expires_date")
    private LocalDate expiresDate;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @Column(name = "checksum", nullable = false, length = 64, unique = true)
    private String checksum; // SHA-256 for duplicate detection

    @PrePersist
    private void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
        if (!active) {
            active = true;
        }
    }
}
