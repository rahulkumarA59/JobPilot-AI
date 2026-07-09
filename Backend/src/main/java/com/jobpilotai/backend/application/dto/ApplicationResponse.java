package com.jobpilotai.backend.application.dto;

import com.jobpilotai.backend.application.domain.ApplicationPriority;
import com.jobpilotai.backend.application.domain.ApplicationStage;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class ApplicationResponse {
    private UUID publicId;
    private Long candidateProfileId;
    private Long jobId;
    private Long companyId;
    private String coverLetterReference;
    private ApplicationStage stage;
    private ApplicationPriority priority;
    private Integer score;
    private String source;
    private Instant appliedAt;
    private Instant nextActionAt;
    private Instant lastUpdated;
    private Instant createdAt;
}
