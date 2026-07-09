package com.jobpilotai.backend.browserautomation.screenshot;

import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.domain.AutomationScreenshot;
import com.jobpilotai.backend.browserautomation.domain.ScreenshotType;
import com.jobpilotai.backend.browserautomation.repository.AutomationScreenshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScreenshotService {

    private final AutomationScreenshotRepository repository;

    @Transactional
    public void captureBefore(AutomationExecution execution) {
        saveScreenshotMetadata(execution, ScreenshotType.BEFORE, generateFilePath(execution, "before"));
    }

    @Transactional
    public void captureAfter(AutomationExecution execution) {
        saveScreenshotMetadata(execution, ScreenshotType.AFTER, generateFilePath(execution, "after"));
    }

    @Transactional
    public void captureFailure(AutomationExecution execution) {
        saveScreenshotMetadata(execution, ScreenshotType.FAILURE, generateFilePath(execution, "failure"));
    }

    @Transactional
    public void captureSuccess(AutomationExecution execution) {
        saveScreenshotMetadata(execution, ScreenshotType.SUCCESS, generateFilePath(execution, "success"));
    }

    private void saveScreenshotMetadata(AutomationExecution execution, ScreenshotType type, String filePath) {
        AutomationScreenshot screenshot = new AutomationScreenshot();
        screenshot.setExecution(execution);
        screenshot.setScreenshotType(type);
        screenshot.setFilePath(filePath);
        repository.save(screenshot);
        
        log.info("Saved screenshot metadata for execution: {}. Type: {}, Path: {}", 
                execution.getPublicId(), type, filePath);
    }
    
    private String generateFilePath(AutomationExecution execution, String type) {
        return "/storage/screenshots/" + execution.getPublicId() + "_" + type + "_" + System.currentTimeMillis() + ".png";
    }
}
