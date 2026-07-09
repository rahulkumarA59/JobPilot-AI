package com.jobpilotai.backend.orchestrator.event;

import com.jobpilotai.backend.orchestrator.domain.WorkflowEventType;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.util.UUID;

@Getter
public class WorkflowDomainEvent extends ApplicationEvent {

    private final UUID workflowPublicId;
    private final WorkflowEventType eventType;
    private final String stepName;

    public WorkflowDomainEvent(Object source, UUID workflowPublicId, WorkflowEventType eventType, String stepName) {
        super(source);
        this.workflowPublicId = workflowPublicId;
        this.eventType = eventType;
        this.stepName = stepName;
    }
}
