package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TailoredResumeSuggestion {
    private List<String> missingKeywords;
    private List<String> recommendedKeywords;
    private double keywordDensity; // e.g. 0.05 for 5%
    private List<String> sectionImprovements;
    private List<String> bulletPointSuggestions;
    private List<String> atsOptimizationTips;
}
