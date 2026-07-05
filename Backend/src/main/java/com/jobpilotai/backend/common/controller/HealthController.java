package com.jobpilotai.backend.common.controller;

import com.jobpilotai.backend.common.constants.ApiConstants;
import com.jobpilotai.backend.common.dto.ApiResponse;
import com.jobpilotai.backend.common.dto.HealthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
public class HealthController {

    private final String applicationName;
    private final String applicationVersion;

    public HealthController(
            @Value("${spring.application.name:jobpilot-ai-backend}") String applicationName,
            @Value("${jobpilot.application.version:0.0.1-SNAPSHOT}") String applicationVersion) {
        this.applicationName = applicationName;
        this.applicationVersion = applicationVersion;
    }

    @GetMapping(ApiConstants.HEALTH_PATH)
    public ApiResponse<HealthResponse> health() {
        HealthResponse health = HealthResponse.builder()
                .application(applicationName)
                .version(applicationVersion)
                .databaseStatus("MOCK_OK")
                .timestamp(Instant.now())
                .build();
        return ApiResponse.success("Application is healthy", health);
    }
}
