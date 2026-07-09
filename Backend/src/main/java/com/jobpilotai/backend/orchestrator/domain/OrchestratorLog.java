package com.jobpilotai.backend.orchestrator.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "orchestrator_logs")
@Getter
@Setter
public class OrchestratorLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private OrchestratorWorkflow workflow;

    @Column(name = "step_name", length = 120)
    private String stepName;

    @Column(name = "log_level", nullable = false, length = 20)
    private String logLevel = "INFO";

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "execution_time")
    private Long executionTime;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "retry_count")
    private Integer retryCount = 0;
}
