package com.jobpilotai.backend.orchestrator.event;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorEvent;
import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.WorkflowEventType;
import com.jobpilotai.backend.orchestrator.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class WorkflowEventPublisherTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private ApplicationEventPublisher applicationEventPublisher;

    @InjectMocks
    private WorkflowEventPublisher publisher;

    private OrchestratorWorkflow workflow;

    @BeforeEach
    void setUp() {
        workflow = new OrchestratorWorkflow();
        workflow.setPublicId(UUID.randomUUID());
    }

    @Test
    void publish_ShouldSaveAndPublish() {
        publisher.publish(workflow, WorkflowEventType.WORKFLOW_STARTED, "STEP", "{}");
        
        verify(eventRepository).save(any(OrchestratorEvent.class));
        verify(applicationEventPublisher).publishEvent(any(WorkflowDomainEvent.class));
    }

    @Test
    void publishWorkflowCompleted_ShouldCallPublish() {
        publisher.publishWorkflowCompleted(workflow);
        verify(eventRepository).save(any(OrchestratorEvent.class));
    }
}
