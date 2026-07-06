package com.jobpilotai.backend.resume.dto;

import java.time.Instant;
import java.util.UUID;

public record ResumeResponse(
        UUID publicId,
        String originalFilename,
        Long fileSize,
        String mimeType,
        boolean active,
        Instant uploadedAt
) {
}

