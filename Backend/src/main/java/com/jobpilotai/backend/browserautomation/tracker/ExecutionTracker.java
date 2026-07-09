package com.jobpilotai.backend.browserautomation.tracker;

import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.domain.AutomationStatus;
import com.jobpilotai.backend.browserautomation.repository.AutomationExecutionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExecutionTracker {

    private final AutomationExecutionRepository repository;

    @Transactional
    public void startTracking(AutomationExecution execution) {
        execution.setStatus(AutomationStatus.STARTING);
        execution.setStartedAt(Instant.now());
        repository.save(execution);
        log.info("Execution started: {}", execution.getPublicId());
    }

    @Transactional
    public void updateStep(AutomationExecution execution, String stepName) {
        execution.setCurrentStep(stepName);
        repository.save(execution);
        log.debug("Execution {} at step: {}", execution.getPublicId(), stepName);
    }
    
    @Transactional
    public void updateStatus(AutomationExecution execution, AutomationStatus newStatus) {
        execution.setStatus(newStatus);
        repository.save(execution);
        log.info("Execution {} changed status to: {}", execution.getPublicId(), newStatus);
    }

    @Transactional
    public void complete(AutomationExecution execution) {
        execution.setStatus(AutomationStatus.COMPLETED);
        execution.setFinishedAt(Instant.now());
        
        if (execution.getStartedAt() != null) {
            execution.setDuration(Duration.between(execution.getStartedAt(), execution.getFinishedAt()).toMillis());
        }
        
        repository.save(execution);
        log.info("Execution completed: {} in {}ms", execution.getPublicId(), execution.getDuration());
    }

    @Transactional
    public void fail(AutomationExecution execution, String errorMessage) {
        execution.setStatus(AutomationStatus.FAILED);
        execution.setFinishedAt(Instant.now());
        execution.setErrorMessage(errorMessage);
        
        if (execution.getStartedAt() != null) {
            execution.setDuration(Duration.between(execution.getStartedAt(), execution.getFinishedAt()).toMillis());
        }
        
        repository.save(execution);
        log.error("Execution failed: {}. Error: {}", execution.getPublicId(), errorMessage);
    }
}
