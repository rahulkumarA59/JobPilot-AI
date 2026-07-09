package com.jobpilotai.backend.browserautomation.retry;

import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.domain.AutomationStatus;
import com.jobpilotai.backend.browserautomation.repository.AutomationExecutionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RetryManagerTest {

    @Mock
    private AutomationExecutionRepository repository;

    @InjectMocks
    private RetryManager retryManager;

    private AutomationExecution execution;

    @BeforeEach
    void setUp() {
        execution = new AutomationExecution();
        execution.setPublicId(UUID.randomUUID());
    }

    @Test
    void shouldRetry_ReturnsTrue_WhenBelowMaxRetries() {
        execution.setRetryCount(1);
        
        boolean result = retryManager.shouldRetry(execution);
        
        assertTrue(result);
        assertTrue(execution.getRetryCount() == 2);
        assertTrue(execution.getStatus() == AutomationStatus.RETRYING);
        verify(repository).save(execution);
    }

    @Test
    void shouldRetry_ReturnsFalse_WhenAtMaxRetries() {
        execution.setRetryCount(3);
        
        boolean result = retryManager.shouldRetry(execution);
        
        assertFalse(result);
        assertTrue(execution.getRetryCount() == 3);
    }
}
