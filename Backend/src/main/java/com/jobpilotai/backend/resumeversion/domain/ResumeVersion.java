package com.jobpilotai.backend.resumeversion.domain;

import com.jobpilotai.backend.common.domain.AuditableEntity;

import com.jobpilotai.backend.resume.domain.Resume;
import com.jobpilotai.backend.resumeversion.domain.ResumeVersionStatus;
import jakarta.persistence.*;




import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "resume_versions")
public class ResumeVersion extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(name = "version_number", nullable = false)
    private int versionNumber;

    @Column(name = "version_name", nullable = false, length = 255)
    private String versionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "source", nullable = false, length = 20)
    private ResumeVersionSource source;


    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ResumeVersionStatus status = ResumeVersionStatus.ACTIVE;



    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;


    @PrePersist
    private void prePersistCreatedAt() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}


