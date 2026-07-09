package com.jobpilotai.backend.browserautomation.adapter;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.job.enums.JobSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CompanyCareerAdapter implements BrowserAutomationAdapter {

    @Override
    public boolean supports(JobSource source) {
        return source == JobSource.COMPANY_CAREER;
    }

    @Override
    public void login(AutomationExecution execution) {
        log.info("[CompanyCareer] Mock login for execution: {}", execution.getPublicId());
    }

    @Override
    public void navigate(AutomationExecution execution, Application application) {
        log.info("[CompanyCareer] Mock navigate to application: {}", application.getJob().getApplyUrl());
    }

    @Override
    public void locateElements(AutomationExecution execution) {
        log.info("[CompanyCareer] Mock locate elements");
    }

    @Override
    public void fillForm(AutomationExecution execution, Application application) {
        log.info("[CompanyCareer] Mock fill form for candidate: {}", application.getCandidateProfile().getPublicId());
    }

    @Override
    public void uploadDocuments(AutomationExecution execution, Application application) {
        log.info("[CompanyCareer] Mock upload documents");
    }

    @Override
    public void submit(AutomationExecution execution) {
        log.info("[CompanyCareer] Mock submit form");
    }

    @Override
    public boolean verifySubmission(AutomationExecution execution) {
        log.info("[CompanyCareer] Mock verify submission");
        return true;
    }
}
