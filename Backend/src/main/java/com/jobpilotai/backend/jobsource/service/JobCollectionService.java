package com.jobpilotai.backend.jobsource.service;

import com.jobpilotai.backend.jobsource.connector.JobConnector;
import com.jobpilotai.backend.jobsource.connector.JobConnectorFactory;
import com.jobpilotai.backend.jobsource.domain.JobCompany;
import com.jobpilotai.backend.jobsource.domain.JobPosting;
import com.jobpilotai.backend.jobsource.domain.JobSource;
import com.jobpilotai.backend.jobsource.dto.NormalizedJob;
import com.jobpilotai.backend.jobsource.repository.JobCompanyRepository;
import com.jobpilotai.backend.jobsource.repository.JobPostingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for collecting jobs from multiple sources.
 * Orchestrates fetching, normalization, deduplication, and storage.
 */
@Service
public class JobCollectionService {

    private static final Logger log = LoggerFactory.getLogger(JobCollectionService.class);

    private final JobConnectorFactory connectorFactory;
    private final JobPostingRepository jobPostingRepository;
    private final JobCompanyRepository jobCompanyRepository;

    public JobCollectionService(JobConnectorFactory connectorFactory,
                                JobPostingRepository jobPostingRepository,
                                JobCompanyRepository jobCompanyRepository) {
        this.connectorFactory = connectorFactory;
        this.jobPostingRepository = jobPostingRepository;
        this.jobCompanyRepository = jobCompanyRepository;
    }

    /**
     * Collect jobs from a single source, normalize, deduplicate, and store.
     */
    @Transactional
    public void collectFromSource(JobSource source) {
        log.info("Job Source Started: {}", source.getDisplayName());

        JobConnector connector = connectorFactory.getConnector(source);
        List<?> rawJobs = connector.fetchJobs();
        log.info("Jobs Retrieved: {} jobs fetched from {}", rawJobs.size(), source.getDisplayName());

        // Normalize jobs
        List<NormalizedJob> normalizedJobs = rawJobs.stream()
                .map(connector::normalize)
                .collect(Collectors.toList());
        log.info("Jobs Normalized: {} jobs normalized from {}", normalizedJobs.size(), source.getDisplayName());

        // Remove duplicates and store
        int stored = 0;
        int duplicates = 0;

        for (NormalizedJob normalizedJob : normalizedJobs) {
            try {
                // Calculate checksum
                String checksum = calculateChecksum(normalizedJob);

                // Check for existing job by checksum
                if (jobPostingRepository.findByChecksum(checksum).isPresent()) {
                    duplicates++;
                    log.debug("Duplicate Resume Detected: {}", normalizedJob.getExternalJobId());
                    continue;
                }

                // Store job
                JobPosting jobPosting = storeJob(normalizedJob, checksum);
                stored++;
                log.info("Job stored: {} ({})", jobPosting.getTitle(), jobPosting.getPublicId());

            } catch (Exception e) {
                log.error("Error storing job {}: {}", normalizedJob.getExternalJobId(), e.getMessage());
            }
        }

        if (duplicates > 0) {
            log.info("Duplicates Removed: {} duplicate jobs found and skipped", duplicates);
        }
        log.info("Jobs Stored: {} new jobs stored from {}", stored, source.getDisplayName());
    }

    /**
     * Collect jobs from all sources.
     */
    @Transactional
    public void collectFromAllSources() {
        log.info("Starting job collection from all sources");
        for (JobSource source : JobSource.values()) {
            try {
                collectFromSource(source);
            } catch (Exception e) {
                log.error("Error collecting jobs from {}: {}", source.getDisplayName(), e.getMessage());
            }
        }
        log.info("Job collection completed for all sources");
    }

    /**
     * Store a normalized job to the database.
     * Creates or retrieves company, then creates job posting.
     */
    private JobPosting storeJob(NormalizedJob normalizedJob, String checksum) {
        // Get or create company
        JobCompany company = getOrCreateCompany(normalizedJob);

        // Create job posting
        JobPosting jobPosting = new JobPosting();
        jobPosting.setSource(JobSource.valueOf(normalizedJob.getSource()));
        jobPosting.setExternalJobId(normalizedJob.getExternalJobId());
        jobPosting.setCompany(company);
        jobPosting.setCompanyName(normalizedJob.getCompanyName());
        jobPosting.setTitle(normalizedJob.getTitle());
        jobPosting.setDescription(normalizedJob.getDescription());
        jobPosting.setLocation(normalizedJob.getLocation());

        if (normalizedJob.getRemoteType() != null) {
            jobPosting.setRemoteType(
                    com.jobpilotai.backend.jobsource.domain.RemoteType.valueOf(normalizedJob.getRemoteType())
            );
        }

        if (normalizedJob.getEmploymentType() != null) {
            jobPosting.setEmploymentType(
                    com.jobpilotai.backend.jobsource.domain.EmploymentType.valueOf(normalizedJob.getEmploymentType())
            );
        }

        jobPosting.setExperienceLevel(normalizedJob.getExperienceLevel());
        jobPosting.setSalaryMin(normalizedJob.getSalaryMin());
        jobPosting.setSalaryMax(normalizedJob.getSalaryMax());
        jobPosting.setCurrency(normalizedJob.getCurrency());
        jobPosting.setSkills(normalizedJob.getSkills() != null ? String.join(",", normalizedJob.getSkills()) : "");
        jobPosting.setResponsibilities(normalizedJob.getResponsibilities());
        jobPosting.setQualifications(normalizedJob.getQualifications());
        jobPosting.setBenefits(normalizedJob.getBenefits());
        jobPosting.setApplyUrl(normalizedJob.getApplyUrl());
        jobPosting.setJobUrl(normalizedJob.getJobUrl());
        jobPosting.setPostedDate(normalizedJob.getPostedDate());
        jobPosting.setExpiresDate(normalizedJob.getExpiresDate());
        jobPosting.setChecksum(checksum);
        jobPosting.setActive(true);

        return jobPostingRepository.save(jobPosting);
    }

    /**
     * Get or create a company based on normalized job data.
     */
    private JobCompany getOrCreateCompany(NormalizedJob normalizedJob) {
        // Try to find by name (case-insensitive)
        Optional<JobCompany> existing = jobCompanyRepository.findByNameIgnoreCase(normalizedJob.getCompanyName());
        if (existing.isPresent()) {
            return existing.get();
        }

        // Create new company
        JobCompany company = new JobCompany();
        company.setName(normalizedJob.getCompanyName());
        company.setWebsite(normalizedJob.getCompanyWebsite());
        company.setIndustry(normalizedJob.getCompanyIndustry());
        company.setHeadquarters(normalizedJob.getCompanyHeadquarters());
        company.setCompanySize(normalizedJob.getCompanySize());
        company.setLogoUrl(normalizedJob.getCompanyLogoUrl());

        return jobCompanyRepository.save(company);
    }

    /**
     * Calculate SHA-256 checksum for a normalized job.
     * Used for duplicate detection.
     */
    private String calculateChecksum(NormalizedJob job) {
        try {
            String content = job.getSource() +
                    "|" + job.getExternalJobId() +
                    "|" + job.getCompanyName() +
                    "|" + job.getTitle() +
                    "|" + job.getLocation();

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(content.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
