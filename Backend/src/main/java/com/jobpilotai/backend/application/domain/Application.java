package com.jobpilotai.backend.application.domain;

import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.common.domain.AuditableEntity;
import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.resume.domain.Resume;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "applications")
public class Application extends AuditableEntity {

    @JdbcTypeCode(Types.VARCHAR)
    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private UUID publicId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_profile_id", nullable = false)
    private CandidateProfile candidateProfile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @Column(name = "cover_letter_reference", length = 500)
    private String coverLetterReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "stage", nullable = false, length = 50)
    private ApplicationStage stage = ApplicationStage.QUEUED;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private ApplicationPriority priority = ApplicationPriority.MEDIUM;

    @Column(name = "score", nullable = false)
    private Integer score = 0;

    @Column(name = "source", length = 50)
    private String source;

    @Column(name = "applied_at")
    private Instant appliedAt;

    @Column(name = "next_action_at")
    private Instant nextActionAt;

    @Column(name = "last_updated", nullable = false)
    private Instant lastUpdated;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationDocument> documents = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationHistory> history = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationNote> notes = new ArrayList<>();

    @PrePersist
    private void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
        if (stage == null) {
            stage = ApplicationStage.QUEUED;
        }
        if (priority == null) {
            priority = ApplicationPriority.MEDIUM;
        }
        if (score == null) {
            score = 0;
        }
        lastUpdated = Instant.now();
    }

    @PreUpdate
    private void preUpdate() {
        lastUpdated = Instant.now();
    }
}
