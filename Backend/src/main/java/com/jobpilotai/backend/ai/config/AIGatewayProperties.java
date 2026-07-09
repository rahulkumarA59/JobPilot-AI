package com.jobpilotai.backend.ai.config;

import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "jobpilot.ai.gateway")
@Getter
@Setter
public class AIGatewayProperties {

    private AIProviderType primaryProvider = AIProviderType.GEMINI;
    private List<AIProviderType> fallbackOrder = new ArrayList<>(List.of(AIProviderType.OPENAI, AIProviderType.CLAUDE));
    private boolean fallbackEnabled = true;
    private int maxRetries = 2;
}
