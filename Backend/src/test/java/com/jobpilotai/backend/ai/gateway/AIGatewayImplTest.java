package com.jobpilotai.backend.ai.gateway;

import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.domain.PromptType;
import com.jobpilotai.backend.ai.gateway.dto.AIRequest;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;
import com.jobpilotai.backend.ai.router.AIRouter;
import com.jobpilotai.backend.ai.usage.UsageTrackingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AIGatewayImplTest {

    @Mock
    private AIRouter router;

    @Mock
    private UsageTrackingService usageTrackingService;

    @Mock
    private AIProvider provider;

    @InjectMocks
    private AIGatewayImpl gateway;

    private AIRequest request;
    private AIResponse mockResponse;

    @BeforeEach
    void setUp() {
        request = AIRequest.builder()
                .prompt("Test prompt")
                .promptType(PromptType.RESUME_TAILORING)
                .operation("generate")
                .candidateProfileId(1L)
                .build();

        mockResponse = AIResponse.builder()
                .content("[MOCK][Gemini] Resume analysis completed.")
                .provider(AIProviderType.GEMINI)
                .modelName("gemini-2.0-flash")
                .success(true)
                .estimatedInputTokens(10)
                .estimatedOutputTokens(150)
                .estimatedTotalTokens(160)
                .latencyMs(0)
                .mock(true)
                .build();
    }

    @Test
    void generate_ShouldRouteAndTrackUsage() {
        when(router.selectProviderForOperation(any(), eq("generate"))).thenReturn(provider);
        when(provider.getProviderType()).thenReturn(AIProviderType.GEMINI);
        when(provider.generate(any())).thenReturn(mockResponse);

        AIResponse response = gateway.generate(request);

        assertTrue(response.isSuccess());
        assertEquals(AIProviderType.GEMINI, response.getProvider());
        verify(usageTrackingService).track(eq(request), any(AIResponse.class));
    }

    @Test
    void generate_ShouldReturnErrorResponse_WhenProviderFails() {
        when(router.selectProviderForOperation(any(), eq("generate")))
                .thenThrow(new IllegalStateException("No healthy provider"));

        AIResponse response = gateway.generate(request);

        assertFalse(response.isSuccess());
        assertNotNull(response.getErrorMessage());
        verify(usageTrackingService).track(eq(request), any(AIResponse.class));
    }

    @Test
    void chat_ShouldRouteAndTrackUsage() {
        when(router.selectProviderForOperation(any(), eq("chat"))).thenReturn(provider);
        when(provider.getProviderType()).thenReturn(AIProviderType.GEMINI);
        when(provider.chat(any())).thenReturn(mockResponse);

        AIResponse response = gateway.chat(request, List.of("Hello"));

        assertTrue(response.isSuccess());
        verify(usageTrackingService).track(eq(request), any(AIResponse.class));
    }

    @Test
    void embed_ShouldRouteAndTrackUsage() {
        when(router.selectProviderForOperation(any(), eq("embed"))).thenReturn(provider);
        when(provider.getProviderType()).thenReturn(AIProviderType.GEMINI);
        when(provider.embed(any())).thenReturn(mockResponse);

        AIResponse response = gateway.embed(request);

        assertTrue(response.isSuccess());
        verify(usageTrackingService).track(eq(request), any(AIResponse.class));
    }

    @Test
    void generate_ShouldThrowOnNullRequest() {
        assertThrows(IllegalArgumentException.class, () -> gateway.generate(null));
    }

    @Test
    void generate_ShouldThrowOnEmptyPromptAndContext() {
        AIRequest emptyRequest = AIRequest.builder().build();
        assertThrows(IllegalArgumentException.class, () -> gateway.generate(emptyRequest));
    }
}
