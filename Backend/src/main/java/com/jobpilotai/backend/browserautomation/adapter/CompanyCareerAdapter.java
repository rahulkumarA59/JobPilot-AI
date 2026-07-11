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
public class CompanyCareerAdapter implements BrowserAutomationAdapter {

    private final BrowserSessionManager sessionManager;
    private final FormFillingEngine formEngine;
    private final ResumeUploadEngine uploadEngine;
    private final AutomationProperties properties;

    @Override
    public boolean supports(JobSource source) {
        return source == JobSource.COMPANY_CAREER;
    }

    @Override
    public void login(AutomationExecution execution) {}

    @Override
    public void navigate(AutomationExecution execution, Application application) {
        String url = application.getJob().getApplyUrl();
        log.info("[CompanyCareer] Navigating to: {}", url);
        Page page = sessionManager.getOrCreatePage(execution);
        page.navigate(url);
        page.waitForLoadState(com.microsoft.playwright.options.LoadState.NETWORKIDLE);
    }

    @Override
    public void locateElements(AutomationExecution execution) {}

    @Override
    public void fillForm(AutomationExecution execution, Application application) {
        log.info("[CompanyCareer] Filling generic form for candidate: {}", application.getCandidateProfile().getPublicId());
        formEngine.fillName(execution, application);
        formEngine.fillEmail(execution, application);
        formEngine.fillPhone(execution, application);
    }

    @Override
    public void uploadDocuments(AutomationExecution execution, Application application) {
        log.info("[CompanyCareer] Uploading documents to generic form");
        uploadEngine.uploadResume(execution, application);
    }

    @Override
    public void submit(AutomationExecution execution) {
        log.info("[CompanyCareer] Dry-run is {} - skipping random submit on generic page", properties.isDryRun());
    }

    @Override
    public boolean verifySubmission(AutomationExecution execution) {
        sessionManager.cleanupSession(execution);
        return true;
    }
}
