package com.jobpilotai.backend.orchestrator.pipeline;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorStep;
import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.StepStatus;
import com.jobpilotai.backend.orchestrator.domain.WorkflowStatus;
import com.jobpilotai.backend.orchestrator.event.WorkflowEventPublisher;
import com.jobpilotai.backend.orchestrator.repository.StepRepository;
import com.jobpilotai.backend.orchestrator.service.WorkflowEngine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PipelineExecutor {

    private final StepRepository stepRepository;
    private final WorkflowEngine workflowEngine;
    private final WorkflowEventPublisher eventPublisher;

    @Transactional
    public void executeNextStep(OrchestratorWorkflow workflow) {
        if (!workflow.getStatus().isActive()) {
            log.debug("Workflow {} is not active. Status: {}", workflow.getPublicId(), workflow.getStatus());
            return;
        }

        List<OrchestratorStep> steps = stepRepository.findByWorkflowIdOrderByStepOrderAsc(workflow.getId());
        
        for (OrchestratorStep step : steps) {
            if (step.getStatus() == StepStatus.PENDING) {
                if (isDependencyMet(step, steps)) {
                    startStep(workflow, step);
                    return; // Execute one step at a time for deterministic execution
                } else {
                    log.warn("Dependencies not met for step: {} in workflow: {}", step.getStepName(), workflow.getPublicId());
                    workflowEngine.failWorkflow(workflow.getPublicId(), "Dependency failure for step: " + step.getStepName());
                    return;
                }
            } else if (step.getStatus() == StepStatus.RUNNING) {
                log.debug("Workflow {} is already running step: {}", workflow.getPublicId(), step.getStepName());
                return; // Wait for running step to complete
            } else if (step.getStatus() == StepStatus.FAILED) {
                log.warn("Workflow {} has failed step: {}", workflow.getPublicId(), step.getStepName());
                // Let the retry mechanism handle it or fail the workflow
                return;
            }
        }
        
        // If all steps are completed or skipped
        boolean allFinished = steps.stream().allMatch(s -> s.getStatus().isTerminal() && s.getStatus() != StepStatus.FAILED);
        if (allFinished) {
            workflowEngine.completeWorkflow(workflow.getPublicId());
        }
    }

    private boolean isDependencyMet(OrchestratorStep step, List<OrchestratorStep> allSteps) {
        if (step.getDependsOn() == null || step.getDependsOn().isBlank()) {
            return true;
        }
        
        String[] dependencies = step.getDependsOn().split(",");
        for (String dep : dependencies) {
            boolean depCompleted = allSteps.stream()
                    .anyMatch(s -> s.getStepName().equals(dep.trim()) && s.getStatus() == StepStatus.COMPLETED);
            if (!depCompleted) {
                return false;
            }
        }
        return true;
    }

    private void startStep(OrchestratorWorkflow workflow, OrchestratorStep step) {
        step.setStatus(StepStatus.RUNNING);
        step.setStartedAt(Instant.now());
        stepRepository.save(step);

        workflow.setCurrentStep(step.getStepName());
        
        eventPublisher.publishStepStarted(workflow, step.getStepName());
        log.info("Started step: {} for workflow: {}", step.getStepName(), workflow.getPublicId());
    }

    @Transactional
    public void completeStep(OrchestratorWorkflow workflow, String stepName, String outputReference) {
        OrchestratorStep step = stepRepository.findByWorkflowIdAndStepName(workflow.getId(), stepName)
                .orElseThrow(() -> new IllegalArgumentException("Step not found"));

        step.setStatus(StepStatus.COMPLETED);
        step.setFinishedAt(Instant.now());
        step.setOutputReference(outputReference);
        if (step.getStartedAt() != null) {
            step.setDuration(java.time.Duration.between(step.getStartedAt(), step.getFinishedAt()).toMillis());
        }
        stepRepository.save(step);

        workflow.setCompletedSteps(workflow.getCompletedSteps() + 1);
        
        eventPublisher.publishStepCompleted(workflow, stepName);
        log.info("Completed step: {} for workflow: {}", stepName, workflow.getPublicId());
        
        // Trigger next step
        executeNextStep(workflow);
    }

    @Transactional
    public void failStep(OrchestratorWorkflow workflow, String stepName, String reason) {
        OrchestratorStep step = stepRepository.findByWorkflowIdAndStepName(workflow.getId(), stepName)
                .orElseThrow(() -> new IllegalArgumentException("Step not found"));

        step.setStatus(StepStatus.FAILED);
        step.setErrorMessage(reason);
        step.setFinishedAt(Instant.now());
        if (step.getStartedAt() != null) {
            step.setDuration(java.time.Duration.between(step.getStartedAt(), step.getFinishedAt()).toMillis());
        }
        stepRepository.save(step);

        eventPublisher.publishStepFailed(workflow, stepName, reason);
        log.error("Failed step: {} for workflow: {}. Reason: {}", stepName, workflow.getPublicId(), reason);
        
        // The retry scheduler will pick this up
    }
}
