package com.jobpilotai.backend.orchestrator.mapper;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorLog;
import com.jobpilotai.backend.orchestrator.domain.OrchestratorStep;
import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.dto.WorkflowLogResponse;
import com.jobpilotai.backend.orchestrator.dto.WorkflowResponse;
import com.jobpilotai.backend.orchestrator.dto.WorkflowStepResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WorkflowMapper {

    public WorkflowResponse toResponse(OrchestratorWorkflow workflow) {
        List<WorkflowStepResponse> stepResponses = workflow.getSteps().stream()
                .map(this::toStepResponse)
                .toList();

        return new WorkflowResponse(
                workflow.getPublicId(),
                workflow.getWorkflowType().name(),
                workflow.getStatus().name(),
                workflow.getCurrentStep(),
                workflow.getTotalSteps(),
                workflow.getCompletedSteps(),
                workflow.getStartedAt(),
                workflow.getFinishedAt(),
                workflow.getDuration(),
                workflow.getRetryCount(),
                workflow.getErrorMessage(),
                stepResponses
        );
    }

    public WorkflowStepResponse toStepResponse(OrchestratorStep step) {
        return new WorkflowStepResponse(
                step.getStepName(),
                step.getStepOrder(),
                step.getStatus().name(),
                step.getDependsOn(),
                step.getStartedAt(),
                step.getFinishedAt(),
                step.getDuration(),
                step.getRetryCount(),
                step.getErrorMessage(),
                step.getOutputReference()
        );
    }

    public WorkflowLogResponse toLogResponse(OrchestratorLog log) {
        return new WorkflowLogResponse(
                log.getStepName(),
                log.getLogLevel(),
                log.getMessage(),
                log.getExecutionTime(),
                log.getFailureReason(),
                log.getRetryCount(),
                log.getCreatedAt()
        );
    }
}
