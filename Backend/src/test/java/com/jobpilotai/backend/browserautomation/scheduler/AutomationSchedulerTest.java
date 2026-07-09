package com.jobpilotai.backend.browserautomation.scheduler;

import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.domain.AutomationStatus;
import com.jobpilotai.backend.browserautomation.repository.AutomationExecutionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutomationSchedulerTest {

    @Mock
    private AutomationExecutionRepository repository;

    @InjectMocks
    private AutomationScheduler scheduler;

    @Test
    void processRetries_ShouldFetchRetryingExecutions() {
        AutomationExecution execution = new AutomationExecution();
        when(repository.findByStatus(AutomationStatus.RETRYING)).thenReturn(List.of(execution));
        
        scheduler.processRetries();
        
        verify(repository).findByStatus(AutomationStatus.RETRYING);
    }
    
    @Test
    void queueAutomationJobs_ShouldRunWithoutError() {
        scheduler.queueAutomationJobs();
        // Just verify it doesn't throw exceptions for the mock implementation
    }
    
    @Test
    void cleanupFinishedSessions_ShouldRunWithoutError() {
        scheduler.cleanupFinishedSessions();
        // Just verify it doesn't throw exceptions for the mock implementation
    }
}
