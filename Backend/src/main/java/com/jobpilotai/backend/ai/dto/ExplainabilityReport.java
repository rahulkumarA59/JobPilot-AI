package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExplainabilityReport {
    private String reason;
    private String impact;
    private String category;
}
