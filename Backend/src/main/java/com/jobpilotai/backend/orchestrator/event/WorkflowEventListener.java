package com.jobpilotai.backend.orchestrator.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class WorkflowEventListener {

    @Async
    @EventListener
    public void handleWorkflowDomainEvent(WorkflowDomainEvent event) {
        log.info("Received async workflow event: type={}, workflow={}, step={}",
                event.getEventType(), event.getWorkflowPublicId(), event.getStepName());
        
        // Additional async processing like sending notifications can happen here
    }
}
