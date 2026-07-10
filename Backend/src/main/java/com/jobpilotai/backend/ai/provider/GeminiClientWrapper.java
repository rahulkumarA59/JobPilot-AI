package com.jobpilotai.backend.ai.provider;

import com.google.genai.Client;
import com.google.genai.models.Models;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.jobpilotai.backend.ai.config.AIGatewayProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Slf4j
@Component
public class GeminiClientWrapper {

    private final AIGatewayProperties.Gemini config;
    private Client client;

    public GeminiClientWrapper(AIGatewayProperties properties) {
        this.config = properties.getProviders().getGemini();
        initClient();
    }

    private void initClient() {
        if (StringUtils.hasText(config.getApiKey())) {
            try {
                this.client = Client.builder().apiKey(config.getApiKey()).build();
                log.info("GeminiClientWrapper initialized successfully.");
            } catch (Exception e) {
                log.warn("Failed to initialize Gemini Client. Falling back to mock.", e);
            }
        } else {
            log.warn("GEMINI_API_KEY is not set. GeminiClientWrapper will operate in MOCK mode.");
        }
    }

    public boolean isLive() {
        return this.client != null;
    }

    public String generateContent(String prompt) throws Exception {
        if (!isLive()) {
            throw new IllegalStateException("Gemini client is not initialized.");
        }

        GenerateContentConfig generateConfig = GenerateContentConfig.builder()
                .temperature((float) config.getTemperature())
                .topP((float) config.getTopP())
                .topK(config.getTopK())
                .maxOutputTokens(config.getMaxOutputTokens())
                .build();

        Models models = client.models();
        GenerateContentResponse response = models.generateContent(config.getDefaultModel(), prompt, generateConfig);
        
        if (response != null && response.text() != null) {
            return response.text();
        }
        throw new RuntimeException("Empty response from Gemini API");
    }
}
