package com.jobpilotai.backend.orchestrator.domain;

import com.jobpilotai.backend.common.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;

import java.sql.Types;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orchestrator_workflows")
@Getter
@Setter
public class OrchestratorWorkflow extends AuditableEntity {

    @JdbcTypeCode(Types.VARCHAR)
    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private UUID publicId;

    @Column(name = "candidate_profile_id")
    private Long candidateProfileId;

    @Enumerated(EnumType.STRING)
    @Column(name = "workflow_type", nullable = false, length = 80)
    private WorkflowType workflowType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private WorkflowStatus status = WorkflowStatus.CREATED;

    @Column(name = "current_step", length = 120)
    private String currentStep;

    @Column(name = "total_steps", nullable = false)
    private Integer totalSteps = 0;

    @Column(name = "completed_steps", nullable = false)
    private Integer completedSteps = 0;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    @Column(name = "duration")
    private Long duration = 0L;

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @OneToMany(mappedBy = "workflow", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepOrder ASC")
    private List<OrchestratorStep> steps = new ArrayList<>();

    @PrePersist
    private void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
    }
}
