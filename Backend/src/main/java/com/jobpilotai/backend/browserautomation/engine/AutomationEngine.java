package com.jobpilotai.backend.browserautomation.engine;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.browserautomation.adapter.BrowserAutomationAdapter;
import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationEngine {

    private final List<BrowserAutomationAdapter> adapters;

    public void execute(AutomationExecution execution, Application application) {
        log.info("Executing workflow for execution: {}", execution.getPublicId());
        
        BrowserAutomationAdapter adapter = getAdapterFor(application);
        if (adapter == null) {
            log.error("No adapter found for job source: {}", application.getJob().getSource());
            return;
        }

        try {
            adapter.login(execution);
            adapter.navigate(execution, application);
            adapter.locateElements(execution);
            adapter.fillForm(execution, application);
            adapter.uploadDocuments(execution, application);
            adapter.submit(execution);
            adapter.verifySubmission(execution);
        } catch (Exception e) {
            log.error("Error during automation execution: {}", execution.getPublicId(), e);
            throw new RuntimeException("Automation failed", e);
        }
    }

    public void pause(AutomationExecution execution) {
        log.info("Pausing execution: {}", execution.getPublicId());
    }

    public void resume(AutomationExecution execution) {
        log.info("Resuming execution: {}", execution.getPublicId());
    }

    public void cancel(AutomationExecution execution) {
        log.info("Cancelling execution: {}", execution.getPublicId());
    }

    private BrowserAutomationAdapter getAdapterFor(Application application) {
        return adapters.stream()
                .filter(a -> a.supports(application.getJob().getSource()))
                .findFirst()
                .orElse(null);
    }
}
