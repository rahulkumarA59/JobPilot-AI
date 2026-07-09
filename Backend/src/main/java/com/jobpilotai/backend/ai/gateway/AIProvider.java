package com.jobpilotai.backend.ai.gateway;

import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;

import java.util.List;
import java.util.Set;

/**
 * Core interface for all AI providers.
 * Every LLM integration must implement this contract.
 * New providers (Grok, DeepSeek, Mistral, Ollama, etc.) only need to implement this interface.
 */
public interface AIProvider {

    AIResponse generate(String prompt);

    AIResponse chat(List<String> messages);

    AIResponse embed(String text);

    boolean isHealthy();

    AIProviderType getProviderType();

    String getModelName();

    Set<String> getSupportedOperations();
}
