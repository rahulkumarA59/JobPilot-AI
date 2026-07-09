package com.jobpilotai.backend.orchestrator.repository;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorEvent;
import com.jobpilotai.backend.orchestrator.domain.WorkflowEventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<OrchestratorEvent, Long> {
    List<OrchestratorEvent> findByWorkflowIdOrderByCreatedAtDesc(Long workflowId);
    List<OrchestratorEvent> findByWorkflowIdAndEventType(Long workflowId, WorkflowEventType eventType);
}
