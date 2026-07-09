package com.jobpilotai.backend.ai.gateway;

import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.dto.AIRequest;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;
import com.jobpilotai.backend.ai.router.AIRouter;
import com.jobpilotai.backend.ai.usage.UsageTrackingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIGatewayImpl implements AIGateway {

    private final AIRouter router;
    private final UsageTrackingService usageTrackingService;

    @Override
    public AIResponse generate(AIRequest request) {
        validateRequest(request);
        long start = System.currentTimeMillis();

        try {
            AIProvider provider = router.selectProviderForOperation(request.getPreferredProvider(), "generate");
            log.info("AIGateway generate: provider={}, promptType={}", provider.getProviderType(), request.getPromptType());

            String fullPrompt = buildFullPrompt(request);
            AIResponse response = provider.generate(fullPrompt);

            long latency = System.currentTimeMillis() - start;
            AIResponse enriched = enrichResponse(response, latency);
            usageTrackingService.track(request, enriched);

            log.info("AIGateway generate completed: provider={}, latency={}ms, success={}",
                    enriched.getProvider(), latency, enriched.isSuccess());
            return enriched;

        } catch (Exception e) {
            long latency = System.currentTimeMillis() - start;
            log.error("AIGateway generate failed: latency={}ms, error={}", latency, e.getMessage());
            AIResponse errorResponse = buildErrorResponse(latency, e.getMessage());
            usageTrackingService.track(request, errorResponse);
            return errorResponse;
        }
    }

    @Override
    public AIResponse chat(AIRequest request, List<String> messages) {
        validateRequest(request);
        long start = System.currentTimeMillis();

        try {
            AIProvider provider = router.selectProviderForOperation(request.getPreferredProvider(), "chat");
            log.info("AIGateway chat: provider={}, messages={}", provider.getProviderType(), messages.size());

            AIResponse response = provider.chat(messages);

            long latency = System.currentTimeMillis() - start;
            AIResponse enriched = enrichResponse(response, latency);
            usageTrackingService.track(request, enriched);

            log.info("AIGateway chat completed: provider={}, latency={}ms", enriched.getProvider(), latency);
            return enriched;

        } catch (Exception e) {
            long latency = System.currentTimeMillis() - start;
            log.error("AIGateway chat failed: latency={}ms, error={}", latency, e.getMessage());
            AIResponse errorResponse = buildErrorResponse(latency, e.getMessage());
            usageTrackingService.track(request, errorResponse);
            return errorResponse;
        }
    }

    @Override
    public AIResponse embed(AIRequest request) {
        validateRequest(request);
        long start = System.currentTimeMillis();

        try {
            AIProvider provider = router.selectProviderForOperation(request.getPreferredProvider(), "embed");
            log.info("AIGateway embed: provider={}", provider.getProviderType());

            String fullPrompt = buildFullPrompt(request);
            AIResponse response = provider.embed(fullPrompt);

            long latency = System.currentTimeMillis() - start;
            AIResponse enriched = enrichResponse(response, latency);
            usageTrackingService.track(request, enriched);

            log.info("AIGateway embed completed: provider={}, latency={}ms", enriched.getProvider(), latency);
            return enriched;

        } catch (Exception e) {
            long latency = System.currentTimeMillis() - start;
            log.error("AIGateway embed failed: latency={}ms, error={}", latency, e.getMessage());
            AIResponse errorResponse = buildErrorResponse(latency, e.getMessage());
            usageTrackingService.track(request, errorResponse);
            return errorResponse;
        }
    }

    private void validateRequest(AIRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("AIRequest cannot be null");
        }
        if (request.getPrompt() == null && request.getContext() == null) {
            throw new IllegalArgumentException("AIRequest must have a prompt or context");
        }
    }

    private String buildFullPrompt(AIRequest request) {
        StringBuilder sb = new StringBuilder();
        if (request.getContext() != null && !request.getContext().isBlank()) {
            sb.append(request.getContext()).append("\n\n");
        }
        if (request.getPrompt() != null && !request.getPrompt().isBlank()) {
            sb.append(request.getPrompt());
        }
        return sb.toString().trim();
    }

    private AIResponse enrichResponse(AIResponse response, long latency) {
        return AIResponse.builder()
                .content(response.getContent())
                .provider(response.getProvider())
                .modelName(response.getModelName())
                .success(response.isSuccess())
                .errorMessage(response.getErrorMessage())
                .estimatedInputTokens(response.getEstimatedInputTokens())
                .estimatedOutputTokens(response.getEstimatedOutputTokens())
                .estimatedTotalTokens(response.getEstimatedTotalTokens())
                .latencyMs(latency)
                .mock(response.isMock())
                .build();
    }

    private AIResponse buildErrorResponse(long latency, String errorMessage) {
        return AIResponse.builder()
                .content("")
                .provider(AIProviderType.GEMINI)
                .modelName("unknown")
                .success(false)
                .errorMessage(errorMessage)
                .estimatedInputTokens(0)
                .estimatedOutputTokens(0)
                .estimatedTotalTokens(0)
                .latencyMs(latency)
                .mock(false)
                .build();
    }
}
