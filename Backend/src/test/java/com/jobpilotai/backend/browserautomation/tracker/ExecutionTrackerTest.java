package com.jobpilotai.backend.browserautomation.tracker;

import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.domain.AutomationStatus;
import com.jobpilotai.backend.browserautomation.repository.AutomationExecutionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ExecutionTrackerTest {

    @Mock
    private AutomationExecutionRepository repository;

    @InjectMocks
    private ExecutionTracker tracker;

    private AutomationExecution execution;

    @BeforeEach
    void setUp() {
        execution = new AutomationExecution();
        execution.setPublicId(UUID.randomUUID());
    }

    @Test
    void startTracking_ShouldSetStartingStatus() {
        tracker.startTracking(execution);

        assertEquals(AutomationStatus.STARTING, execution.getStatus());
        assertNotNull(execution.getStartedAt());
        verify(repository).save(execution);
    }

    @Test
    void updateStep_ShouldSetCurrentStep() {
        tracker.updateStep(execution, "FILL_FORM");

        assertEquals("FILL_FORM", execution.getCurrentStep());
        verify(repository).save(execution);
    }

    @Test
    void updateStatus_ShouldChangeStatus() {
        tracker.updateStatus(execution, AutomationStatus.RUNNING);

        assertEquals(AutomationStatus.RUNNING, execution.getStatus());
        verify(repository).save(execution);
    }

    @Test
    void complete_ShouldSetCompletedStatusAndDuration() {
        execution.setStartedAt(Instant.now().minusSeconds(10));
        
        tracker.complete(execution);

        assertEquals(AutomationStatus.COMPLETED, execution.getStatus());
        assertNotNull(execution.getFinishedAt());
        assertTrue(execution.getDuration() >= 10000);
        verify(repository).save(execution);
    }

    @Test
    void fail_ShouldSetFailedStatusAndErrorMessage() {
        execution.setStartedAt(Instant.now().minusSeconds(5));
        String errorMsg = "Element not found";
        
        tracker.fail(execution, errorMsg);

        assertEquals(AutomationStatus.FAILED, execution.getStatus());
        assertEquals(errorMsg, execution.getErrorMessage());
        assertNotNull(execution.getFinishedAt());
        assertTrue(execution.getDuration() >= 5000);
        verify(repository).save(execution);
    }
}
