package com.jobpilotai.backend.browserautomation.engine;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.adapter.BrowserAutomationAdapter;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.enums.JobSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AutomationEngineTest {

    @Mock
    private BrowserAutomationAdapter greenhouseAdapter;

    @Mock
    private BrowserAutomationAdapter leverAdapter;

    private AutomationEngine automationEngine;

    private AutomationExecution execution;
    private Application application;

    @BeforeEach
    void setUp() {
        lenient().when(greenhouseAdapter.supports(JobSource.GREENHOUSE)).thenReturn(true);
        lenient().when(greenhouseAdapter.supports(JobSource.LEVER)).thenReturn(false);
        
        lenient().when(leverAdapter.supports(JobSource.LEVER)).thenReturn(true);
        lenient().when(leverAdapter.supports(JobSource.GREENHOUSE)).thenReturn(false);

        automationEngine = new AutomationEngine(List.of(greenhouseAdapter, leverAdapter));

        execution = new AutomationExecution();
        execution.setPublicId(UUID.randomUUID());

        Job job = new Job();
        job.setSource(JobSource.GREENHOUSE);
        
        application = new Application();
        application.setJob(job);
    }

    @Test
    void execute_ShouldDelegateToCorrectAdapter() {
        automationEngine.execute(execution, application);

        verify(greenhouseAdapter).login(execution);
        verify(greenhouseAdapter).navigate(execution, application);
        verify(greenhouseAdapter).locateElements(execution);
        verify(greenhouseAdapter).fillForm(execution, application);
        verify(greenhouseAdapter).uploadDocuments(execution, application);
        verify(greenhouseAdapter).submit(execution);
        verify(greenhouseAdapter).verifySubmission(execution);

        verifyNoInteractions(leverAdapter);
    }

    @Test
    void execute_ShouldNotFailIfNoAdapterFound() {
        application.getJob().setSource(JobSource.WORKDAY);
        when(greenhouseAdapter.supports(JobSource.WORKDAY)).thenReturn(false);
        when(leverAdapter.supports(JobSource.WORKDAY)).thenReturn(false);

        automationEngine.execute(execution, application);

        verify(greenhouseAdapter, never()).login(any());
        verify(leverAdapter, never()).login(any());
    }

    @Test
    void execute_ShouldThrowRuntimeException_WhenAdapterFails() {
        doThrow(new RuntimeException("Login failed")).when(greenhouseAdapter).login(execution);

        assertThrows(RuntimeException.class, () -> automationEngine.execute(execution, application));
    }

    @Test
    void pauseResumeCancel_ShouldLogWithoutErrors() {
        automationEngine.pause(execution);
        automationEngine.resume(execution);
        automationEngine.cancel(execution);
        // Methods only log for V1, just verify they execute without exceptions
    }
}
