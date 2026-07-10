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
    private Providers providers = new Providers();

    @Getter
    @Setter
    public static class Providers {
        private Gemini gemini = new Gemini();
    }

    @Getter
    @Setter
    public static class Gemini {
        private String apiKey;
        private String defaultModel = "gemini-2.5-flash";
        private double temperature = 0.7;
        private double topP = 0.95;
        private int topK = 40;
        private int maxOutputTokens = 8192;
        private int requestTimeout = 30; // seconds
    }
}
