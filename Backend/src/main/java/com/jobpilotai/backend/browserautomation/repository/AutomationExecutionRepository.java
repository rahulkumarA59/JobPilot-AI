package com.jobpilotai.backend.browserautomation.repository;

import com.jobpilotai.backend.browserautomation.domain.AutomationExecution;
import com.jobpilotai.backend.browserautomation.domain.AutomationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AutomationExecutionRepository extends JpaRepository<AutomationExecution, Long> {
    Optional<AutomationExecution> findByPublicId(UUID publicId);
    List<AutomationExecution> findByStatus(AutomationStatus status);
    Optional<AutomationExecution> findByApplicationId(Long applicationId);
}
