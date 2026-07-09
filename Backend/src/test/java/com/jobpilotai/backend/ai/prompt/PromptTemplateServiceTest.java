package com.jobpilotai.backend.ai.prompt;

import com.jobpilotai.backend.ai.gateway.domain.PromptType;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class PromptTemplateServiceTest {

    private final PromptTemplateService service = new PromptTemplateService();

    @Test
    void getTemplate_ShouldReturnTemplateForAllTypes() {
        for (PromptType type : PromptType.values()) {
            String template = service.getTemplate(type);
            assertNotNull(template);
            assertFalse(template.isBlank());
        }
    }

    @Test
    void buildPrompt_ShouldReplaceVariables() {
        Map<String, String> vars = Map.of(
                "resume", "My resume content",
                "jobDescription", "Senior Java Developer",
                "companyName", "Google"
        );

        String prompt = service.buildPrompt(PromptType.RESUME_TAILORING, vars);

        assertTrue(prompt.contains("My resume content"));
        assertTrue(prompt.contains("Senior Java Developer"));
        assertTrue(prompt.contains("Google"));
        assertFalse(prompt.contains("{{resume}}"));
        assertFalse(prompt.contains("{{jobDescription}}"));
        assertFalse(prompt.contains("{{companyName}}"));
    }

    @Test
    void buildPrompt_ShouldHandleNullVariableValues() {
        Map<String, String> vars = Map.of(
                "candidateName", "John Doe",
                "resumeSummary", "Software Engineer"
        );

        String prompt = service.buildPrompt(PromptType.COVER_LETTER, vars);

        assertTrue(prompt.contains("John Doe"));
        assertTrue(prompt.contains("Software Engineer"));
    }

    @Test
    void buildPrompt_ShouldHandleCoverLetter() {
        Map<String, String> vars = Map.of(
                "candidateName", "Jane Smith",
                "resumeSummary", "5 years experience",
                "jobTitle", "Staff Engineer",
                "companyName", "Meta",
                "jobDescription", "Build distributed systems"
        );

        String prompt = service.buildPrompt(PromptType.COVER_LETTER, vars);

        assertTrue(prompt.contains("Jane Smith"));
        assertTrue(prompt.contains("Staff Engineer"));
        assertTrue(prompt.contains("Meta"));
    }
}
