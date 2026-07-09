package com.jobpilotai.backend.job.connector;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.JobSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Manual job entry connector.
 * V1: Returns deterministic mock jobs representing manually entered positions.
 */
@Component("jobManualConnector")
public class ManualConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(ManualConnector.class);

    @Override
    public boolean supports(JobSource source) {
        return JobSource.MANUAL == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        log.info("Connector Started: Manual");
        List<NormalizedJob> jobs = generateMockJobs();
        log.info("Connector Finished: Manual — {} jobs fetched", jobs.size());
        return jobs;
    }

    @Override
    public NormalizedJob normalize(Object rawJob) {
        return (NormalizedJob) rawJob;
    }

    @Override
    public boolean health() {
        return true;
    }

    @Override
    public JobSource getSource() {
        return JobSource.MANUAL;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Collections.singletonList(
            NormalizedJob.builder()
                .externalJobId("man-001")
                .source(JobSource.MANUAL.name())
                .title("Technical Writer")
                .description("Write and maintain technical documentation for developer-facing APIs and SDKs.")
                .location("Portland, OR")
                .remoteType("REMOTE")
                .employmentType("PART_TIME")
                .experienceLevel("Mid-level")
                .salaryMin(60000L).salaryMax(85000L).currency("USD")
                .companyName("DevDocs Inc")
                .companyWebsite("https://devdocs.io")
                .companyIndustry("Developer Tools")
                .companyHeadquarters("Portland, OR")
                .companySize("11-50")
                .skills(Arrays.asList("Technical Writing", "Markdown", "API Documentation", "Git"))
                .benefits(Arrays.asList("Flexible schedule", "Book allowance"))
                .applyUrl("https://devdocs.io/careers/man-001")
                .jobUrl("https://devdocs.io/careers/man-001")
                .postedDate(LocalDate.now())
                .expiresDate(LocalDate.now().plusDays(60))
                .build()
        );
    }
}
