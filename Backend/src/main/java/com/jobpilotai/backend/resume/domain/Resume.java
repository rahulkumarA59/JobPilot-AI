package com.jobpilotai.backend.resume.domain;

import com.jobpilotai.backend.common.domain.AuditableEntity;
import com.jobpilotai.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "resumes")
public class Resume extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @org.hibernate.annotations.JdbcTypeCode(java.sql.Types.VARCHAR)
    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private UUID publicId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "original_filename", nullable = false, length = 512)
    private String originalFilename;

    @Column(name = "stored_filename", nullable = false, length = 512)
    private String storedFilename;

    @Column(name = "file_path", nullable = false, length = 1024)
    private String filePath;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "mime_type", nullable = false, length = 120)
    private String mimeType;

    @Column(name = "checksum", nullable = false, length = 64)
    private String checksum;

    @Column(name = "active", nullable = false)
    private boolean active;

    @Column(name = "uploaded_at", nullable = false)
    private Instant uploadedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ResumeStatus status = ResumeStatus.ACTIVE;

    @PrePersist
    private void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
    }

    public void activate() {
        this.active = true;
        this.status = ResumeStatus.ACTIVE;
    }

    public void deactivate() {
        this.active = false;
        if (this.status == ResumeStatus.ACTIVE) {
            this.status = ResumeStatus.ARCHIVED;
        }
    }

    public void softDelete() {
        this.active = false;
        this.status = ResumeStatus.DELETED;
    }
}

