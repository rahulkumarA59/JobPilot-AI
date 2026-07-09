package com.jobpilotai.backend.jobsource.connector;

import com.jobpilotai.backend.jobsource.domain.JobSource;
import com.jobpilotai.backend.jobsource.dto.NormalizedJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * Ashby connector for fetching jobs.
 * V1: Returns deterministic mock jobs.
 */
@Component
public class AshbyConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(AshbyConnector.class);

    @Override
    public List<?> fetchJobs() {
        log.info("Fetching jobs from Ashby (mock data)");
        return generateMockJobs();
    }

    @Override
    public boolean supports(JobSource source) {
        return JobSource.ASHBY == source;
    }

    @Override
    public NormalizedJob normalize(Object rawJob) {
        return (NormalizedJob) rawJob;
    }

    @Override
    public JobSource getSource() {
        return JobSource.ASHBY;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("ashby-001")
                .source(JobSource.ASHBY.name())
                .title("Product Manager")
                .description("Lead product strategy and roadmap for our platform...")
                .location("Palo Alto, CA")
                .remoteType("ONSITE")
                .employmentType("FULL_TIME")
                .experienceLevel("Senior")
                .salaryMin(140000L)
                .salaryMax(180000L)
                .currency("USD")
                .companyName("StartupXYZ")
                .companyWebsite("https://startupxyz.io")
                .companyIndustry("SaaS")
                .companyHeadquarters("Palo Alto, CA")
                .companySize("51-200")
                .skills(Arrays.asList("Product Strategy", "Data Analysis", "Leadership"))
                .responsibilities("Define product vision and execute roadmap")
                .qualifications("5+ years product management experience")
                .benefits("Equity stake, competitive salary")
                .applyUrl("https://ashby.io/apply/ashby-001")
                .jobUrl("https://ashby.io/job/ashby-001")
                .postedDate(LocalDate.now().minusDays(1))
                .expiresDate(LocalDate.now().plusDays(60))
                .build()
        );
    }
}
