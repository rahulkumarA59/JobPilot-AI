package com.jobpilotai.backend.ai.gateway.domain;

public enum AIProviderType {
    GEMINI("Gemini"),
    OPENAI("OpenAI"),
    CLAUDE("Claude");

    private final String displayName;

    AIProviderType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
    
    public static AIProviderType fromString(String text) {
        for (AIProviderType b : AIProviderType.values()) {
            if (b.name().equalsIgnoreCase(text)) {
                return b;
            }
        }
        return null;
    }
}
