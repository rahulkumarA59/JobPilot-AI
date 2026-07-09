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
 * Workday connector for fetching jobs.
 * V1: Returns deterministic mock jobs.
 */
@Component
public class WorkdayConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(WorkdayConnector.class);

    @Override
    public List<?> fetchJobs() {
        log.info("Fetching jobs from Workday (mock data)");
        return generateMockJobs();
    }

    @Override
    public boolean supports(JobSource source) {
        return JobSource.WORKDAY == source;
    }

    @Override
    public NormalizedJob normalize(Object rawJob) {
        return (NormalizedJob) rawJob;
    }

    @Override
    public JobSource getSource() {
        return JobSource.WORKDAY;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("workday-001")
                .source(JobSource.WORKDAY.name())
                .title("Data Scientist")
                .description("Build ML models to drive business insights...")
                .location("Seattle, WA")
                .remoteType("HYBRID")
                .employmentType("FULL_TIME")
                .experienceLevel("Mid-level")
                .salaryMin(130000L)
                .salaryMax(170000L)
                .currency("USD")
                .companyName("DataCorp")
                .companyWebsite("https://datacorp.io")
                .companyIndustry("Data & Analytics")
                .companyHeadquarters("Seattle, WA")
                .companySize("201-500")
                .skills(Arrays.asList("Python", "Machine Learning", "SQL", "TensorFlow"))
                .responsibilities("Develop and deploy ML models")
                .qualifications("3+ years data science experience")
                .benefits("Signing bonus, professional development")
                .applyUrl("https://workday.com/apply/workday-001")
                .jobUrl("https://workday.com/job/workday-001")
                .postedDate(LocalDate.now().minusDays(4))
                .expiresDate(LocalDate.now().plusDays(40))
                .build()
        );
    }
}
