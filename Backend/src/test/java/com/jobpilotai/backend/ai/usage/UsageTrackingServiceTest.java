package com.jobpilotai.backend.ai.usage;

import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.domain.PromptType;
import com.jobpilotai.backend.ai.gateway.dto.AIRequest;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;
import com.jobpilotai.backend.ai.usage.domain.AiUsageLog;
import com.jobpilotai.backend.ai.usage.repository.AiUsageLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UsageTrackingServiceTest {

    @Mock
    private AiUsageLogRepository repository;

    @InjectMocks
    private UsageTrackingService service;

    @Test
    void track_ShouldSaveUsageLogWithEstimatedCost() {
        AIRequest request = AIRequest.builder()
                .operation("generate")
                .candidateProfileId(1L)
                .workflowId(2L)
                .applicationId(3L)
                .promptType(PromptType.RESUME_TAILORING)
                .build();

        AIResponse response = AIResponse.builder()
                .provider(AIProviderType.OPENAI)
                .modelName("gpt-4o")
                .estimatedInputTokens(1000)
                .estimatedOutputTokens(500)
                .estimatedTotalTokens(1500)
                .latencyMs(1200)
                .success(true)
                .build();

        service.track(request, response);

        ArgumentCaptor<AiUsageLog> captor = ArgumentCaptor.forClass(AiUsageLog.class);
        verify(repository).save(captor.capture());

        AiUsageLog saved = captor.getValue();
        assertEquals("OPENAI", saved.getProvider());
        assertEquals("gpt-4o", saved.getModelName());
        assertEquals("generate", saved.getOperation());
        assertEquals(1L, saved.getCandidateProfileId());
        assertEquals(2L, saved.getWorkflowId());
        assertEquals(3L, saved.getApplicationId());
        assertEquals("RESUME_TAILORING", saved.getPromptType());
        assertEquals(1000, saved.getEstimatedInputTokens());
        assertEquals(500, saved.getEstimatedOutputTokens());
        assertEquals(1500, saved.getEstimatedTotalTokens());
        assertEquals(1200L, saved.getLatencyMs());
        assertEquals(true, saved.getSuccess());

        // OpenAI: 0.0025 per 1k input + 0.01 per 1k output
        // Input: (1000/1000) * 0.0025 = 0.0025
        // Output: (500/1000) * 0.01 = 0.0050
        // Total cost: 0.0075
        assertEquals(0, BigDecimal.valueOf(0.0075).compareTo(saved.getEstimatedCost()));
    }
}
