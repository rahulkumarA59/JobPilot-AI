package com.jobpilotai.backend.orchestrator.repository;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.domain.WorkflowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkflowRepository extends JpaRepository<OrchestratorWorkflow, Long> {
    Optional<OrchestratorWorkflow> findByPublicId(UUID publicId);
    List<OrchestratorWorkflow> findByStatus(WorkflowStatus status);
    List<OrchestratorWorkflow> findByCandidateProfileIdAndStatusIn(Long candidateProfileId, List<WorkflowStatus> statuses);
    boolean existsByCandidateProfileIdAndStatusIn(Long candidateProfileId, List<WorkflowStatus> statuses);
}
