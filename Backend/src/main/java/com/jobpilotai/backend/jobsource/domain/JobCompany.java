package com.jobpilotai.backend.jobsource.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Represents a company that posts jobs on various platforms.
 */
@Getter
@Setter
@Entity
@Table(name = "job_companies")
public class JobCompany extends BaseEntity {

    @org.hibernate.annotations.JdbcTypeCode(java.sql.Types.VARCHAR)
    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private UUID publicId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "website", length = 500)
    private String website;

    @Column(name = "industry", length = 150)
    private String industry;

    @Column(name = "headquarters", length = 200)
    private String headquarters;

    @Column(name = "company_size", length = 50)
    private String companySize; // e.g., "1-50", "51-200", "201-500", "500+"

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @PrePersist
    private void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
    }
}
