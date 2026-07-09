package com.jobpilotai.backend.ai.usage.repository;

import com.jobpilotai.backend.ai.usage.domain.AiUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.Optional;
import java.util.List;

@Repository
public interface AiUsageLogRepository extends JpaRepository<AiUsageLog, Long> {
    Optional<AiUsageLog> findByPublicId(UUID publicId);
    List<AiUsageLog> findByCandidateProfileIdOrderByCreatedAtDesc(Long candidateProfileId);
    List<AiUsageLog> findByWorkflowIdOrderByCreatedAtDesc(Long workflowId);
}
