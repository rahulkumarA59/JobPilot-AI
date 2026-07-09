package com.jobpilotai.backend.browserautomation.upload;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ResumeUploadEngine {

    public void uploadResume(AutomationExecution execution, Application application) {
        log.info("Uploading resume for execution: {}", execution.getPublicId());
    }

    public void uploadCoverLetter(AutomationExecution execution, Application application) {
        log.info("Uploading cover letter for execution: {}", execution.getPublicId());
    }

    public void uploadAttachments(AutomationExecution execution, Application application) {
        log.info("Uploading other attachments for execution: {}", execution.getPublicId());
    }
}
