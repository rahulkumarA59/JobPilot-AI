package com.jobpilotai.backend.orchestrator.executor;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.WorkflowStepName;
import com.jobpilotai.backend.orchestrator.pipeline.PipelineExecutor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class WorkflowExecutorTest {

    @Mock
    private PipelineExecutor pipelineExecutor;

    @InjectMocks
    private WorkflowExecutor workflowExecutor;

    private OrchestratorWorkflow workflow;

    @BeforeEach
    void setUp() {
        workflow = new OrchestratorWorkflow();
        workflow.setPublicId(UUID.randomUUID());
    }

    @Test
    void executeStep_ShouldCallPipelineComplete_WhenSuccessful() {
        workflowExecutor.executeStep(workflow, WorkflowStepName.RESUME_UPLOAD.name());
        
        verify(pipelineExecutor).completeStep(eq(workflow), eq(WorkflowStepName.RESUME_UPLOAD.name()), anyString());
    }

    @Test
    void executeStep_ShouldCallPipelineFail_WhenUnknownStep() {
        workflowExecutor.executeStep(workflow, "UNKNOWN_STEP");
        
        verify(pipelineExecutor).failStep(eq(workflow), eq("UNKNOWN_STEP"), anyString());
    }
}
