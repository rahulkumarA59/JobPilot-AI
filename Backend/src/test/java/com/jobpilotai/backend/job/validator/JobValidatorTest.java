package com.jobpilotai.backend.job.validator;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for the JobValidator.
 */
class JobValidatorTest {

    private JobValidator validator;

    @BeforeEach
    void setUp() {
        validator = new JobValidator();
    }

    @Test
    void validate_validJob_noErrors() {
        NormalizedJob job = createValidJob();
        List<String> errors = validator.validate(job);
        assertTrue(errors.isEmpty(), "Valid job should have no errors: " + errors);
    }

    @Test
    void validate_missingTitle_returnsError() {
        NormalizedJob job = createValidJob();
        job.setTitle(null);
        List<String> errors = validator.validate(job);
        assertTrue(errors.stream().anyMatch(e -> e.contains("title")));
    }

    @Test
    void validate_missingSource_returnsError() {
        NormalizedJob job = createValidJob();
        job.setSource(null);
        List<String> errors = validator.validate(job);
        assertTrue(errors.stream().anyMatch(e -> e.contains("source")));
    }

    @Test
    void validate_missingExternalJobId_returnsError() {
        NormalizedJob job = createValidJob();
        job.setExternalJobId(null);
        List<String> errors = validator.validate(job);
        assertTrue(errors.stream().anyMatch(e -> e.contains("externalJobId")));
    }

    @Test
    void validate_missingCompanyName_returnsError() {
        NormalizedJob job = createValidJob();
        job.setCompanyName(null);
        List<String> errors = validator.validate(job);
        assertTrue(errors.stream().anyMatch(e -> e.contains("companyName")));
    }

    @Test
    void validate_negativeSalary_returnsError() {
        NormalizedJob job = createValidJob();
        job.setSalaryMin(-1000L);
        List<String> errors = validator.validate(job);
        assertTrue(errors.stream().anyMatch(e -> e.contains("salaryMin")));
    }

    @Test
    void validate_salaryMinGreaterThanMax_returnsError() {
        NormalizedJob job = createValidJob();
        job.setSalaryMin(200000L);
        job.setSalaryMax(100000L);
        List<String> errors = validator.validate(job);
        assertTrue(errors.stream().anyMatch(e -> e.contains("salaryMin")));
    }

    @Test
    void validate_invalidUrl_returnsError() {
        NormalizedJob job = createValidJob();
        job.setApplyUrl("not-a-url");
        List<String> errors = validator.validate(job);
        assertTrue(errors.stream().anyMatch(e -> e.contains("applyUrl")));
    }

    @Test
    void validate_expiredJob_returnsError() {
        NormalizedJob job = createValidJob();
        job.setExpiresDate(LocalDate.now().minusDays(1));
        List<String> errors = validator.validate(job);
        assertTrue(errors.stream().anyMatch(e -> e.contains("expired")));
    }

    @Test
    void validate_missingLocationAndRemoteType_returnsError() {
        NormalizedJob job = createValidJob();
        job.setLocation(null);
        job.setRemoteType(null);
        List<String> errors = validator.validate(job);
        assertTrue(errors.stream().anyMatch(e -> e.contains("location")));
    }

    @Test
    void isValid_validJob_returnsTrue() {
        assertTrue(validator.isValid(createValidJob()));
    }

    @Test
    void isValid_invalidJob_returnsFalse() {
        NormalizedJob job = createValidJob();
        job.setTitle(null);
        assertFalse(validator.isValid(job));
    }

    private NormalizedJob createValidJob() {
        return NormalizedJob.builder()
                .externalJobId("test-001")
                .source("GREENHOUSE")
                .title("Senior Engineer")
                .companyName("TechCo")
                .location("New York, NY")
                .remoteType("REMOTE")
                .salaryMin(100000L)
                .salaryMax(150000L)
                .applyUrl("https://example.com/apply")
                .jobUrl("https://example.com/job")
                .postedDate(LocalDate.now())
                .expiresDate(LocalDate.now().plusDays(30))
                .build();
    }
}
