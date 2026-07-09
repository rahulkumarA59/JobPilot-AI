package com.jobpilotai.backend.orchestrator.scheduler;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.WorkflowStatus;
import com.jobpilotai.backend.orchestrator.pipeline.PipelineExecutor;
import com.jobpilotai.backend.orchestrator.repository.WorkflowRepository;
import com.jobpilotai.backend.orchestrator.service.WorkflowEngine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkflowScheduler {

    private final WorkflowRepository workflowRepository;
    private final PipelineExecutor pipelineExecutor;
    private final WorkflowEngine workflowEngine;

    @Scheduled(fixedDelay = 60000)
    public void processActiveWorkflows() {
        log.debug("Polling active workflows for execution...");
        
        List<OrchestratorWorkflow> activeWorkflows = workflowRepository.findByStatus(WorkflowStatus.RUNNING);
        
        for (OrchestratorWorkflow workflow : activeWorkflows) {
            try {
                pipelineExecutor.executeNextStep(workflow);
            } catch (Exception e) {
                log.error("Error executing pipeline for workflow: {}", workflow.getPublicId(), e);
            }
        }
    }

    @Scheduled(fixedDelay = 300000)
    public void retryFailedWorkflows() {
        log.debug("Checking for failed workflows to retry...");
        // In a real scenario, we might retry specific steps based on their retry_count limits
    }

    @Scheduled(fixedDelay = 3600000)
    public void cleanupCompletedWorkflows() {
        log.debug("Cleaning up old completed/cancelled workflows...");
        // Cleanup strategy for old data
    }
}
