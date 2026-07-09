package com.jobpilotai.backend.ai.usage.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;

import java.math.BigDecimal;
import java.sql.Types;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_usage_logs")
@Getter
@Setter
public class AiUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JdbcTypeCode(Types.VARCHAR)
    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private UUID publicId;

    @Column(name = "provider", nullable = false, length = 50)
    private String provider;

    @Column(name = "model_name", length = 120)
    private String modelName;

    @Column(name = "operation", length = 120)
    private String operation;

    @Column(name = "candidate_profile_id")
    private Long candidateProfileId;

    @Column(name = "workflow_id")
    private Long workflowId;

    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "prompt_type", length = 80)
    private String promptType;

    @Column(name = "estimated_input_tokens")
    private Integer estimatedInputTokens = 0;

    @Column(name = "estimated_output_tokens")
    private Integer estimatedOutputTokens = 0;

    @Column(name = "estimated_total_tokens")
    private Integer estimatedTotalTokens = 0;

    @Column(name = "estimated_cost", precision = 10, scale = 6)
    private BigDecimal estimatedCost = BigDecimal.ZERO;

    @Column(name = "latency_ms")
    private Long latencyMs = 0L;

    @Column(name = "success", nullable = false)
    private Boolean success = true;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    private void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
