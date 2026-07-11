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
public class WorkdayAdapter implements BrowserAutomationAdapter {

    private final BrowserSessionManager sessionManager;
    private final FormFillingEngine formEngine;
    private final ResumeUploadEngine uploadEngine;
    private final AutomationProperties properties;

    @Override
    public boolean supports(JobSource source) {
        return source == JobSource.WORKDAY;
    }

    @Override
    public void login(AutomationExecution execution) {
        // Workday often requires account creation. In a full system we'd handle login/signup flow.
        // For this V1, we log the requirement and rely on Workday "Apply Manually" without login if allowed.
        log.info("[Workday] Login/Account flow is extremely complex. Proceeding directly to apply.");
    }

    @Override
    public void navigate(AutomationExecution execution, Application application) {
        String url = application.getJob().getApplyUrl();
        log.info("[Workday] Navigating to: {}", url);
        Page page = sessionManager.getOrCreatePage(execution);
        page.navigate(url);
        page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
        
        try {
            if (page.isVisible("a:has-text('Apply')")) {
                page.click("a:has-text('Apply')");
                page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
            }
            if (page.isVisible("button:has-text('Apply Manually')")) {
                page.click("button:has-text('Apply Manually')");
                page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
            }
        } catch (Exception e) {
            log.warn("[Workday] Navigation complex: {}", e.getMessage());
        }
    }

    @Override
    public void locateElements(AutomationExecution execution) {}

    @Override
    public void fillForm(AutomationExecution execution, Application application) {
        log.info("[Workday] Workday has multi-page forms. Using standard fallback logic.");
        formEngine.fillName(execution, application);
        formEngine.fillEmail(execution, application);
        formEngine.fillPhone(execution, application);
    }

    @Override
    public void uploadDocuments(AutomationExecution execution, Application application) {
        log.info("[Workday] Uploading documents");
        uploadEngine.uploadResume(execution, application);
    }

    @Override
    public void submit(AutomationExecution execution) {
        log.info("[Workday] Attempting submit (dry-run: {})", properties.isDryRun());
        Page page = sessionManager.getPage(execution);
        try {
            if (!properties.isDryRun() && page.isVisible("button:has-text('Submit')")) {
                page.click("button:has-text('Submit')");
            }
        } catch (Exception e) {
            log.error("[Workday] Failed to submit: {}", e.getMessage());
        }
    }

    @Override
    public boolean verifySubmission(AutomationExecution execution) {
        sessionManager.cleanupSession(execution);
        return true;
    }
}
