package com.jobpilotai.backend.ai.provider;

import com.jobpilotai.backend.ai.gateway.AIProvider;
import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Slf4j
@Component
public class GeminiProvider implements AIProvider {

    private static final String MODEL_NAME = "gemini-2.0-flash";
    private static final Set<String> SUPPORTED_OPS = Set.of("generate", "chat", "embed");

    @Override
    public AIResponse generate(String prompt) {
        log.info("[MOCK][Gemini] Generate called. Prompt length: {}", prompt.length());
        int inputTokens = estimateTokens(prompt);
        int outputTokens = 150;
        return AIResponse.builder()
                .content("[MOCK][Gemini] Resume analysis completed.")
                .provider(AIProviderType.GEMINI)
                .modelName(MODEL_NAME)
                .success(true)
                .estimatedInputTokens(inputTokens)
                .estimatedOutputTokens(outputTokens)
                .estimatedTotalTokens(inputTokens + outputTokens)
                .latencyMs(0)
                .mock(true)
                .build();
    }

    @Override
    public AIResponse chat(List<String> messages) {
        log.info("[MOCK][Gemini] Chat called. Messages: {}", messages.size());
        int inputTokens = messages.stream().mapToInt(this::estimateTokens).sum();
        int outputTokens = 200;
        return AIResponse.builder()
                .content("[MOCK][Gemini] Chat response generated.")
                .provider(AIProviderType.GEMINI)
                .modelName(MODEL_NAME)
                .success(true)
                .estimatedInputTokens(inputTokens)
                .estimatedOutputTokens(outputTokens)
                .estimatedTotalTokens(inputTokens + outputTokens)
                .latencyMs(0)
                .mock(true)
                .build();
    }

    @Override
    public AIResponse embed(String text) {
        log.info("[MOCK][Gemini] Embed called. Text length: {}", text.length());
        int inputTokens = estimateTokens(text);
        return AIResponse.builder()
                .content("[MOCK][Gemini] Embedding vector generated.")
                .provider(AIProviderType.GEMINI)
                .modelName(MODEL_NAME)
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
        log.debug("[MOCK][Gemini] Health check: healthy");
        return true;
    }

    @Override
    public AIProviderType getProviderType() {
        return AIProviderType.GEMINI;
    }

    @Override
    public String getModelName() {
        return MODEL_NAME;
    }

    @Override
    public Set<String> getSupportedOperations() {
        return SUPPORTED_OPS;
    }

    private int estimateTokens(String text) {
        if (text == null || text.isEmpty()) return 0;
        return text.length() / 4;
    }
}
