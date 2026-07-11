package com.jobpilotai.backend.job.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "jobpilot.job-sources")
@Getter
@Setter
public class JobSourceProperties {
    private List<String> greenhouseBoards = new ArrayList<>(List.of("stripe", "figma", "notion"));
    private List<String> leverCompanies = new ArrayList<>(List.of("netflix", "cloudflare"));
    private List<String> ashbyCompanies = new ArrayList<>(List.of("ramp", "linear"));
}
