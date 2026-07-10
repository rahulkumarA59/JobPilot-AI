package com.jobpilotai.backend.ai.provider;

import com.jobpilotai.backend.ai.config.AIGatewayProperties;
import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GeminiProviderTest {

    @Mock
    private GeminiClientWrapper geminiClientWrapper;

    @Mock
    private AIGatewayProperties gatewayProperties;

    @InjectMocks
    private GeminiProvider geminiProvider;

    private AIGatewayProperties.Providers providersConfig;
    private AIGatewayProperties.Gemini geminiConfig;

    @BeforeEach
    void setUp() {
        providersConfig = new AIGatewayProperties.Providers();
        geminiConfig = new AIGatewayProperties.Gemini();
        geminiConfig.setDefaultModel("gemini-2.5-flash");
        providersConfig.setGemini(geminiConfig);
        
        lenient().when(gatewayProperties.getProviders()).thenReturn(providersConfig);
    }

    @Test
    void testGenerate_WithLiveWrapper_ShouldReturnContent() throws Exception {
        when(geminiClientWrapper.isLive()).thenReturn(true);
        when(geminiClientWrapper.generateContent(anyString())).thenReturn("{\"message\": \"Generated via real AI\"}");

        AIResponse response = geminiProvider.generate("Test prompt");

        assertTrue(response.isSuccess());
        assertFalse(response.isMock());
        assertEquals("{\"message\": \"Generated via real AI\"}", response.getContent());
        assertEquals(AIProviderType.GEMINI, response.getProvider());
        assertEquals("gemini-2.5-flash", response.getModelName());
    }

    @Test
    void testGenerate_WithFallbackWrapper_ShouldReturnMock() {
        when(geminiClientWrapper.isLive()).thenReturn(false);

        AIResponse response = geminiProvider.generate("Test prompt");

        assertTrue(response.isSuccess());
        assertTrue(response.isMock());
        assertTrue(response.getContent().contains("[MOCK][Gemini] Generated successfully"));
    }

    @Test
    void testGenerate_WithLiveWrapperError_ShouldReturnMock() throws Exception {
        when(geminiClientWrapper.isLive()).thenReturn(true);
        when(geminiClientWrapper.generateContent(anyString())).thenThrow(new RuntimeException("API Error"));

        AIResponse response = geminiProvider.generate("Test prompt");

        assertTrue(response.isSuccess());
        assertTrue(response.isMock());
        assertTrue(response.getContent().contains("[MOCK][Gemini] Generated successfully"));
    }

    @Test
    void testChat_WithLiveWrapper_ShouldReturnContent() throws Exception {
        when(geminiClientWrapper.isLive()).thenReturn(true);
        when(geminiClientWrapper.generateContent(anyString())).thenReturn("{\"message\": \"Chat via real AI\"}");

        AIResponse response = geminiProvider.chat(List.of("Message 1", "Message 2"));

        assertTrue(response.isSuccess());
        assertFalse(response.isMock());
        assertEquals("{\"message\": \"Chat via real AI\"}", response.getContent());
    }
}
