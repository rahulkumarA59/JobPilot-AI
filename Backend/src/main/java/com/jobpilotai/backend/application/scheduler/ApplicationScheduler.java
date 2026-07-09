package com.jobpilotai.backend.application.scheduler;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationStage;
import com.jobpilotai.backend.application.repository.ApplicationRepository;
import com.jobpilotai.backend.application.service.ApplicationQueueService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ApplicationScheduler {

    private final ApplicationRepository applicationRepository;
    private final ApplicationQueueService queueService;

    /**
     * Periodically recalculate priorities for all QUEUED or READY applications.
     * Runs every hour.
     */
    @Scheduled(fixedRateString = "3600000") // 1 hour
    public void recalculateQueuePriorities() {
        log.info("Starting scheduled priority recalculation for queued applications...");
        List<Application> activeApps = applicationRepository.findByStageInOrderByScoreDescPriorityAsc(
                List.of(ApplicationStage.QUEUED, ApplicationStage.READY)
        );

        int updatedCount = 0;
        for (Application app : activeApps) {
            try {
                queueService.calculateAndSetPriority(app);
                updatedCount++;
            } catch (Exception e) {
                log.error("Failed to recalculate priority for application {}", app.getPublicId(), e);
            }
        }
        log.info("Finished priority recalculation. Updated {} applications.", updatedCount);
    }

    /**
     * Stale Application Cleanup
     * If an application has been in APPLYING state for more than 2 hours, it's considered stuck/failed.
     */
    @Scheduled(fixedRateString = "7200000") // 2 hours
    public void cleanupStaleApplications() {
        log.info("Starting cleanup for stale APPLYING applications...");
        Instant twoHoursAgo = Instant.now().minus(2, ChronoUnit.HOURS);
        
        List<Application> staleApps = applicationRepository.findByStageAndLastUpdatedBefore(
                ApplicationStage.APPLYING, twoHoursAgo
        );

        for (Application app : staleApps) {
            app.setStage(ApplicationStage.FAILED);
            applicationRepository.save(app);
            log.warn("Application {} was stuck in APPLYING. Marked as FAILED.", app.getPublicId());
        }
    }
}
