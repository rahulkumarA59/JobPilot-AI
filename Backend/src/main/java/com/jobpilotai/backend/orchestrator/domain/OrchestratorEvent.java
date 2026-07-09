package com.jobpilotai.backend.orchestrator.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "orchestrator_events")
@Getter
@Setter
public class OrchestratorEvent extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private OrchestratorWorkflow workflow;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 80)
    private WorkflowEventType eventType;

    @Column(name = "step_name", length = 120)
    private String stepName;

    @Column(name = "payload", columnDefinition = "TEXT")
    private String payload;
}
