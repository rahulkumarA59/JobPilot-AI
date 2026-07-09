package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CoverLetterTemplate {
    private String type; // INTERNSHIP, ENTRY_LEVEL, EXPERIENCED, SENIOR, REMOTE, ONSITE
    private String content; // The text content with placeholders
    private String tone; // Professional, Enthusiastic, etc.
}
