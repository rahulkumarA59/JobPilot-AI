package com.jobpilotai.backend.browserautomation.upload;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.session.BrowserSessionManager;
import com.microsoft.playwright.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeUploadEngine {

    private final BrowserSessionManager sessionManager;

    public void uploadResume(AutomationExecution execution, Application application) {
        log.info("Uploading resume for execution: {}", execution.getPublicId());
        
        try {
            Page page = sessionManager.getPage(execution);
            
            // Assume the resume file path is correctly populated
            String filePath = application.getResume().getFilePath();
            if (filePath == null || filePath.isBlank()) {
                log.warn("No resume file path found for application {}", application.getPublicId());
                return;
            }
            
            Path path = Paths.get(filePath);
            
            // Wait for file input to be in the DOM
            // Common file inputs for resume:
            String[] fileSelectors = {
                "input[type='file'][name*='resume' i]",
                "input[type='file'][name*='cv' i]",
                "input[type='file']"
            };
            
            boolean uploaded = false;
            for (String selector : fileSelectors) {
                if (page.isVisible(selector) || page.querySelector(selector) != null) {
                    page.setInputFiles(selector, path);
                    log.info("Uploaded resume using selector {}", selector);
                    uploaded = true;
                    break;
                }
            }
            
            if (!uploaded) {
                log.warn("Could not find a suitable file input for resume upload");
            }
            
        } catch (Exception e) {
            log.error("Failed to upload resume: {}", e.getMessage());
        }
    }

    public void uploadCoverLetter(AutomationExecution execution, Application application) {
        log.info("Uploading cover letter for execution: {}", execution.getPublicId());
        // Similar logic, potentially looking for input[name*='cover_letter' i] or simply typing the text if it's a textarea
        
        try {
            Page page = sessionManager.getPage(execution);
            if (application.getCoverLetterReference() != null && !application.getCoverLetterReference().isBlank()) {
                // If it's a textarea
                if (page.isVisible("textarea[name*='cover' i]")) {
                    page.fill("textarea[name*='cover' i]", application.getCoverLetterReference());
                    log.info("Filled cover letter text area");
                }
            }
        } catch (Exception e) {
            log.error("Failed to upload cover letter: {}", e.getMessage());
        }
    }

    public void uploadAttachments(AutomationExecution execution, Application application) {
        log.info("Uploading other attachments for execution: {}", execution.getPublicId());
    }
}
