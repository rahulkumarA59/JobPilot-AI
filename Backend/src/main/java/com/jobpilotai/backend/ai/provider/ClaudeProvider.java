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
public class ClaudeProvider implements AIProvider {

    private static final String MODEL_NAME = "claude-sonnet-4-20250514";
    private static final Set<String> SUPPORTED_OPS = Set.of("generate", "chat");

    @Override
    public AIResponse generate(String prompt) {
        log.info("[MOCK][Claude] Generate called. Prompt length: {}", prompt.length());
        int inputTokens = estimateTokens(prompt);
        int outputTokens = 160;
        return AIResponse.builder()
                .content("[MOCK][Claude] ATS optimization completed.")
                .provider(AIProviderType.CLAUDE)
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
        log.info("[MOCK][Claude] Chat called. Messages: {}", messages.size());
        int inputTokens = messages.stream().mapToInt(this::estimateTokens).sum();
        int outputTokens = 190;
        return AIResponse.builder()
                .content("[MOCK][Claude] Chat response generated.")
                .provider(AIProviderType.CLAUDE)
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
        log.info("[MOCK][Claude] Embed not supported. Returning error.");
        return AIResponse.builder()
                .content("")
                .provider(AIProviderType.CLAUDE)
                .modelName(MODEL_NAME)
                .success(false)
                .errorMessage("Embedding not supported by Claude provider")
                .estimatedInputTokens(0)
                .estimatedOutputTokens(0)
                .estimatedTotalTokens(0)
                .latencyMs(0)
                .mock(true)
                .build();
    }

    @Override
    public boolean isHealthy() {
        log.debug("[MOCK][Claude] Health check: healthy");
        return true;
    }

    @Override
    public AIProviderType getProviderType() {
        return AIProviderType.CLAUDE;
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
