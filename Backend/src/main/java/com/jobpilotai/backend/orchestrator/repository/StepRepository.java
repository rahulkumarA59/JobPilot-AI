package com.jobpilotai.backend.orchestrator.repository;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorStep;
import com.jobpilotai.backend.orchestrator.domain.StepStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StepRepository extends JpaRepository<OrchestratorStep, Long> {
    List<OrchestratorStep> findByWorkflowIdOrderByStepOrderAsc(Long workflowId);
    Optional<OrchestratorStep> findByWorkflowIdAndStepName(Long workflowId, String stepName);
    List<OrchestratorStep> findByWorkflowIdAndStatus(Long workflowId, StepStatus status);
}
