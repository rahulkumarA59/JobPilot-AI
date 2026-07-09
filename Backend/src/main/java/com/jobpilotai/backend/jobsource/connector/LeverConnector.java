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
 * Lever connector for fetching jobs.
 * V1: Returns deterministic mock jobs.
 */
@Component
public class LeverConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(LeverConnector.class);

    @Override
    public List<?> fetchJobs() {
        log.info("Fetching jobs from Lever (mock data)");
        return generateMockJobs();
    }

    @Override
    public boolean supports(JobSource source) {
        return JobSource.LEVER == source;
    }

    @Override
    public NormalizedJob normalize(Object rawJob) {
        return (NormalizedJob) rawJob;
    }

    @Override
    public JobSource getSource() {
        return JobSource.LEVER;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("lever-001")
                .source(JobSource.LEVER.name())
                .title("Frontend Engineer (React)")
                .description("Build beautiful user interfaces with React and TypeScript...")
                .location("Austin, TX")
                .remoteType("HYBRID")
                .employmentType("FULL_TIME")
                .experienceLevel("Mid-level")
                .salaryMin(110000L)
                .salaryMax(150000L)
                .currency("USD")
                .companyName("WebScale")
                .companyWebsite("https://webscale.io")
                .companyIndustry("Web Development")
                .companyHeadquarters("Austin, TX")
                .companySize("201-500")
                .skills(Arrays.asList("React", "TypeScript", "JavaScript", "CSS"))
                .responsibilities("Develop responsive web applications")
                .qualifications("3+ years React experience")
                .benefits("Flexible hours, learning budget")
                .applyUrl("https://lever.co/apply/lever-001")
                .jobUrl("https://lever.co/job/lever-001")
                .postedDate(LocalDate.now().minusDays(3))
                .expiresDate(LocalDate.now().plusDays(35))
                .build()
        );
    }
}
