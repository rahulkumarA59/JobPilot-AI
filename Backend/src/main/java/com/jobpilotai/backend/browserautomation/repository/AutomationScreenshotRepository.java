package com.jobpilotai.backend.browserautomation.repository;

import com.jobpilotai.backend.browserautomation.domain.AutomationScreenshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutomationScreenshotRepository extends JpaRepository<AutomationScreenshot, Long> {
    List<AutomationScreenshot> findByExecutionId(Long executionId);
}
