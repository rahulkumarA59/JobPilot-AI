package com.jobpilotai.backend.browserautomation.adapter;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.config.AutomationProperties;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.forms.FormFillingEngine;
import com.jobpilotai.backend.browserautomation.session.BrowserSessionManager;
import com.jobpilotai.backend.browserautomation.upload.ResumeUploadEngine;
import com.jobpilotai.backend.job.enums.JobSource;
import com.microsoft.playwright.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;

@Slf4j
@Component
@RequiredArgsConstructor
public class GreenhouseAdapter implements BrowserAutomationAdapter {

    private final BrowserSessionManager sessionManager;
    private final FormFillingEngine formEngine;
    private final ResumeUploadEngine uploadEngine;
    private final AutomationProperties properties;

    @Override
    public boolean supports(JobSource source) {
        return source == JobSource.GREENHOUSE;
    }

    @Override
    public void login(AutomationExecution execution) {
        // Greenhouse is typically guest application, no login required.
    }

    @Override
    public void navigate(AutomationExecution execution, Application application) {
        String url = application.getJob().getApplyUrl();
        log.info("[Greenhouse] Navigating to: {}", url);
        Page page = sessionManager.getOrCreatePage(execution);
        page.navigate(url);
        
        // Wait for network idle to ensure the form is loaded
        page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
        
        // Take a screenshot to record the start
        if (properties.isScreenshotOnError()) { // Just hijacking this prop to mean take screenshots
            page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("automation-logs", execution.getPublicId() + "-navigate.png")));
        }
    }

    @Override
    public void locateElements(AutomationExecution execution) {
        log.info("[Greenhouse] Locating form fields");
        // Greenhouse uses specific IDs: first_name, last_name, email, phone
        // We will just let FormFillingEngine handle standard inputs via its fallbacks
    }

    @Override
    public void fillForm(AutomationExecution execution, Application application) {
        log.info("[Greenhouse] Filling form for candidate: {}", application.getCandidateProfile().getPublicId());
        formEngine.fillName(execution, application);
        formEngine.fillEmail(execution, application);
        formEngine.fillPhone(execution, application);
        formEngine.fillLinkedIn(execution, application);
        formEngine.fillGitHub(execution, application);
    }

    @Override
    public void uploadDocuments(AutomationExecution execution, Application application) {
        log.info("[Greenhouse] Uploading documents");
        // Greenhouse has a specific button to attach file, then an input type=file appears
        try {
            Page page = sessionManager.getPage(execution);
            // Click "Attach" for resume if visible to reveal input
            if (page.isVisible("button[data-source='attach']")) {
                page.click("button[data-source='attach']");
            }
            uploadEngine.uploadResume(execution, application);
            uploadEngine.uploadCoverLetter(execution, application);
        } catch (Exception e) {
            log.error("[Greenhouse] Failed to upload documents: {}", e.getMessage());
        }
    }

    @Override
    public void submit(AutomationExecution execution) {
        log.info("[Greenhouse] Submitting form (dry-run: {})", properties.isDryRun());
        Page page = sessionManager.getPage(execution);
        
        try {
            if (!properties.isDryRun()) {
                page.click("#submit_app");
                page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
            } else {
                log.info("[Greenhouse] Dry run enabled. Skipping actual submit click.");
            }
        } catch (Exception e) {
            log.error("[Greenhouse] Failed to submit form: {}", e.getMessage());
        }
    }

    @Override
    public boolean verifySubmission(AutomationExecution execution) {
        log.info("[Greenhouse] Verifying submission");
        if (properties.isDryRun()) {
            return true;
        }
        
        try {
            Page page = sessionManager.getPage(execution);
            // Check for success text on page
            String content = page.textContent("body").toLowerCase();
            return content.contains("thank you for applying") || content.contains("application submitted");
        } catch (Exception e) {
            log.error("[Greenhouse] Failed to verify submission: {}", e.getMessage());
            return false;
        } finally {
            // End of execution, clean up
            sessionManager.cleanupSession(execution);
        }
    }
}
