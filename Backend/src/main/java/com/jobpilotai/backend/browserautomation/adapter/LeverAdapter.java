package com.jobpilotai.backend.browserautomation.adapter;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.job.enums.JobSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LeverAdapter implements BrowserAutomationAdapter {

    @Override
    public boolean supports(JobSource source) {
        return source == JobSource.LEVER;
    }

    @Override
    public void login(AutomationExecution execution) {
        log.info("[Lever] Mock login for execution: {}", execution.getPublicId());
    }

    @Override
    public void navigate(AutomationExecution execution, Application application) {
        log.info("[Lever] Mock navigate to application: {}", application.getJob().getApplyUrl());
    }

    @Override
    public void locateElements(AutomationExecution execution) {
        log.info("[Lever] Mock locate elements");
    }

    @Override
    public void fillForm(AutomationExecution execution, Application application) {
        log.info("[Lever] Mock fill form for candidate: {}", application.getCandidateProfile().getPublicId());
    }

    @Override
    public void uploadDocuments(AutomationExecution execution, Application application) {
        log.info("[Lever] Mock upload documents");
    }

    @Override
    public void submit(AutomationExecution execution) {
        log.info("[Lever] Mock submit form");
    }

    @Override
    public boolean verifySubmission(AutomationExecution execution) {
        log.info("[Lever] Mock verify submission");
        return true;
    }
}
