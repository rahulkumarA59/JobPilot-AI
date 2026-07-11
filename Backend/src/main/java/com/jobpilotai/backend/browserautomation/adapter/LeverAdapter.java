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
public class LeverAdapter implements BrowserAutomationAdapter {

    private final BrowserSessionManager sessionManager;
    private final FormFillingEngine formEngine;
    private final ResumeUploadEngine uploadEngine;
    private final AutomationProperties properties;

    @Override
    public boolean supports(JobSource source) {
        return source == JobSource.LEVER;
    }

    @Override
    public void login(AutomationExecution execution) {
        // Lever does not require login
    }

    @Override
    public void navigate(AutomationExecution execution, Application application) {
        String url = application.getJob().getApplyUrl();
        log.info("[Lever] Navigating to: {}", url);
        Page page = sessionManager.getOrCreatePage(execution);
        page.navigate(url);
        
        page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
    }

    @Override
    public void locateElements(AutomationExecution execution) {
        log.info("[Lever] Locating form fields");
    }

    @Override
    public void fillForm(AutomationExecution execution, Application application) {
        log.info("[Lever] Filling form for candidate: {}", application.getCandidateProfile().getPublicId());
        
        // Lever uses 'name' attributes on inputs that map well to our fallback selectors
        formEngine.fillName(execution, application);
        formEngine.fillEmail(execution, application);
        formEngine.fillPhone(execution, application);
        
        // Custom questions - Lever has various custom text areas for org questions
        // In a full implementation, we'd iterate over all unseen text inputs and use AI to answer
    }

    @Override
    public void uploadDocuments(AutomationExecution execution, Application application) {
        log.info("[Lever] Uploading documents");
        try {
            uploadEngine.uploadResume(execution, application);
            // Lever uses a custom component for cover letter or a text area. 
            // We use the fallback logic in uploadEngine to cover both if present.
            uploadEngine.uploadCoverLetter(execution, application);
        } catch (Exception e) {
            log.error("[Lever] Failed to upload documents: {}", e.getMessage());
        }
    }

    @Override
    public void submit(AutomationExecution execution) {
        log.info("[Lever] Submitting form (dry-run: {})", properties.isDryRun());
        Page page = sessionManager.getPage(execution);
        
        try {
            if (!properties.isDryRun()) {
                page.click("button.postings-btn.template-btn-submit");
                page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
            } else {
                log.info("[Lever] Dry run enabled. Skipping submit click.");
            }
        } catch (Exception e) {
            log.error("[Lever] Failed to submit form: {}", e.getMessage());
        }
    }

    @Override
    public boolean verifySubmission(AutomationExecution execution) {
        log.info("[Lever] Verifying submission");
        if (properties.isDryRun()) {
            return true;
        }
        
        try {
            Page page = sessionManager.getPage(execution);
            String content = page.textContent("body").toLowerCase();
            return content.contains("application submitted") || content.contains("thank you");
        } catch (Exception e) {
            log.error("[Lever] Failed to verify submission: {}", e.getMessage());
            return false;
        } finally {
            sessionManager.cleanupSession(execution);
        }
    }
}
