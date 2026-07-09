package com.jobpilotai.backend.ai.gateway.dto;

import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AIResponse {
    private final String content;
    private final AIProviderType provider;
    private final String modelName;
    private final boolean success;
    private final String errorMessage;
    private final int estimatedInputTokens;
    private final int estimatedOutputTokens;
    private final int estimatedTotalTokens;
    private final long latencyMs;
    private final boolean mock;
}
