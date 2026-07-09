package com.jobpilotai.backend.job.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Represents a company that posts jobs.
 * Shared across all connectors — ensures no duplicate companies.
 */
@Getter
@Setter
@Entity
@Table(name = "companies", indexes = {
    @Index(name = "idx_companies_public_id", columnList = "public_id"),
    @Index(name = "idx_companies_name", columnList = "name")
})
public class Company extends BaseEntity {

    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private UUID publicId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "website", length = 500)
    private String website;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "industry", length = 150)
    private String industry;

    @Column(name = "headquarters", length = 200)
    private String headquarters;

    @Column(name = "size", length = 50)
    private String size;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @PrePersist
    private void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
    }
}
