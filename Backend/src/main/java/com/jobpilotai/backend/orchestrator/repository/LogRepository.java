package com.jobpilotai.backend.orchestrator.repository;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<OrchestratorLog, Long> {
    List<OrchestratorLog> findByWorkflowIdOrderByCreatedAtDesc(Long workflowId);
    List<OrchestratorLog> findByWorkflowIdAndStepName(Long workflowId, String stepName);
}
