package com.jobpilotai.backend.ai.gateway.dto;

import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import com.jobpilotai.backend.ai.gateway.domain.PromptType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AIRequest {
    private final String prompt;
    private final PromptType promptType;
    private final AIProviderType preferredProvider;
    private final String operation;
    private final Long candidateProfileId;
    private final Long workflowId;
    private final Long applicationId;
    private final String context;
}
