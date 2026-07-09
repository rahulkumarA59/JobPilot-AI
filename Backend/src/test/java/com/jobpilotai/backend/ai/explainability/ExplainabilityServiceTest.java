package com.jobpilotai.backend.ai.explainability;

import com.jobpilotai.backend.ai.dto.ExplainabilityReport;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ExplainabilityServiceTest {

    private ExplainabilityService service;

    @BeforeEach
    void setUp() {
        service = new ExplainabilityService();
    }

    @Test
    void generateMatchExplanation() {
        ExplainabilityReport report = service.generateMatchExplanation(List.of("Java", "Spring"), "Skills");
        assertEquals("Matched because you know Java, Spring.", report.getReason());
        assertEquals("Positive", report.getImpact());
        assertEquals("Skills", report.getCategory());
    }

    @Test
    void generateMissingSkillExplanation() {
        ExplainabilityReport report = service.generateMissingSkillExplanation(List.of("AWS"), "Skills");
        assertEquals("Missing AWS.", report.getReason());
        assertEquals("Negative", report.getImpact());
    }

    @Test
    void generateAtsIncreaseExplanation() {
        ExplainabilityReport report = service.generateAtsIncreaseExplanation(12, "ATS");
        assertEquals("Resume ATS score increased by 12 points.", report.getReason());
        assertEquals("Positive", report.getImpact());
    }

    @Test
    void generateExperienceExplanation() {
        ExplainabilityReport report = service.generateExperienceExplanation(3, "Experience");
        assertEquals("Company prefers 3+ years experience.", report.getReason());
        assertEquals("Neutral", report.getImpact());
    }
}
