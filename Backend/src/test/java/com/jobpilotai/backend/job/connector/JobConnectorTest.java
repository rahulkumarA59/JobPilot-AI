package com.jobpilotai.backend.job.connector;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.JobSource;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for all job connectors.
 * Verifies that each connector:
 * - Returns the correct source
 * - Supports the correct source
 * - Returns non-empty mock jobs
 * - Returns valid normalized jobs
 * - Reports healthy status
 */
class JobConnectorTest {

    @Test
    void greenhouseConnector_returnsCorrectSource() {
        GreenhouseConnector connector = new GreenhouseConnector();
        assertEquals(JobSource.GREENHOUSE, connector.getSource());
        assertTrue(connector.supports(JobSource.GREENHOUSE));
        assertFalse(connector.supports(JobSource.LEVER));
    }

    @Test
    void greenhouseConnector_fetchJobsReturnsMockData() {
        GreenhouseConnector connector = new GreenhouseConnector();
        List<NormalizedJob> jobs = connector.fetchJobs();
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        assertTrue(jobs.size() >= 2);
        for (NormalizedJob job : jobs) {
            assertNotNull(job.getExternalJobId());
            assertEquals("GREENHOUSE", job.getSource());
            assertNotNull(job.getTitle());
            assertNotNull(job.getCompanyName());
        }
    }

    @Test
    void greenhouseConnector_isHealthy() {
        assertTrue(new GreenhouseConnector().health());
    }

    @Test
    void leverConnector_returnsCorrectSource() {
        LeverConnector connector = new LeverConnector();
        assertEquals(JobSource.LEVER, connector.getSource());
        assertTrue(connector.supports(JobSource.LEVER));
        assertFalse(connector.supports(JobSource.GREENHOUSE));
    }

    @Test
    void leverConnector_fetchJobsReturnsMockData() {
        LeverConnector connector = new LeverConnector();
        List<NormalizedJob> jobs = connector.fetchJobs();
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        for (NormalizedJob job : jobs) {
            assertEquals("LEVER", job.getSource());
            assertNotNull(job.getTitle());
        }
    }

    @Test
    void ashbyConnector_returnsCorrectSource() {
        AshbyConnector connector = new AshbyConnector();
        assertEquals(JobSource.ASHBY, connector.getSource());
        assertTrue(connector.supports(JobSource.ASHBY));
    }

    @Test
    void ashbyConnector_fetchJobsReturnsMockData() {
        AshbyConnector connector = new AshbyConnector();
        List<NormalizedJob> jobs = connector.fetchJobs();
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        for (NormalizedJob job : jobs) {
            assertEquals("ASHBY", job.getSource());
        }
    }

    @Test
    void workdayConnector_returnsCorrectSource() {
        WorkdayConnector connector = new WorkdayConnector();
        assertEquals(JobSource.WORKDAY, connector.getSource());
        assertTrue(connector.supports(JobSource.WORKDAY));
    }

    @Test
    void workdayConnector_fetchJobsReturnsMockData() {
        WorkdayConnector connector = new WorkdayConnector();
        List<NormalizedJob> jobs = connector.fetchJobs();
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        for (NormalizedJob job : jobs) {
            assertEquals("WORKDAY", job.getSource());
        }
    }

    @Test
    void companyCareerConnector_returnsCorrectSource() {
        CompanyCareerConnector connector = new CompanyCareerConnector();
        assertEquals(JobSource.COMPANY_CAREER, connector.getSource());
        assertTrue(connector.supports(JobSource.COMPANY_CAREER));
    }

    @Test
    void companyCareerConnector_fetchJobsReturnsMockData() {
        CompanyCareerConnector connector = new CompanyCareerConnector();
        List<NormalizedJob> jobs = connector.fetchJobs();
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        for (NormalizedJob job : jobs) {
            assertEquals("COMPANY_CAREER", job.getSource());
        }
    }

    @Test
    void manualConnector_returnsCorrectSource() {
        ManualConnector connector = new ManualConnector();
        assertEquals(JobSource.MANUAL, connector.getSource());
        assertTrue(connector.supports(JobSource.MANUAL));
    }

    @Test
    void manualConnector_fetchJobsReturnsMockData() {
        ManualConnector connector = new ManualConnector();
        List<NormalizedJob> jobs = connector.fetchJobs();
        assertNotNull(jobs);
        assertFalse(jobs.isEmpty());
        for (NormalizedJob job : jobs) {
            assertEquals("MANUAL", job.getSource());
        }
    }

    @Test
    void allConnectors_returnValidNormalizedJobs() {
        List<JobConnector> connectors = List.of(
            new GreenhouseConnector(),
            new LeverConnector(),
            new AshbyConnector(),
            new WorkdayConnector(),
            new CompanyCareerConnector(),
            new ManualConnector()
        );

        for (JobConnector connector : connectors) {
            List<NormalizedJob> jobs = connector.fetchJobs();
            for (NormalizedJob job : jobs) {
                assertNotNull(job.getExternalJobId(), "externalJobId null for " + connector.getSource());
                assertNotNull(job.getSource(), "source null for " + connector.getSource());
                assertNotNull(job.getTitle(), "title null for " + connector.getSource());
                assertNotNull(job.getCompanyName(), "companyName null for " + connector.getSource());
                assertNotNull(job.getPostedDate(), "postedDate null for " + connector.getSource());
                assertNotNull(job.getExpiresDate(), "expiresDate null for " + connector.getSource());
            }
        }
    }

    @Test
    void allConnectors_areHealthy() {
        List<JobConnector> connectors = List.of(
            new GreenhouseConnector(),
            new LeverConnector(),
            new AshbyConnector(),
            new WorkdayConnector(),
            new CompanyCareerConnector(),
            new ManualConnector()
        );
        for (JobConnector connector : connectors) {
            assertTrue(connector.health(), connector.getSource() + " should be healthy");
        }
    }
}
