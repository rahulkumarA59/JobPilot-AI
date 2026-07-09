package com.jobpilotai.backend.job.collector;

import com.jobpilotai.backend.job.connector.JobConnector;
import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.domain.JobBenefit;
import com.jobpilotai.backend.job.domain.JobSkill;
import com.jobpilotai.backend.job.dto.ConnectorJobResponse;
import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.*;
import com.jobpilotai.backend.job.factory.JobConnectorFactory;
import com.jobpilotai.backend.job.normalizer.JobNormalizer;
import com.jobpilotai.backend.job.repository.JobRepository;
import com.jobpilotai.backend.job.service.CompanyEnrichmentService;
import com.jobpilotai.backend.job.service.DuplicateJobDetector;
import com.jobpilotai.backend.job.validator.JobValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Orchestrates the full job collection pipeline:
 * Fetch → Normalize → Validate → Deduplicate → Enrich Company → Store.
 */
@Service("intelligenceJobCollectionService")
public class JobCollectionService {

    private static final Logger log = LoggerFactory.getLogger(JobCollectionService.class);

    private final JobConnectorFactory connectorFactory;
    private final JobNormalizer normalizer;
    private final JobValidator validator;
    private final DuplicateJobDetector duplicateDetector;
    private final CompanyEnrichmentService companyEnrichmentService;
    private final JobRepository jobRepository;

    public JobCollectionService(JobConnectorFactory connectorFactory,
                                 JobNormalizer normalizer,
                                 JobValidator validator,
                                 DuplicateJobDetector duplicateDetector,
                                 CompanyEnrichmentService companyEnrichmentService,
                                 JobRepository jobRepository) {
        this.connectorFactory = connectorFactory;
        this.normalizer = normalizer;
        this.validator = validator;
        this.duplicateDetector = duplicateDetector;
        this.companyEnrichmentService = companyEnrichmentService;
        this.jobRepository = jobRepository;
    }

    /**
     * Collect jobs from a specific source.
     */
    @Transactional
    public ConnectorJobResponse collectFromSource(JobSource source) {
        long start = System.currentTimeMillis();
        log.info("Connector Started: {}", source.getDisplayName());

        JobConnector connector = connectorFactory.getConnector(source);

        // Fetch
        List<NormalizedJob> rawJobs = connector.fetchJobs();
        log.info("Jobs Collected: {} raw jobs from {}", rawJobs.size(), source.getDisplayName());

        // Normalize
        List<NormalizedJob> normalizedJobs = normalizer.normalizeAll(rawJobs);
        log.info("Jobs Normalized: {} jobs from {}", normalizedJobs.size(), source.getDisplayName());

        // Process
        int saved = 0;
        int duplicates = 0;
        int validationFailures = 0;

        for (NormalizedJob job : normalizedJobs) {
            try {
                // Validate
                if (!validator.isValid(job)) {
                    validationFailures++;
                    continue;
                }

                // Duplicate check
                if (duplicateDetector.isDuplicate(job)) {
                    duplicates++;
                    continue;
                }

                // Persist
                storeJob(job);
                saved++;

            } catch (Exception e) {
                log.error("Error processing job {} from {}: {}", job.getExternalJobId(), source, e.getMessage());
            }
        }

        long elapsed = System.currentTimeMillis() - start;
        log.info("Connector Finished: {} — saved={}, duplicates={}, validationFailures={}, elapsed={}ms",
                source.getDisplayName(), saved, duplicates, validationFailures, elapsed);
        log.info("Jobs Saved: {} new jobs from {}", saved, source.getDisplayName());

        return ConnectorJobResponse.builder()
                .source(source.name())
                .jobsFetched(rawJobs.size())
                .jobsSaved(saved)
                .duplicatesSkipped(duplicates)
                .validationFailures(validationFailures)
                .connectorHealthy(connector.health())
                .executionTimeMs(elapsed)
                .executedAt(Instant.now())
                .build();
    }

