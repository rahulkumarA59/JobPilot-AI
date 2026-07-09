package com.jobpilotai.backend.browserautomation.adapter;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.job.enums.JobSource;

public interface BrowserAutomationAdapter {
    
    /**
     * Identifies which ATS this adapter supports.
     */
    boolean supports(JobSource source);
    
    void login(AutomationExecution execution);
    
    void navigate(AutomationExecution execution, Application application);
    
    void locateElements(AutomationExecution execution);
    
    void fillForm(AutomationExecution execution, Application application);
    
    void uploadDocuments(AutomationExecution execution, Application application);
    
    void submit(AutomationExecution execution);
    
    boolean verifySubmission(AutomationExecution execution);
}
