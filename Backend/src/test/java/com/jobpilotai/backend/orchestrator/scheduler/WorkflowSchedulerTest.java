package com.jobpilotai.backend.orchestrator.scheduler;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.WorkflowStatus;
import com.jobpilotai.backend.orchestrator.pipeline.PipelineExecutor;
import com.jobpilotai.backend.orchestrator.repository.WorkflowRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkflowSchedulerTest {

    @Mock
    private WorkflowRepository repository;

    @Mock
    private PipelineExecutor pipelineExecutor;

    @InjectMocks
    private WorkflowScheduler scheduler;

    private OrchestratorWorkflow workflow;

    @BeforeEach
    void setUp() {
        workflow = new OrchestratorWorkflow();
        workflow.setPublicId(UUID.randomUUID());
    }

    @Test
    void processActiveWorkflows_ShouldExecutePipeline() {
        when(repository.findByStatus(WorkflowStatus.RUNNING)).thenReturn(List.of(workflow));
        
        scheduler.processActiveWorkflows();
        
        verify(pipelineExecutor).executeNextStep(workflow);
    }
    
    @Test
    void processActiveWorkflows_ShouldHandleExceptionGracefully() {
        when(repository.findByStatus(WorkflowStatus.RUNNING)).thenReturn(List.of(workflow));
        doThrow(new RuntimeException("Error")).when(pipelineExecutor).executeNextStep(workflow);
        
        scheduler.processActiveWorkflows(); // Should not throw exception out of scheduled task
        
        verify(pipelineExecutor).executeNextStep(workflow);
    }

    @Test
    void retryFailedWorkflows_ShouldRunWithoutError() {
        scheduler.retryFailedWorkflows();
        // Just verify it runs
    }

    @Test
    void cleanupCompletedWorkflows_ShouldRunWithoutError() {
        scheduler.cleanupCompletedWorkflows();
        // Just verify it runs
    }
}
