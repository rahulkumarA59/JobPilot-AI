package com.jobpilotai.backend.browserautomation.forms;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class FormFillingEngine {

    public void fillText(AutomationExecution execution, String value) {
        log.info("Filling text: {}", value);
    }

    public void fillEmail(AutomationExecution execution, Application application) {
        log.info("Filling email for execution: {}", execution.getPublicId());
    }

    public void fillPhone(AutomationExecution execution, Application application) {
        log.info("Filling phone for execution: {}", execution.getPublicId());
    }

    public void fillAddress(AutomationExecution execution, Application application) {
        log.info("Filling address for execution: {}", execution.getPublicId());
    }

    public void fillExperience(AutomationExecution execution, Application application) {
        log.info("Filling experience for execution: {}", execution.getPublicId());
    }

    public void fillSalary(AutomationExecution execution, Application application) {
        log.info("Filling salary for execution: {}", execution.getPublicId());
    }

    public void fillAvailability(AutomationExecution execution, Application application) {
        log.info("Filling availability for execution: {}", execution.getPublicId());
    }

    public void fillLinkedIn(AutomationExecution execution, Application application) {
        log.info("Filling LinkedIn for execution: {}", execution.getPublicId());
    }

    public void fillPortfolio(AutomationExecution execution, Application application) {
        log.info("Filling Portfolio for execution: {}", execution.getPublicId());
    }

    public void fillGitHub(AutomationExecution execution, Application application) {
        log.info("Filling GitHub for execution: {}", execution.getPublicId());
    }
}
