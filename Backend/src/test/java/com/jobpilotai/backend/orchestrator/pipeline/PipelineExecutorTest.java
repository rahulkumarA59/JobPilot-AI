package com.jobpilotai.backend.orchestrator.pipeline;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorStep;
import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.StepStatus;
import com.jobpilotai.backend.orchestrator.domain.WorkflowStatus;
import com.jobpilotai.backend.orchestrator.event.WorkflowEventPublisher;
import com.jobpilotai.backend.orchestrator.repository.StepRepository;
import com.jobpilotai.backend.orchestrator.service.WorkflowEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PipelineExecutorTest {

    @Mock
    private StepRepository stepRepository;

    @Mock
    private WorkflowEngine workflowEngine;

    @Mock
    private WorkflowEventPublisher eventPublisher;

    @InjectMocks
    private PipelineExecutor pipelineExecutor;

    private OrchestratorWorkflow workflow;
    private OrchestratorStep step1;
    private OrchestratorStep step2;

    @BeforeEach
    void setUp() {
        workflow = new OrchestratorWorkflow();
        workflow.setId(1L);
        workflow.setPublicId(UUID.randomUUID());
        workflow.setStatus(WorkflowStatus.RUNNING);

        step1 = new OrchestratorStep();
        step1.setWorkflow(workflow);
        step1.setStepName("STEP_1");
        step1.setStepOrder(1);
        step1.setStatus(StepStatus.PENDING);

        step2 = new OrchestratorStep();
        step2.setWorkflow(workflow);
        step2.setStepName("STEP_2");
        step2.setStepOrder(2);
        step2.setStatus(StepStatus.PENDING);
        step2.setDependsOn("STEP_1");
    }

    @Test
    void executeNextStep_ShouldStartFirstPendingStep() {
        when(stepRepository.findByWorkflowIdOrderByStepOrderAsc(1L)).thenReturn(List.of(step1, step2));

        pipelineExecutor.executeNextStep(workflow);

        assertEquals(StepStatus.RUNNING, step1.getStatus());
        verify(stepRepository).save(step1);
        verify(eventPublisher).publishStepStarted(workflow, "STEP_1");
        verify(workflowEngine, never()).completeWorkflow(any());
    }

    @Test
    void executeNextStep_ShouldWaitIfRunning() {
        step1.setStatus(StepStatus.RUNNING);
        when(stepRepository.findByWorkflowIdOrderByStepOrderAsc(1L)).thenReturn(List.of(step1, step2));

        pipelineExecutor.executeNextStep(workflow);

        verify(stepRepository, never()).save(any());
        verify(eventPublisher, never()).publishStepStarted(any(), any());
    }

    @Test
    void executeNextStep_ShouldFailIfDependenciesNotMet() {
        step1.setStatus(StepStatus.SKIPPED);
        step2.setStatus(StepStatus.PENDING);
        when(stepRepository.findByWorkflowIdOrderByStepOrderAsc(1L)).thenReturn(List.of(step1, step2));

        pipelineExecutor.executeNextStep(workflow);

        verify(stepRepository, never()).save(any());
        verify(workflowEngine).failWorkflow(eq(workflow.getPublicId()), anyString());
    }

    @Test
    void completeStep_ShouldUpdateStatusAndTriggerNext() {
        when(stepRepository.findByWorkflowIdAndStepName(1L, "STEP_1")).thenReturn(Optional.of(step1));
        when(stepRepository.findByWorkflowIdOrderByStepOrderAsc(1L)).thenReturn(List.of(step1, step2));

        pipelineExecutor.completeStep(workflow, "STEP_1", "output-ref");

        assertEquals(StepStatus.COMPLETED, step1.getStatus());
        assertEquals("output-ref", step1.getOutputReference());
        verify(stepRepository).save(step1);
        verify(eventPublisher).publishStepCompleted(workflow, "STEP_1");
        
        // Next step should trigger
        assertEquals(StepStatus.RUNNING, step2.getStatus());
        verify(stepRepository).save(step2);
    }
    
    @Test
    void executeNextStep_ShouldCompleteWorkflow_WhenAllStepsDone() {
        step1.setStatus(StepStatus.COMPLETED);
        step2.setStatus(StepStatus.COMPLETED);
        when(stepRepository.findByWorkflowIdOrderByStepOrderAsc(1L)).thenReturn(List.of(step1, step2));

        pipelineExecutor.executeNextStep(workflow);

        verify(workflowEngine).completeWorkflow(workflow.getPublicId());
    }
}
