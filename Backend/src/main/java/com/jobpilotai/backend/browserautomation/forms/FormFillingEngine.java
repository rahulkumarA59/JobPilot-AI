package com.jobpilotai.backend.browserautomation.forms;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.session.BrowserSessionManager;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.microsoft.playwright.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FormFillingEngine {

    private final BrowserSessionManager sessionManager;

    public void fillText(AutomationExecution execution, String selector, String value) {
        if (value == null || value.isBlank()) return;
        try {
            Page page = sessionManager.getPage(execution);
            if (page.isVisible(selector)) {
                page.fill(selector, value);
                log.debug("Filled text into {}", selector);
            }
        } catch (Exception e) {
            log.warn("Failed to fill text '{}': {}", selector, e.getMessage());
        }
    }

    public void fillEmail(AutomationExecution execution, Application application) {
        fillText(execution, "input[type='email']", application.getCandidateProfile().getUser().getEmail());
        // Fallback for fields named "email"
        fillText(execution, "input[name*='email' i]", application.getCandidateProfile().getUser().getEmail());
    }

    public void fillPhone(AutomationExecution execution, Application application) {
        // We'll use a placeholder phone number if not present in user profile
        fillText(execution, "input[name*='phone' i]", "555-0100");
    }

    public void fillName(AutomationExecution execution, Application application) {
        CandidateProfile profile = application.getCandidateProfile();
        
        // Try filling full name
        fillText(execution, "input[name*='name' i]", profile.getUser().getFirstName() + " " + profile.getUser().getLastName());
        
        // Try filling first and last separately
        fillText(execution, "input[name*='first' i]", profile.getUser().getFirstName());
        fillText(execution, "input[name*='last' i]", profile.getUser().getLastName());
    }

    public void fillLinkedIn(AutomationExecution execution, Application application) {
        fillText(execution, "input[name*='linkedin' i]", "https://linkedin.com/in/candidate");
    }

    public void fillGitHub(AutomationExecution execution, Application application) {
        fillText(execution, "input[name*='github' i]", "https://github.com/candidate");
    }
}
