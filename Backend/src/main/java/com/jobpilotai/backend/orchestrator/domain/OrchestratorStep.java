package com.jobpilotai.backend.orchestrator.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "orchestrator_steps")
@Getter
@Setter
public class OrchestratorStep extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private OrchestratorWorkflow workflow;

    @Column(name = "step_name", nullable = false, length = 120)
    private String stepName;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private StepStatus status = StepStatus.PENDING;

    @Column(name = "depends_on", length = 500)
    private String dependsOn;

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

    @Column(name = "output_reference", length = 500)
    private String outputReference;
}
