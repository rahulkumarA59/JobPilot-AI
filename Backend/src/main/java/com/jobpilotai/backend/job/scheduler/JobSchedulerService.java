package com.jobpilotai.backend.job.scheduler;

import com.jobpilotai.backend.job.analytics.JobAnalyticsService;
import com.jobpilotai.backend.job.collector.JobCollectionService;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.enums.JobStatus;
import com.jobpilotai.backend.job.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduled tasks for job intelligence maintenance.
 * Runs periodic collection, expiration, and analytics refresh.
 */
@Service
public class JobSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(JobSchedulerService.class);

    private final JobCollectionService collectionService;
    private final JobAnalyticsService analyticsService;
    private final JobRepository jobRepository;

    public JobSchedulerService(JobCollectionService collectionService,
                                JobAnalyticsService analyticsService,
                                JobRepository jobRepository) {
        this.collectionService = collectionService;
        this.analyticsService = analyticsService;
        this.jobRepository = jobRepository;
    }

    /**
     * Collect jobs from all sources — every 6 hours.
     */
    @Scheduled(fixedRateString = "${jobpilot.scheduler.collect-interval-ms:21600000}")
    public void collectJobs() {
        log.info("Scheduled Task: collecting jobs from all sources");
        try {
            collectionService.collectFromAllSources();
        } catch (Exception e) {
            log.error("Scheduled job collection failed: {}", e.getMessage());
        }
    }

    /**
     * Mark expired jobs — every hour.
     */
    @Scheduled(fixedRateString = "${jobpilot.scheduler.expire-interval-ms:3600000}")
    @Transactional
    public void removeExpiredJobs() {
        log.info("Scheduled Task: marking expired jobs");
        try {
            List<Job> allJobs = jobRepository.findAll();
            LocalDate today = LocalDate.now();
            int expired = 0;

            for (Job job : allJobs) {
                if (job.getStatus() == JobStatus.ACTIVE
                        && job.getExpiresDate() != null
                        && job.getExpiresDate().isBefore(today)) {
                    job.setStatus(JobStatus.EXPIRED);
                    jobRepository.save(job);
                    expired++;
                }
            }

            if (expired > 0) {
                log.info("Expired jobs marked: {} jobs set to EXPIRED", expired);
            }
        } catch (Exception e) {
            log.error("Scheduled expiration check failed: {}", e.getMessage());
        }
    }

    /**
     * Refresh analytics — every 2 hours.
     */
    @Scheduled(fixedRateString = "${jobpilot.scheduler.analytics-interval-ms:7200000}")
    public void refreshAnalytics() {
        log.info("Scheduled Task: refreshing analytics");
        try {
            analyticsService.refreshAnalytics();
        } catch (Exception e) {
            log.error("Scheduled analytics refresh failed: {}", e.getMessage());
        }
    }
}
