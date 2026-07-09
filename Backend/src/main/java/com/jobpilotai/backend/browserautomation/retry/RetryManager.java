package com.jobpilotai.backend.browserautomation.retry;

import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.domain.AutomationStatus;
import com.jobpilotai.backend.browserautomation.repository.AutomationExecutionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RetryManager {

    private static final int MAX_RETRIES = 3;
    private final AutomationExecutionRepository repository;

    @Transactional
    public boolean shouldRetry(AutomationExecution execution) {
        if (execution.getRetryCount() < MAX_RETRIES) {
            log.info("Execution {} failed, preparing for retry {}/{}", 
                    execution.getPublicId(), execution.getRetryCount() + 1, MAX_RETRIES);
            
            execution.setRetryCount(execution.getRetryCount() + 1);
            execution.setStatus(AutomationStatus.RETRYING);
            repository.save(execution);
            return true;
        }
        
        log.error("Execution {} exceeded max retries ({})", execution.getPublicId(), MAX_RETRIES);
        return false;
    }

    public void retryFailedSteps(AutomationExecution execution) {
        log.info("Retrying failed step: {} for execution: {}", execution.getCurrentStep(), execution.getPublicId());
    }

    public void retryUploads(AutomationExecution execution) {
        log.info("Retrying uploads for execution: {}", execution.getPublicId());
    }
}
