package com.jobpilotai.backend.ai.router;

import com.jobpilotai.backend.ai.config.AIGatewayProperties;
import com.jobpilotai.backend.ai.gateway.AIProvider;
import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AIRouterTest {

    private AIGatewayProperties properties;
    private AIProvider geminiProvider;
    private AIProvider openaiProvider;
    private AIProvider claudeProvider;
    private AIRouter router;

    @BeforeEach
    void setUp() {
        properties = new AIGatewayProperties();
        properties.setPrimaryProvider(AIProviderType.GEMINI);
        properties.setFallbackOrder(List.of(AIProviderType.OPENAI, AIProviderType.CLAUDE));
        properties.setFallbackEnabled(true);

        geminiProvider = mock(AIProvider.class);
        when(geminiProvider.getProviderType()).thenReturn(AIProviderType.GEMINI);
        when(geminiProvider.isHealthy()).thenReturn(true);
        when(geminiProvider.getSupportedOperations()).thenReturn(Set.of("generate", "chat", "embed"));

        openaiProvider = mock(AIProvider.class);
        when(openaiProvider.getProviderType()).thenReturn(AIProviderType.OPENAI);
        when(openaiProvider.isHealthy()).thenReturn(true);
        when(openaiProvider.getSupportedOperations()).thenReturn(Set.of("generate", "chat", "embed"));

        claudeProvider = mock(AIProvider.class);
        when(claudeProvider.getProviderType()).thenReturn(AIProviderType.CLAUDE);
        when(claudeProvider.isHealthy()).thenReturn(true);
        when(claudeProvider.getSupportedOperations()).thenReturn(Set.of("generate", "chat"));

        router = new AIRouter(properties, List.of(geminiProvider, openaiProvider, claudeProvider));
    }

    @Test
    void selectProvider_ShouldReturnPreferred() {
        AIProvider result = router.selectProvider(AIProviderType.OPENAI);
        assertEquals(AIProviderType.OPENAI, result.getProviderType());
    }

    @Test
    void selectProvider_ShouldReturnPrimaryWhenNoPreference() {
        AIProvider result = router.selectProvider(null);
        assertEquals(AIProviderType.GEMINI, result.getProviderType());
    }

    @Test
    void selectProvider_ShouldFallbackWhenPrimaryUnhealthy() {
        when(geminiProvider.isHealthy()).thenReturn(false);
        AIProvider result = router.selectProvider(null);
        assertEquals(AIProviderType.OPENAI, result.getProviderType());
    }

    @Test
    void selectProvider_ShouldFallbackToClaudeWhenBothUnhealthy() {
        when(geminiProvider.isHealthy()).thenReturn(false);
        when(openaiProvider.isHealthy()).thenReturn(false);
        AIProvider result = router.selectProvider(null);
        assertEquals(AIProviderType.CLAUDE, result.getProviderType());
    }

    @Test
    void selectProvider_ShouldThrowWhenAllUnhealthy() {
        when(geminiProvider.isHealthy()).thenReturn(false);
        when(openaiProvider.isHealthy()).thenReturn(false);
        when(claudeProvider.isHealthy()).thenReturn(false);
        assertThrows(IllegalStateException.class, () -> router.selectProvider(null));
    }

    @Test
    void selectProviderForOperation_ShouldSkipProviderWithoutCapability() {
        // Claude does not support embed
        AIProvider result = router.selectProviderForOperation(AIProviderType.CLAUDE, "embed");
        // Should fallback to Gemini (primary) which supports embed
        assertEquals(AIProviderType.GEMINI, result.getProviderType());
    }

    @Test
    void getHealthStatus_ShouldReturnAllStatuses() {
        Map<AIProviderType, Boolean> status = router.getHealthStatus();
        assertEquals(3, status.size());
        assertTrue(status.get(AIProviderType.GEMINI));
        assertTrue(status.get(AIProviderType.OPENAI));
        assertTrue(status.get(AIProviderType.CLAUDE));
    }

    @Test
    void selectProvider_ShouldFallbackWhenPreferredUnhealthy() {
        when(openaiProvider.isHealthy()).thenReturn(false);
        AIProvider result = router.selectProvider(AIProviderType.OPENAI);
        // Should fallback to primary (Gemini)
        assertEquals(AIProviderType.GEMINI, result.getProviderType());
    }
}
