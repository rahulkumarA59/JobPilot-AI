package com.jobpilotai.backend.orchestrator.service;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.WorkflowStatus;
import com.jobpilotai.backend.orchestrator.domain.WorkflowType;
import com.jobpilotai.backend.orchestrator.event.WorkflowEventPublisher;
import com.jobpilotai.backend.orchestrator.repository.WorkflowRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkflowEngineTest {

    @Mock
    private WorkflowRepository repository;

    @Mock
    private WorkflowEventPublisher eventPublisher;

    @InjectMocks
    private WorkflowEngine workflowEngine;

    private OrchestratorWorkflow workflow;
    private UUID publicId;

    @BeforeEach
    void setUp() {
        publicId = UUID.randomUUID();
        workflow = new OrchestratorWorkflow();
        workflow.setPublicId(publicId);
        workflow.setStatus(WorkflowStatus.CREATED);
    }

    @Test
    void createWorkflow_ShouldSaveAndPublishEvent() {
        when(repository.existsByCandidateProfileIdAndStatusIn(anyLong(), any())).thenReturn(false);

        OrchestratorWorkflow result = workflowEngine.createWorkflow(1L, WorkflowType.FULL_APPLICATION);

        assertNotNull(result);
        assertEquals(WorkflowStatus.CREATED, result.getStatus());
        assertEquals(1L, result.getCandidateProfileId());
        
        verify(repository).save(any(OrchestratorWorkflow.class));
        verify(eventPublisher).publishWorkflowStarted(any(OrchestratorWorkflow.class));
    }

    @Test
    void createWorkflow_ShouldThrowIfActiveExists() {
        when(repository.existsByCandidateProfileIdAndStatusIn(anyLong(), any())).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> 
            workflowEngine.createWorkflow(1L, WorkflowType.FULL_APPLICATION)
        );
        
        verify(repository, never()).save(any());
    }

    @Test
    void startWorkflow_ShouldUpdateStatusToRunning() {
        when(repository.findByPublicId(publicId)).thenReturn(Optional.of(workflow));

        workflowEngine.startWorkflow(publicId);

        assertEquals(WorkflowStatus.RUNNING, workflow.getStatus());
        assertNotNull(workflow.getStartedAt());
        verify(repository).save(workflow);
    }

    @Test
    void pauseWorkflow_ShouldUpdateStatusToPaused() {
        workflow.setStatus(WorkflowStatus.RUNNING);
        when(repository.findByPublicId(publicId)).thenReturn(Optional.of(workflow));

        workflowEngine.pauseWorkflow(publicId);

        assertEquals(WorkflowStatus.PAUSED, workflow.getStatus());
        verify(repository).save(workflow);
    }

    @Test
    void cancelWorkflow_ShouldUpdateStatusAndDuration() {
        when(repository.findByPublicId(publicId)).thenReturn(Optional.of(workflow));

        workflowEngine.cancelWorkflow(publicId);

        assertEquals(WorkflowStatus.CANCELLED, workflow.getStatus());
        assertNotNull(workflow.getFinishedAt());
        verify(repository).save(workflow);
    }

    @Test
    void failWorkflow_ShouldUpdateStatusAndPublishEvent() {
        when(repository.findByPublicId(publicId)).thenReturn(Optional.of(workflow));

        workflowEngine.failWorkflow(publicId, "Error occurred");

        assertEquals(WorkflowStatus.FAILED, workflow.getStatus());
        assertEquals("Error occurred", workflow.getErrorMessage());
        verify(repository).save(workflow);
        verify(eventPublisher).publishWorkflowFailed(workflow, "Error occurred");
    }

    @Test
    void completeWorkflow_ShouldUpdateStatusAndPublishEvent() {
        when(repository.findByPublicId(publicId)).thenReturn(Optional.of(workflow));

        workflowEngine.completeWorkflow(publicId);

        assertEquals(WorkflowStatus.COMPLETED, workflow.getStatus());
        verify(repository).save(workflow);
        verify(eventPublisher).publishWorkflowCompleted(workflow);
    }
}
