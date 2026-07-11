package com.jobpilotai.backend.browserautomation.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jobpilot.automation")
@Getter
@Setter
public class AutomationProperties {
    private boolean dryRun = true;
    private boolean headless = true;
    private boolean screenshotOnError = true;
    private int timeoutSeconds = 30;
    private int maxApplicationsPerRun = 10;
}
