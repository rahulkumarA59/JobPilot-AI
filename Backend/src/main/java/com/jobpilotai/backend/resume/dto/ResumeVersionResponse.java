package com.jobpilotai.backend.resume.dto;

import com.jobpilotai.backend.resumeversion.domain.ResumeVersionSource;
import com.jobpilotai.backend.resumeversion.domain.ResumeVersionStatus;

import java.time.Instant;

public record ResumeVersionResponse(
        Integer versionNumber,
        String versionName,
        ResumeVersionSource source,
        ResumeVersionStatus status,
        Instant createdAt
) {
}

