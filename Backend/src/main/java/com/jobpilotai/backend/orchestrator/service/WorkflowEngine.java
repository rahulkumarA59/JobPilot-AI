package com.jobpilotai.backend.orchestrator.service;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.WorkflowStatus;
import com.jobpilotai.backend.orchestrator.domain.WorkflowType;
import com.jobpilotai.backend.orchestrator.event.WorkflowEventPublisher;
import com.jobpilotai.backend.orchestrator.repository.WorkflowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkflowEngine {

    private final WorkflowRepository workflowRepository;
    private final WorkflowEventPublisher eventPublisher;

    @Transactional
    public OrchestratorWorkflow createWorkflow(Long candidateProfileId, WorkflowType type) {
        if (candidateProfileId != null) {
            boolean hasActive = workflowRepository.existsByCandidateProfileIdAndStatusIn(
                    candidateProfileId, List.of(WorkflowStatus.CREATED, WorkflowStatus.READY, WorkflowStatus.RUNNING, WorkflowStatus.WAITING)
            );
            if (hasActive) {
                throw new IllegalStateException("Candidate already has an active workflow");
            }
        }

        OrchestratorWorkflow workflow = new OrchestratorWorkflow();
        workflow.setCandidateProfileId(candidateProfileId);
        workflow.setWorkflowType(type);
        workflow.setStatus(WorkflowStatus.CREATED);
        workflowRepository.save(workflow);

        eventPublisher.publishWorkflowStarted(workflow);
        log.info("Created workflow: {}", workflow.getPublicId());
        return workflow;
    }

    @Transactional
    public void startWorkflow(UUID publicId) {
        OrchestratorWorkflow workflow = workflowRepository.findByPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow not found"));

        if (!workflow.getStatus().isTerminal() && workflow.getStatus() != WorkflowStatus.RUNNING) {
            workflow.setStatus(WorkflowStatus.RUNNING);
            workflow.setStartedAt(Instant.now());
            workflowRepository.save(workflow);
            log.info("Started workflow: {}", publicId);
        }
    }

    @Transactional
    public void pauseWorkflow(UUID publicId) {
        OrchestratorWorkflow workflow = workflowRepository.findByPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow not found"));

        if (workflow.getStatus() == WorkflowStatus.RUNNING || workflow.getStatus() == WorkflowStatus.WAITING) {
            workflow.setStatus(WorkflowStatus.PAUSED);
            workflowRepository.save(workflow);
            eventPublisher.publish(workflow, com.jobpilotai.backend.orchestrator.domain.WorkflowEventType.WORKFLOW_PAUSED, null, null);
            log.info("Paused workflow: {}", publicId);
        }
    }

    @Transactional
    public void resumeWorkflow(UUID publicId) {
        OrchestratorWorkflow workflow = workflowRepository.findByPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow not found"));

        if (workflow.getStatus() == WorkflowStatus.PAUSED) {
            workflow.setStatus(WorkflowStatus.RUNNING);
            workflowRepository.save(workflow);
            eventPublisher.publish(workflow, com.jobpilotai.backend.orchestrator.domain.WorkflowEventType.WORKFLOW_RESUMED, null, null);
            log.info("Resumed workflow: {}", publicId);
        }
    }

    @Transactional
    public void cancelWorkflow(UUID publicId) {
        OrchestratorWorkflow workflow = workflowRepository.findByPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow not found"));

        if (!workflow.getStatus().isTerminal()) {
            workflow.setStatus(WorkflowStatus.CANCELLED);
            workflow.setFinishedAt(Instant.now());
            if (workflow.getStartedAt() != null) {
                workflow.setDuration(java.time.Duration.between(workflow.getStartedAt(), workflow.getFinishedAt()).toMillis());
            }
            workflowRepository.save(workflow);
            eventPublisher.publish(workflow, com.jobpilotai.backend.orchestrator.domain.WorkflowEventType.WORKFLOW_CANCELLED, null, null);
            log.info("Cancelled workflow: {}", publicId);
        }
    }

    @Transactional
    public void failWorkflow(UUID publicId, String reason) {
        OrchestratorWorkflow workflow = workflowRepository.findByPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow not found"));

        if (!workflow.getStatus().isTerminal()) {
            workflow.setStatus(WorkflowStatus.FAILED);
            workflow.setErrorMessage(reason);
            workflow.setFinishedAt(Instant.now());
            if (workflow.getStartedAt() != null) {
                workflow.setDuration(java.time.Duration.between(workflow.getStartedAt(), workflow.getFinishedAt()).toMillis());
            }
            workflowRepository.save(workflow);
            eventPublisher.publishWorkflowFailed(workflow, reason);
            log.error("Failed workflow: {} - {}", publicId, reason);
        }
    }

    @Transactional
    public void completeWorkflow(UUID publicId) {
        OrchestratorWorkflow workflow = workflowRepository.findByPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow not found"));

        if (!workflow.getStatus().isTerminal()) {
            workflow.setStatus(WorkflowStatus.COMPLETED);
            workflow.setFinishedAt(Instant.now());
            if (workflow.getStartedAt() != null) {
                workflow.setDuration(java.time.Duration.between(workflow.getStartedAt(), workflow.getFinishedAt()).toMillis());
            }
            workflowRepository.save(workflow);
            eventPublisher.publishWorkflowCompleted(workflow);
            log.info("Completed workflow: {}", publicId);
        }
    }
}
