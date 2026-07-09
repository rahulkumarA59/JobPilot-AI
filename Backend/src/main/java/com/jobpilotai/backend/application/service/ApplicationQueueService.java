package com.jobpilotai.backend.application.service;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationPriority;
import com.jobpilotai.backend.application.domain.ApplicationStage;
import com.jobpilotai.backend.application.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationQueueService {

    private final ApplicationRepository applicationRepository;

    @Transactional
    public void calculateAndSetPriority(Application application) {
        int score = calculateScore(application);
        application.setScore(score);
        application.setPriority(determinePriorityLevel(score));
        applicationRepository.save(application);
    }

    private int calculateScore(Application application) {
        int score = 0;
        
        // 1. Base AI Match Score (Mocked for V1 Application Engine, usually from recommendation service)
        // If candidate profile and job have specific matches we would add points. 
        // For deterministic V1, we assume a base score.
        score += 50; 
        
        // 2. Application Deadline
        if (application.getJob().getExpiresDate() != null) {
            long daysUntilExpiry = ChronoUnit.DAYS.between(LocalDate.now(), application.getJob().getExpiresDate());
            if (daysUntilExpiry < 3) {
                score += 30; // Urgent
            } else if (daysUntilExpiry < 7) {
                score += 15;
            }
        }
        
        // 3. Job Freshness
        if (application.getJob().getPostedDate() != null) {
            long daysSincePosted = ChronoUnit.DAYS.between(application.getJob().getPostedDate(), LocalDate.now());
            if (daysSincePosted <= 2) {
                score += 20; // Fresh job, apply fast
            }
        }

        // 4. Salary constraints
        if (application.getJob().getSalaryMin() != null && application.getCandidateProfile().getExpectedSalary() != null) {
            if (application.getJob().getSalaryMin() >= application.getCandidateProfile().getExpectedSalary()) {
                score += 15;
            }
        }

        return Math.min(score, 100);
    }

    private ApplicationPriority determinePriorityLevel(int score) {
        if (score >= 80) return ApplicationPriority.CRITICAL;
        if (score >= 60) return ApplicationPriority.HIGH;
        if (score >= 40) return ApplicationPriority.MEDIUM;
        return ApplicationPriority.LOW;
    }

    public List<Application> getNextApplicationsInQueue(int limit) {
        List<Application> queued = applicationRepository.findByStageInOrderByScoreDescPriorityAsc(
                List.of(ApplicationStage.QUEUED, ApplicationStage.READY)
        );
        return queued.stream().limit(limit).toList();
    }
}
