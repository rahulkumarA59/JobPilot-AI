package com.jobpilotai.backend.ai.usage;

import com.jobpilotai.backend.ai.gateway.dto.AIRequest;
import com.jobpilotai.backend.ai.gateway.dto.AIResponse;
import com.jobpilotai.backend.ai.usage.domain.AiUsageLog;
import com.jobpilotai.backend.ai.usage.repository.AiUsageLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsageTrackingService {

    private final AiUsageLogRepository repository;

    @Transactional
    public void track(AIRequest request, AIResponse response) {
        AiUsageLog usageLog = new AiUsageLog();
        usageLog.setProvider(response.getProvider().name());
        usageLog.setModelName(response.getModelName());
        usageLog.setOperation(request.getOperation());
        usageLog.setCandidateProfileId(request.getCandidateProfileId());
        usageLog.setWorkflowId(request.getWorkflowId());
        usageLog.setApplicationId(request.getApplicationId());
        usageLog.setPromptType(request.getPromptType() != null ? request.getPromptType().name() : null);
        usageLog.setEstimatedInputTokens(response.getEstimatedInputTokens());
        usageLog.setEstimatedOutputTokens(response.getEstimatedOutputTokens());
        usageLog.setEstimatedTotalTokens(response.getEstimatedTotalTokens());
        usageLog.setEstimatedCost(estimateCost(response));
        usageLog.setLatencyMs(response.getLatencyMs());
        usageLog.setSuccess(response.isSuccess());
        usageLog.setErrorMessage(response.getErrorMessage());

        repository.save(usageLog);

        log.info("AI Usage tracked: provider={}, model={}, tokens={}, latency={}ms, success={}",
                response.getProvider(), response.getModelName(),
                response.getEstimatedTotalTokens(), response.getLatencyMs(), response.isSuccess());
    }

    private BigDecimal estimateCost(AIResponse response) {
        // Estimated cost per 1K tokens (mock estimates for V1)
        double costPer1kInput;
        double costPer1kOutput;

        switch (response.getProvider()) {
            case GEMINI -> { costPer1kInput = 0.000075; costPer1kOutput = 0.0003; }
            case OPENAI -> { costPer1kInput = 0.0025; costPer1kOutput = 0.01; }
            case CLAUDE -> { costPer1kInput = 0.003; costPer1kOutput = 0.015; }
            default -> { costPer1kInput = 0.001; costPer1kOutput = 0.005; }
        }

        double inputCost = (response.getEstimatedInputTokens() / 1000.0) * costPer1kInput;
        double outputCost = (response.getEstimatedOutputTokens() / 1000.0) * costPer1kOutput;

        return BigDecimal.valueOf(inputCost + outputCost);
    }
}
