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

@Slf4j
@Component
@RequiredArgsConstructor
public class AshbyAdapter implements BrowserAutomationAdapter {

    private final BrowserSessionManager sessionManager;
    private final FormFillingEngine formEngine;
    private final ResumeUploadEngine uploadEngine;
    private final AutomationProperties properties;

    @Override
    public boolean supports(JobSource source) {
        return source == JobSource.ASHBY;
    }

    @Override
    public void login(AutomationExecution execution) {}

    @Override
    public void navigate(AutomationExecution execution, Application application) {
        String url = application.getJob().getApplyUrl();
        log.info("[Ashby] Navigating to: {}", url);
        Page page = sessionManager.getOrCreatePage(execution);
        page.navigate(url);
        page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
        
        // Sometimes Ashby requires clicking 'Apply for this Job' button
        if (page.isVisible("button:has-text('Apply for this Job')")) {
            page.click("button:has-text('Apply for this Job')");
        }
    }

    @Override
    public void locateElements(AutomationExecution execution) {}

    @Override
    public void fillForm(AutomationExecution execution, Application application) {
        log.info("[Ashby] Filling form for candidate: {}", application.getCandidateProfile().getPublicId());
        formEngine.fillName(execution, application);
        formEngine.fillEmail(execution, application);
        formEngine.fillPhone(execution, application);
        formEngine.fillLinkedIn(execution, application);
        formEngine.fillGitHub(execution, application);
    }

    @Override
    public void uploadDocuments(AutomationExecution execution, Application application) {
        log.info("[Ashby] Uploading documents");
        uploadEngine.uploadResume(execution, application);
    }

    @Override
    public void submit(AutomationExecution execution) {
        log.info("[Ashby] Submitting form (dry-run: {})", properties.isDryRun());
        Page page = sessionManager.getPage(execution);
        try {
            if (!properties.isDryRun()) {
                page.click("button[type='submit']");
                page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
            }
        } catch (Exception e) {
            log.error("[Ashby] Failed to submit form: {}", e.getMessage());
        }
    }

    @Override
    public boolean verifySubmission(AutomationExecution execution) {
        log.info("[Ashby] Verifying submission");
        if (properties.isDryRun()) return true;
        
        try {
            Page page = sessionManager.getPage(execution);
            String content = page.textContent("body").toLowerCase();
            return content.contains("application submitted") || content.contains("thank you");
        } catch (Exception e) {
            log.error("[Ashby] Failed to verify submission: {}", e.getMessage());
            return false;
        } finally {
            sessionManager.cleanupSession(execution);
        }
    }
}
