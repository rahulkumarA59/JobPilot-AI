package com.jobpilotai.backend.job.normalizer;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for the JobNormalizer.
 */
class JobNormalizerTest {

    private JobNormalizer normalizer;

    @BeforeEach
    void setUp() {
        normalizer = new JobNormalizer();
    }

    @Test
    void normalize_trimsTitle() {
        NormalizedJob job = createBasicJob();
        job.setTitle("  Senior   Backend   Engineer  ");
        NormalizedJob result = normalizer.normalize(job);
        assertEquals("Senior Backend Engineer", result.getTitle());
    }

    @Test
    void normalize_standardizesCompanyName() {
        NormalizedJob job = createBasicJob();
        job.setCompanyName("TechCorp Inc.");
        NormalizedJob result = normalizer.normalize(job);
        assertEquals("TechCorp Inc", result.getCompanyName());
    }

    @Test
    void normalize_standardizesRemoteVariants() {
        NormalizedJob job = createBasicJob();

        job.setRemoteType("FULLY_REMOTE");
        assertEquals("REMOTE", normalizer.normalize(job).getRemoteType());

        job.setRemoteType("ON_SITE");
        assertEquals("ONSITE", normalizer.normalize(job).getRemoteType());

        job.setRemoteType("FLEXIBLE");
        assertEquals("HYBRID", normalizer.normalize(job).getRemoteType());
    }

    @Test
    void normalize_standardizesEmploymentType() {
        NormalizedJob job = createBasicJob();

        job.setEmploymentType("FULLTIME");
        assertEquals("FULL_TIME", normalizer.normalize(job).getEmploymentType());

        job.setEmploymentType("INTERN");
        assertEquals("INTERNSHIP", normalizer.normalize(job).getEmploymentType());

        job.setEmploymentType("GIG");
        assertEquals("FREELANCE", normalizer.normalize(job).getEmploymentType());
    }

    @Test
    void normalize_standardizesExperienceLevel() {
        NormalizedJob job = createBasicJob();

        job.setExperienceLevel("junior");
        assertEquals("Entry-level", normalizer.normalize(job).getExperienceLevel());

        job.setExperienceLevel("sr.");
        assertEquals("Senior", normalizer.normalize(job).getExperienceLevel());

        job.setExperienceLevel("intermediate");
        assertEquals("Mid-level", normalizer.normalize(job).getExperienceLevel());
    }

    @Test
    void normalize_fixesSalaryMinMax() {
        NormalizedJob job = createBasicJob();
        job.setSalaryMin(200000L);
        job.setSalaryMax(100000L);
        NormalizedJob result = normalizer.normalize(job);
        assertEquals(100000L, result.getSalaryMin());
        assertEquals(200000L, result.getSalaryMax());
    }

    @Test
    void normalize_defaultsCurrencyWhenSalaryPresent() {
        NormalizedJob job = createBasicJob();
        job.setSalaryMin(100000L);
        job.setCurrency(null);
        NormalizedJob result = normalizer.normalize(job);
        assertEquals("USD", result.getCurrency());
    }

    @Test
    void normalize_deduplicatesSkills() {
        NormalizedJob job = createBasicJob();
        job.setSkills(Arrays.asList("Java", "Python", "Java", " Python ", ""));
        NormalizedJob result = normalizer.normalize(job);
        assertEquals(2, result.getSkills().size());
        assertTrue(result.getSkills().contains("Java"));
        assertTrue(result.getSkills().contains("Python"));
    }

    @Test
    void normalize_handlesNullFields() {
        NormalizedJob job = NormalizedJob.builder()
                .externalJobId("test-001")
                .source("MANUAL")
                .title("Test Job")
                .companyName("Test Company")
                .build();
        assertDoesNotThrow(() -> normalizer.normalize(job));
    }

    @Test
    void normalizeAll_processesMultipleJobs() {
        List<NormalizedJob> jobs = List.of(createBasicJob(), createBasicJob());
        List<NormalizedJob> results = normalizer.normalizeAll(jobs);
        assertEquals(2, results.size());
    }

    private NormalizedJob createBasicJob() {
        return NormalizedJob.builder()
                .externalJobId("test-001")
                .source("GREENHOUSE")
                .title("Test Job")
                .companyName("TestCo")
                .location("New York, NY")
                .remoteType("REMOTE")
                .employmentType("FULL_TIME")
                .experienceLevel("Senior")
                .salaryMin(100000L)
                .salaryMax(150000L)
                .currency("USD")
                .skills(Arrays.asList("Java", "Spring"))
                .benefits(Arrays.asList("Health insurance"))
                .build();
    }
}
