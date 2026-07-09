package com.jobpilotai.backend.job.validator;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Validates normalized job data before persistence.
 * Checks for missing fields, salary sanity, URL validity, expiration, and location issues.
 */
@Component
public class JobValidator {

    private static final Logger log = LoggerFactory.getLogger(JobValidator.class);

    /**
     * Validate a normalized job and return a list of validation errors.
     * Empty list means the job is valid.
     */
    public List<String> validate(NormalizedJob job) {
        List<String> errors = new ArrayList<>();

        // ── Required fields ──
        if (isBlank(job.getExternalJobId())) errors.add("Missing externalJobId");
        if (isBlank(job.getSource())) errors.add("Missing source");
        if (isBlank(job.getTitle())) errors.add("Missing title");
        if (isBlank(job.getCompanyName())) errors.add("Missing companyName");

        // ── Salary validation ──
        validateSalary(job, errors);

        // ── URL validation ──
        validateUrl(job.getApplyUrl(), "applyUrl", errors);
        validateUrl(job.getJobUrl(), "jobUrl", errors);

        // ── Expiration check ──
        if (job.getExpiresDate() != null && job.getExpiresDate().isBefore(LocalDate.now())) {
            errors.add("Job is expired: expiresDate=" + job.getExpiresDate());
        }

        // ── Location validation ──
        if (isBlank(job.getLocation()) && isBlank(job.getRemoteType())) {
            errors.add("Missing location and remoteType — at least one is required");
        }

        if (!errors.isEmpty()) {
            log.warn("Job validation failed for {} ({}): {}", job.getTitle(), job.getExternalJobId(), errors);
        }

        return errors;
    }

    /**
     * Check if a job is valid (no errors).
     */
    public boolean isValid(NormalizedJob job) {
        return validate(job).isEmpty();
    }

    // ── Private helpers ──────────────────────────────────────

    private void validateSalary(NormalizedJob job, List<String> errors) {
        if (job.getSalaryMin() != null && job.getSalaryMin() < 0) {
            errors.add("salaryMin cannot be negative: " + job.getSalaryMin());
        }
        if (job.getSalaryMax() != null && job.getSalaryMax() < 0) {
            errors.add("salaryMax cannot be negative: " + job.getSalaryMax());
        }
        if (job.getSalaryMin() != null && job.getSalaryMax() != null) {
            if (job.getSalaryMin() > job.getSalaryMax()) {
                errors.add("salaryMin (" + job.getSalaryMin() + ") > salaryMax (" + job.getSalaryMax() + ")");
            }
        }
    }

    private void validateUrl(String url, String fieldName, List<String> errors) {
        if (url != null && !url.isBlank()) {
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                errors.add("Invalid " + fieldName + ": must start with http:// or https://");
            }
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
