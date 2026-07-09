package com.jobpilotai.backend.browserautomation.screenshot;

import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.domain.AutomationScreenshot;
import com.jobpilotai.backend.browserautomation.domain.ScreenshotType;
import com.jobpilotai.backend.browserautomation.repository.AutomationScreenshotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ScreenshotServiceTest {

    @Mock
    private AutomationScreenshotRepository repository;

    @InjectMocks
    private ScreenshotService screenshotService;

    private AutomationExecution execution;

    @BeforeEach
    void setUp() {
        execution = new AutomationExecution();
        execution.setPublicId(UUID.randomUUID());
    }

    @Test
    void captureBefore_ShouldSaveMetadata() {
        screenshotService.captureBefore(execution);
        
        ArgumentCaptor<AutomationScreenshot> captor = ArgumentCaptor.forClass(AutomationScreenshot.class);
        verify(repository).save(captor.capture());
        
        AutomationScreenshot saved = captor.getValue();
        assertEquals(execution, saved.getExecution());
        assertEquals(ScreenshotType.BEFORE, saved.getScreenshotType());
        assertTrue(saved.getFilePath().contains("before"));
    }

    @Test
    void captureFailure_ShouldSaveMetadata() {
        screenshotService.captureFailure(execution);
        
        ArgumentCaptor<AutomationScreenshot> captor = ArgumentCaptor.forClass(AutomationScreenshot.class);
        verify(repository).save(captor.capture());
        
        AutomationScreenshot saved = captor.getValue();
        assertEquals(execution, saved.getExecution());
        assertEquals(ScreenshotType.FAILURE, saved.getScreenshotType());
        assertTrue(saved.getFilePath().contains("failure"));
    }
}
