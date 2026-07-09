package com.jobpilotai.backend.job.connector;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.JobSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * Lever ATS connector.
 * V1: Returns deterministic mock jobs.
 */
@Component("jobLeverConnector")
public class LeverConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(LeverConnector.class);

    @Override
    public boolean supports(JobSource source) {
        return JobSource.LEVER == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        log.info("Connector Started: Lever");
        List<NormalizedJob> jobs = generateMockJobs();
        log.info("Connector Finished: Lever — {} jobs fetched", jobs.size());
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
        return JobSource.LEVER;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("lv-001")
                .source(JobSource.LEVER.name())
                .title("Product Manager")
                .description("Lead product strategy for our B2B SaaS platform. Drive roadmap and cross-functional alignment.")
                .location("Seattle, WA")
                .remoteType("HYBRID")
                .employmentType("FULL_TIME")
                .experienceLevel("Senior")
                .salaryMin(140000L).salaryMax(185000L).currency("USD")
                .companyName("DataFlow")
                .companyWebsite("https://dataflow.io")
                .companyIndustry("Data Analytics")
                .companyHeadquarters("Seattle, WA")
                .companySize("201-500")
                .skills(Arrays.asList("Product Strategy", "Agile", "SQL", "Data Analysis"))
                .benefits(Arrays.asList("Health & dental", "Equity", "Learning budget"))
                .applyUrl("https://jobs.lever.co/dataflow/lv-001")
                .jobUrl("https://jobs.lever.co/dataflow/lv-001")
                .postedDate(LocalDate.now().minusDays(3))
                .expiresDate(LocalDate.now().plusDays(30))
                .build(),
            NormalizedJob.builder()
                .externalJobId("lv-002")
                .source(JobSource.LEVER.name())
                .title("Data Engineer")
                .description("Design and build data pipelines processing billions of events daily.")
                .location("Remote, US")
                .remoteType("REMOTE")
                .employmentType("FULL_TIME")
                .experienceLevel("Mid-level")
                .salaryMin(130000L).salaryMax(170000L).currency("USD")
                .companyName("DataFlow")
                .companyWebsite("https://dataflow.io")
                .companyIndustry("Data Analytics")
                .companyHeadquarters("Seattle, WA")
                .companySize("201-500")
                .skills(Arrays.asList("Python", "Apache Spark", "Airflow", "Snowflake"))
                .benefits(Arrays.asList("Health & dental", "Equity", "Home office stipend"))
                .applyUrl("https://jobs.lever.co/dataflow/lv-002")
                .jobUrl("https://jobs.lever.co/dataflow/lv-002")
                .postedDate(LocalDate.now().minusDays(7))
                .expiresDate(LocalDate.now().plusDays(21))
                .build()
        );
    }
}
