package com.jobpilotai.backend.application.repository;

import com.jobpilotai.backend.application.domain.ApplicationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationHistoryRepository extends JpaRepository<ApplicationHistory, Long> {
    List<ApplicationHistory> findByApplicationIdOrderByCreatedAtDesc(Long applicationId);
}
