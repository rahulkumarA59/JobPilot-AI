package com.jobpilotai.backend.browserautomation.scheduler;

import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.domain.AutomationStatus;
import com.jobpilotai.backend.browserautomation.repository.AutomationExecutionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationScheduler {

    private final AutomationExecutionRepository repository;

    @Scheduled(fixedDelay = 60000)
    public void queueAutomationJobs() {
        log.debug("Checking for pending applications to queue for automation...");
        // Logic to fetch applications in READY_TO_APPLY state and create executions
    }

    @Scheduled(fixedDelay = 300000)
    public void processRetries() {
        log.debug("Processing automation executions in RETRYING state...");
        List<AutomationExecution> retryingExecutions = repository.findByStatus(AutomationStatus.RETRYING);
        
        for (AutomationExecution execution : retryingExecutions) {
            log.info("Scheduling retry for execution: {}", execution.getPublicId());
            // Logic to re-trigger engine
        }
    }

    @Scheduled(fixedDelay = 3600000)
    public void cleanupFinishedSessions() {
        log.debug("Cleaning up finished automation sessions...");
        // Logic to clear temp files or memory for COMPLETED/FAILED executions
    }
}