    /**
     * Collect jobs from ALL sources.
     */
    public List<ConnectorJobResponse> collectFromAllSources() {
        log.info("Starting job collection from all sources");
        List<ConnectorJobResponse> results = new ArrayList<>();

        for (JobConnector connector : connectorFactory.getHealthyConnectors()) {
            try {
                ConnectorJobResponse result = collectFromSource(connector.getSource());
                results.add(result);
            } catch (Exception e) {
                log.error("Error collecting from {}: {}", connector.getSource().getDisplayName(), e.getMessage());
                results.add(ConnectorJobResponse.builder()
                        .source(connector.getSource().name())
                        .jobsFetched(0).jobsSaved(0).duplicatesSkipped(0).validationFailures(0)
                        .connectorHealthy(false)
                        .executionTimeMs(0)
                        .executedAt(Instant.now())
                        .build());
            }
        }

        int totalSaved = results.stream().mapToInt(ConnectorJobResponse::getJobsSaved).sum();
        int totalDuplicates = results.stream().mapToInt(ConnectorJobResponse::getDuplicatesSkipped).sum();
        log.info("Job collection complete: {} total saved, {} total duplicates across {} sources",
                totalSaved, totalDuplicates, results.size());

        return results;
    }

    // ── Private helpers ──────────────────────────────────────

    private void storeJob(NormalizedJob normalizedJob) {
        // Enrich and resolve company
        Company company = companyEnrichmentService.enrichAndResolve(normalizedJob);

        // Build Job entity
        Job job = new Job();
        job.setSource(JobSource.valueOf(normalizedJob.getSource()));
        job.setExternalJobId(normalizedJob.getExternalJobId());
        job.setTitle(normalizedJob.getTitle());
        job.setDescription(normalizedJob.getDescription());
        job.setCompany(company);
        job.setLocation(normalizedJob.getLocation());
        job.setStatus(JobStatus.ACTIVE);
        job.setChecksum(duplicateDetector.calculateChecksum(normalizedJob));

        // Set enums safely
        if (normalizedJob.getRemoteType() != null) {
            try { job.setRemoteType(RemoteType.valueOf(normalizedJob.getRemoteType())); }
            catch (IllegalArgumentException ignored) {}
        }
        if (normalizedJob.getEmploymentType() != null) {
            try { job.setEmploymentType(EmploymentType.valueOf(normalizedJob.getEmploymentType())); }
            catch (IllegalArgumentException ignored) {}
        }

        job.setExperienceLevel(normalizedJob.getExperienceLevel());
        job.setSalaryMin(normalizedJob.getSalaryMin());
        job.setSalaryMax(normalizedJob.getSalaryMax());
        job.setCurrency(normalizedJob.getCurrency());
        job.setApplyUrl(normalizedJob.getApplyUrl());
        job.setJobUrl(normalizedJob.getJobUrl());
        job.setPostedDate(normalizedJob.getPostedDate());
        job.setExpiresDate(normalizedJob.getExpiresDate());

        // Attach skills
        if (normalizedJob.getSkills() != null) {
            int priority = 0;
            for (String skillName : normalizedJob.getSkills()) {
                JobSkill skill = new JobSkill();
                skill.setJob(job);
                skill.setSkillName(skillName);
                skill.setCategory("Technical");
                skill.setRequired(true);
                skill.setPriority(priority++);
                job.getSkills().add(skill);
            }
        }

        // Attach benefits
        if (normalizedJob.getBenefits() != null) {
            for (String b : normalizedJob.getBenefits()) {
                JobBenefit benefit = new JobBenefit();
                benefit.setJob(job);
                benefit.setBenefit(b);
                job.getBenefits().add(benefit);
            }
        }

        job = jobRepository.save(job);
        log.info("Job Created: {} at {} (publicId={})", job.getTitle(), company.getName(), job.getPublicId());
    }
}
