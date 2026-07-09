package com.jobpilotai.backend.orchestrator.event;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorEvent;
import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.WorkflowEventType;
import com.jobpilotai.backend.orchestrator.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkflowEventPublisher {

    private final EventRepository eventRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Transactional
    public void publish(OrchestratorWorkflow workflow, WorkflowEventType eventType, String stepName, String payload) {
        OrchestratorEvent event = new OrchestratorEvent();
        event.setWorkflow(workflow);
        event.setEventType(eventType);
        event.setStepName(stepName);
        event.setPayload(payload);
        eventRepository.save(event);

        log.info("Workflow event published: type={}, workflow={}, step={}",
                eventType, workflow.getPublicId(), stepName);

        applicationEventPublisher.publishEvent(new WorkflowDomainEvent(this, workflow.getPublicId(), eventType, stepName));
    }

    @Transactional
    public void publishWorkflowStarted(OrchestratorWorkflow workflow) {
        publish(workflow, WorkflowEventType.WORKFLOW_STARTED, null, null);
    }

    @Transactional
    public void publishWorkflowCompleted(OrchestratorWorkflow workflow) {
        publish(workflow, WorkflowEventType.WORKFLOW_COMPLETED, null, null);
    }

    @Transactional
    public void publishWorkflowFailed(OrchestratorWorkflow workflow, String reason) {
        publish(workflow, WorkflowEventType.WORKFLOW_FAILED, null, reason);
    }

    @Transactional
    public void publishStepStarted(OrchestratorWorkflow workflow, String stepName) {
        publish(workflow, WorkflowEventType.STEP_STARTED, stepName, null);
    }

    @Transactional
    public void publishStepCompleted(OrchestratorWorkflow workflow, String stepName) {
        publish(workflow, WorkflowEventType.STEP_COMPLETED, stepName, null);
    }

    @Transactional
    public void publishStepFailed(OrchestratorWorkflow workflow, String stepName, String reason) {
        publish(workflow, WorkflowEventType.STEP_FAILED, stepName, reason);
    }

    @Transactional
    public void publishRetryStarted(OrchestratorWorkflow workflow, String stepName) {
        publish(workflow, WorkflowEventType.RETRY_STARTED, stepName, null);
    }

    @Transactional
    public void publishRetryCompleted(OrchestratorWorkflow workflow, String stepName) {
        publish(workflow, WorkflowEventType.RETRY_COMPLETED, stepName, null);
    }
}
