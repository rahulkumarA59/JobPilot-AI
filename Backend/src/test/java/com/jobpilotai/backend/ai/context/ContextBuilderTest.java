package com.jobpilotai.backend.ai.context;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ContextBuilderTest {

    private final ContextBuilder builder = new ContextBuilder();

    @Test
    void buildContext_ShouldCombineAllValidInputs() {
        String profile = "Name: John Doe";
        String resume = "Skills: Java, Spring";
        String job = "Title: Backend Engineer";
        String company = "Company: Tech Corp";
        String appContext = "Status: APPLIED";
        String workflowContext = "Step: RESUME_PARSING";

        String context = builder.buildContext(profile, resume, job, company, appContext, workflowContext);

        assertTrue(context.contains("=== CANDIDATE PROFILE ==="));
        assertTrue(context.contains("Name: John Doe"));
        assertTrue(context.contains("=== RESUME ==="));
        assertTrue(context.contains("Skills: Java, Spring"));
        assertTrue(context.contains("=== JOB LISTING ==="));
        assertTrue(context.contains("Title: Backend Engineer"));
        assertTrue(context.contains("=== COMPANY ==="));
        assertTrue(context.contains("Company: Tech Corp"));
        assertTrue(context.contains("=== APPLICATION CONTEXT ==="));
        assertTrue(context.contains("Status: APPLIED"));
        assertTrue(context.contains("=== WORKFLOW CONTEXT ==="));
        assertTrue(context.contains("Step: RESUME_PARSING"));
    }

    @Test
    void buildContext_ShouldIgnoreNullOrBlankInputs() {
        String profile = "Name: John Doe";
        String resume = "";
        String job = null;
        String company = "  ";

        String context = builder.buildContext(profile, resume, job, company);

        assertTrue(context.contains("=== CANDIDATE PROFILE ==="));
        assertTrue(context.contains("Name: John Doe"));
        assertFalse(context.contains("=== RESUME ==="));
        assertFalse(context.contains("=== JOB LISTING ==="));
        assertFalse(context.contains("=== COMPANY ==="));
    }
}
