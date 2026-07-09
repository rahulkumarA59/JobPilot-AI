package com.jobpilotai.backend.job.service;

import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.domain.JobBenefit;
import com.jobpilotai.backend.job.domain.JobSkill;
import com.jobpilotai.backend.job.dto.JobResponse;
import com.jobpilotai.backend.job.enums.*;
import com.jobpilotai.backend.job.mapper.JobMapper;
import com.jobpilotai.backend.job.repository.JobRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * CRUD service for Job entities.
 * Handles job creation with duplicate detection (externalJobId + checksum).
 */
@Service
public class JobService {

    private static final Logger log = LoggerFactory.getLogger(JobService.class);

    private final JobRepository jobRepository;
    private final CompanyService companyService;
    private final JobMapper jobMapper;

    public JobService(JobRepository jobRepository,
                      CompanyService companyService,
                      JobMapper jobMapper) {
        this.jobRepository = jobRepository;
        this.companyService = companyService;
        this.jobMapper = jobMapper;
    }

    /**
     * Create a new job.
     * Performs duplicate detection by externalJobId and checksum.
     * Returns null if the job is a duplicate.
     */
    @Transactional
    public JobResponse createJob(JobSource source, String externalJobId, String title, String description,
                                  String companyName, String companyWebsite, String companyLogoUrl,
                                  String companyIndustry, String companyHeadquarters, String companySize,
                                  String companyDescription,
                                  String location, RemoteType remoteType, EmploymentType employmentType,
                                  String experienceLevel, Long salaryMin, Long salaryMax, String currency,
                                  String applyUrl, String jobUrl, LocalDate postedDate, LocalDate expiresDate,
                                  List<SkillInput> skillInputs, List<String> benefitInputs) {

        // ── Duplicate detection: externalJobId ──
        if (jobRepository.existsBySourceAndExternalJobId(source, externalJobId)) {
            log.info("Duplicate Job: source={}, externalJobId={} — already exists", source, externalJobId);
            return null;
        }

        // ── Duplicate detection: checksum ──
        String checksum = calculateChecksum(source.name(), externalJobId, companyName, title, location);
        if (jobRepository.existsByChecksum(checksum)) {
            log.info("Duplicate Job: checksum={} — already exists", checksum);
            return null;
        }

        // ── Get or create company (deduplication) ──
        Company company = companyService.getOrCreate(
                companyName, companyWebsite, companyLogoUrl,
                companyIndustry, companyHeadquarters, companySize, companyDescription);

        // ── Build Job entity ──
        Job job = new Job();
        job.setSource(source);
        job.setExternalJobId(externalJobId);
        job.setTitle(title);
        job.setDescription(description);
        job.setCompany(company);
        job.setLocation(location);
        job.setRemoteType(remoteType);
        job.setEmploymentType(employmentType);
        job.setExperienceLevel(experienceLevel);
        job.setSalaryMin(salaryMin);
        job.setSalaryMax(salaryMax);
        job.setCurrency(currency);
        job.setApplyUrl(applyUrl);
        job.setJobUrl(jobUrl);
        job.setPostedDate(postedDate);
        job.setExpiresDate(expiresDate);
        job.setStatus(JobStatus.ACTIVE);
        job.setChecksum(checksum);

        // ── Attach skills ──
        if (skillInputs != null) {
            for (SkillInput si : skillInputs) {
                JobSkill skill = new JobSkill();
                skill.setJob(job);
                skill.setSkillName(si.skillName());
                skill.setCategory(si.category());
                skill.setRequired(si.required());
                skill.setPriority(si.priority());
                job.getSkills().add(skill);
            }
        }

        // ── Attach benefits ──
        if (benefitInputs != null) {
            for (String b : benefitInputs) {
                JobBenefit benefit = new JobBenefit();
                benefit.setJob(job);
                benefit.setBenefit(b);
                job.getBenefits().add(benefit);
            }
        }

        job = jobRepository.save(job);
        log.info("Job Created: {} at {} (publicId={})", job.getTitle(), company.getName(), job.getPublicId());

        return jobMapper.toJobResponse(job);
    }

    /**
     * Find job by public ID.
     */
    @Transactional(readOnly = true)
    public JobResponse findByPublicId(UUID publicId) {
        Job job = jobRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + publicId));
        return jobMapper.toJobResponse(job);
    }

    /**
     * List active jobs (paginated).
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> findActiveJobs(Pageable pageable) {
        return jobRepository.findActiveJobs(pageable)
                .map(jobMapper::toJobResponse);
    }

    /**
     * List jobs by status (paginated).
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> findByStatus(JobStatus status, Pageable pageable) {
        return jobRepository.findByStatus(status, pageable)
                .map(jobMapper::toJobResponse);
    }

    /**
     * List jobs by company (paginated).
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> findByCompanyId(Long companyId, Pageable pageable) {
        return jobRepository.findByCompanyId(companyId, pageable)
                .map(jobMapper::toJobResponse);
    }

    /**
     * Update job status.
     */
    @Transactional
    public JobResponse updateStatus(UUID publicId, JobStatus newStatus) {
        Job job = jobRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + publicId));
        job.setStatus(newStatus);
        job = jobRepository.save(job);
        log.info("Job status updated: {} → {} (publicId={})", job.getTitle(), newStatus, publicId);
        return jobMapper.toJobResponse(job);
    }

    /**
     * Delete job by public ID.
     */
    @Transactional
    public void delete(UUID publicId) {
        Job job = jobRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + publicId));
        jobRepository.delete(job);
        log.info("Job deleted: {} (publicId={})", job.getTitle(), publicId);
    }

    /**
     * Check if a job already exists (by source + externalJobId OR checksum).
     */
    @Transactional(readOnly = true)
    public boolean isDuplicate(JobSource source, String externalJobId, String checksum) {
        return jobRepository.existsBySourceAndExternalJobId(source, externalJobId)
                || jobRepository.existsByChecksum(checksum);
    }

    /**
     * Calculate SHA-256 checksum for duplicate detection.
     */
    public String calculateChecksum(String source, String externalJobId, String companyName,
                                     String title, String location) {
        try {
            String content = source + "|" + externalJobId + "|" + companyName + "|" + title + "|" + location;
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

    // ── Inner record for skill input ────────────────────────

    /**
     * Input record for creating job skills.
     */
    public record SkillInput(String skillName, String category, boolean required, int priority) {}
}
