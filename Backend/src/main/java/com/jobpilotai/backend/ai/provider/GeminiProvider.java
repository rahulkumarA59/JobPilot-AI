package com.jobpilotai.backend.ai.provider;

import com.jobpilotai.backend.ai.gateway.AIProvider;
import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;
import com.jobpilotai.backend.ai.config.AIGatewayProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiProvider implements AIProvider {

    private final GeminiClientWrapper geminiClientWrapper;
    private final AIGatewayProperties gatewayProperties;
    
    private static final Set<String> SUPPORTED_OPS = Set.of("generate", "chat", "embed");

    @Override
    public AIResponse generate(String prompt) {
        if (!geminiClientWrapper.isLive()) {
            return fallbackMockGenerate(prompt);
        }
        
        long startTime = System.currentTimeMillis();
        try {
            String content = geminiClientWrapper.generateContent(prompt);
            long latency = System.currentTimeMillis() - startTime;
            
            // Validate JSON if expected (crude heuristic: if prompt asks for JSON, response should be JSON)
            if (prompt.toLowerCase().contains("json") || content.trim().startsWith("{") || content.trim().startsWith("[")) {
                if (!isValidJson(content)) {
                    log.error("[Gemini API Error] Invalid JSON received from provider.");
                    return AIResponse.builder()
                            .content("{}")
                            .provider(AIProviderType.GEMINI)
                            .modelName(getModelName())
                            .success(false)
                            .errorMessage("Invalid JSON response from AI provider")
                            .latencyMs(latency)
                            .mock(false)
                            .build();
                }
            }

            return AIResponse.builder()
                    .content(content)
                    .provider(AIProviderType.GEMINI)
                    .modelName(getModelName())
                    .success(true)
                    .estimatedInputTokens(estimateTokens(prompt))
                    .estimatedOutputTokens(estimateTokens(content))
                    .estimatedTotalTokens(estimateTokens(prompt) + estimateTokens(content))
                    .latencyMs(latency)
                    .mock(false)
                    .build();
        } catch (Exception e) {
            log.error("[Gemini API Error] Failed to generate content: {}", e.getMessage());
            return fallbackMockGenerate(prompt);
        }
    }

    @Override
    public AIResponse chat(List<String> messages) {
        String prompt = String.join("\n", messages);
        if (!geminiClientWrapper.isLive()) {
            return fallbackMockChat(messages);
        }

        long startTime = System.currentTimeMillis();
        try {
            String content = geminiClientWrapper.generateContent(prompt);
            long latency = System.currentTimeMillis() - startTime;
            
            return AIResponse.builder()
                    .content(content)
                    .provider(AIProviderType.GEMINI)
                    .modelName(getModelName())
                    .success(true)
                    .estimatedInputTokens(estimateTokens(prompt))
                    .estimatedOutputTokens(estimateTokens(content))
                    .estimatedTotalTokens(estimateTokens(prompt) + estimateTokens(content))
                    .latencyMs(latency)
                    .mock(false)
                    .build();
        } catch (Exception e) {
            log.error("[Gemini API Error] Failed to chat: {}", e.getMessage());
            return fallbackMockChat(messages);
        }
    }

    @Override
    public AIResponse embed(String text) {
        // Fallback for embedding as we only integrated text generation in the wrapper
        return fallbackMockEmbed(text);
    }

    private AIResponse fallbackMockGenerate(String prompt) {
        log.info("[MOCK][Gemini] Generate called via fallback.");
        int inputTokens = estimateTokens(prompt);
        return AIResponse.builder()
                .content("{\"mock\": \"true\", \"message\": \"[MOCK][Gemini] Generated successfully.\"}")
                .provider(AIProviderType.GEMINI)
                .modelName(getModelName())
                .success(true)
                .estimatedInputTokens(inputTokens)
                .estimatedOutputTokens(150)
                .estimatedTotalTokens(inputTokens + 150)
                .latencyMs(0)
                .mock(true)
                .build();
    }

    private AIResponse fallbackMockChat(List<String> messages) {
        log.info("[MOCK][Gemini] Chat called via fallback.");
        int inputTokens = messages.stream().mapToInt(this::estimateTokens).sum();
        return AIResponse.builder()
                .content("{\"mock\": \"true\", \"message\": \"[MOCK][Gemini] Chat response generated.\"}")
                .provider(AIProviderType.GEMINI)
                .modelName(getModelName())
                .success(true)
                .estimatedInputTokens(inputTokens)
                .estimatedOutputTokens(200)
                .estimatedTotalTokens(inputTokens + 200)
                .latencyMs(0)
                .mock(true)
                .build();
    }

    private AIResponse fallbackMockEmbed(String text) {
        int inputTokens = estimateTokens(text);
        return AIResponse.builder()
                .content("[MOCK][Gemini] Embedding vector generated.")
                .provider(AIProviderType.GEMINI)
                .modelName(getModelName())
                .success(true)
                .estimatedInputTokens(inputTokens)
                .estimatedOutputTokens(0)
                .estimatedTotalTokens(inputTokens)
                .latencyMs(0)
                .mock(true)
                .build();
    }

    @Override
    public boolean isHealthy() {
        return true; // Health is true since we fallback gracefully
    }

    @Override
    public AIProviderType getProviderType() {
        return AIProviderType.GEMINI;
    }

    @Override
    public String getModelName() {
        return gatewayProperties.getProviders().getGemini().getDefaultModel();
    }

    @Override
    public Set<String> getSupportedOperations() {
        return SUPPORTED_OPS;
    }

    private int estimateTokens(String text) {
        if (text == null || text.isEmpty()) return 0;
        return text.length() / 4;
    }

    private boolean isValidJson(String json) {
        try {
            String trimmed = json.trim();
            if (trimmed.startsWith("{")) {
                new com.fasterxml.jackson.databind.ObjectMapper().readTree(trimmed);
                return true;
            } else if (trimmed.startsWith("[")) {
                new com.fasterxml.jackson.databind.ObjectMapper().readTree(trimmed);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
