package com.jobpilotai.backend.application.service;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationStage;
import java.lang.IllegalArgumentException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ApplicationWorkflowServiceTest {

    @Mock
    private ApplicationTrackerService trackerService;

    @InjectMocks
    private ApplicationWorkflowService workflowService;

    @Test
    void transitionTo_whenValidTransition_updatesStageAndRecordsHistory() {
        Application application = new Application();
        application.setStage(ApplicationStage.QUEUED);

        workflowService.transitionTo(application, ApplicationStage.PREPARING, "Start prep", "SYSTEM");

        assertEquals(ApplicationStage.PREPARING, application.getStage());
        verify(trackerService).recordTransition(application, ApplicationStage.QUEUED, ApplicationStage.PREPARING, "Start prep", "SYSTEM");
    }

    @Test
    void transitionTo_whenInvalidTransition_throwsException() {
        Application application = new Application();
        application.setStage(ApplicationStage.QUEUED);

        assertThrows(IllegalArgumentException.class, () -> 
            workflowService.transitionTo(application, ApplicationStage.APPLIED, "Invalid skip", "SYSTEM")
        );
    }
    
    @Test
    void transitionTo_retryFromFailed_isAllowed() {
        Application application = new Application();
        application.setStage(ApplicationStage.FAILED);

        workflowService.transitionTo(application, ApplicationStage.QUEUED, "Retrying", "USER");

        assertEquals(ApplicationStage.QUEUED, application.getStage());
    }
}
