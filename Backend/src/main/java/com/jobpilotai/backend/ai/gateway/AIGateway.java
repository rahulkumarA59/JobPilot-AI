package com.jobpilotai.backend.ai.gateway;

import com.jobpilotai.backend.ai.gateway.dto.AIRequest;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;

import java.util.List;

/**
 * The ONLY entry point for all AI calls in the platform.
 * No business module should directly call GeminiProvider, OpenAIProvider, or ClaudeProvider.
 */
public interface AIGateway {

    AIResponse generate(AIRequest request);

    AIResponse chat(AIRequest request, List<String> messages);

    AIResponse embed(AIRequest request);
}
