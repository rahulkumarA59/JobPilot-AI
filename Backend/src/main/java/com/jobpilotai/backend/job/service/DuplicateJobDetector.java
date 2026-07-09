package com.jobpilotai.backend.job.service;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.repository.JobRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Detects duplicate jobs using multiple strategies:
 * 1. ExternalJobId (source + externalJobId)
 * 2. Checksum (SHA-256 of key fields)
 * 3. Company + Title + Location match
 */
@Component
public class DuplicateJobDetector {

    private static final Logger log = LoggerFactory.getLogger(DuplicateJobDetector.class);

    private final JobRepository jobRepository;

    public DuplicateJobDetector(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    /**
     * Check if a normalized job is a duplicate.
     */
    public boolean isDuplicate(NormalizedJob job) {
        // Strategy 1: source + externalJobId
        if (isDuplicateByExternalId(job)) {
            log.info("Duplicate Removed: externalJobId={} source={}", job.getExternalJobId(), job.getSource());
            return true;
        }

        // Strategy 2: checksum
        String checksum = calculateChecksum(job);
        if (isDuplicateByChecksum(checksum)) {
            log.info("Duplicate Removed: checksum={}", checksum);
            return true;
        }

        // Strategy 3: company + title + location
        if (isDuplicateByCompanyTitleLocation(job)) {
            log.info("Duplicate Removed: company={} title={} location={}",
                    job.getCompanyName(), job.getTitle(), job.getLocation());
            return true;
        }

        return false;
    }

    /**
     * Calculate checksum for a normalized job.
     */
    public String calculateChecksum(NormalizedJob job) {
        try {
            String content = nullSafe(job.getSource()) + "|" +
                    nullSafe(job.getExternalJobId()) + "|" +
                    nullSafe(job.getCompanyName()) + "|" +
                    nullSafe(job.getTitle()) + "|" +
                    nullSafe(job.getLocation());

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(content.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    // ── Private helpers ──────────────────────────────────────

    private boolean isDuplicateByExternalId(NormalizedJob job) {
        if (job.getSource() == null || job.getExternalJobId() == null) return false;
        try {
            var source = com.jobpilotai.backend.job.enums.JobSource.valueOf(job.getSource());
            return jobRepository.existsBySourceAndExternalJobId(source, job.getExternalJobId());
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isDuplicateByChecksum(String checksum) {
        return jobRepository.existsByChecksum(checksum);
    }

    private boolean isDuplicateByCompanyTitleLocation(NormalizedJob job) {
        if (job.getCompanyName() == null || job.getTitle() == null) return false;
        return jobRepository.existsByCompanyNameAndTitleAndLocation(
                job.getCompanyName(), job.getTitle(), job.getLocation());
    }

    private String nullSafe(String s) {
        return s != null ? s : "";
    }
}
