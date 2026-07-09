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
 * Workday connector.
 * V1: Returns deterministic mock jobs.
 */
@Component("jobWorkdayConnector")
public class WorkdayConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(WorkdayConnector.class);

    @Override
    public boolean supports(JobSource source) {
        return JobSource.WORKDAY == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        log.info("Connector Started: Workday");
        List<NormalizedJob> jobs = generateMockJobs();
        log.info("Connector Finished: Workday — {} jobs fetched", jobs.size());
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
        return JobSource.WORKDAY;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("wd-001")
                .source(JobSource.WORKDAY.name())
                .title("Senior Software Engineer")
                .description("Join a Fortune 500 engineering team building enterprise-scale platforms.")
                .location("Chicago, IL")
                .remoteType("ONSITE")
                .employmentType("FULL_TIME")
                .experienceLevel("Senior")
                .salaryMin(145000L).salaryMax(190000L).currency("USD")
                .companyName("GlobalFinance Corp")
                .companyWebsite("https://globalfinancecorp.com")
                .companyIndustry("Financial Services")
                .companyHeadquarters("Chicago, IL")
                .companySize("10000+")
                .skills(Arrays.asList("Java", "Microservices", "Oracle", "Kafka"))
                .benefits(Arrays.asList("Comprehensive health plan", "Pension", "Annual bonus"))
                .applyUrl("https://globalfinancecorp.wd5.myworkdayjobs.com/careers/wd-001")
                .jobUrl("https://globalfinancecorp.wd5.myworkdayjobs.com/careers/wd-001")
                .postedDate(LocalDate.now().minusDays(10))
                .expiresDate(LocalDate.now().plusDays(20))
                .build(),
            NormalizedJob.builder()
                .externalJobId("wd-002")
                .source(JobSource.WORKDAY.name())
                .title("Business Analyst Intern")
                .description("Summer internship analysing business processes and supporting digital transformation.")
                .location("New York, NY")
                .remoteType("ONSITE")
                .employmentType("INTERNSHIP")
                .experienceLevel("Entry-level")
                .salaryMin(25000L).salaryMax(35000L).currency("USD")
                .companyName("GlobalFinance Corp")
                .companyWebsite("https://globalfinancecorp.com")
                .companyIndustry("Financial Services")
                .companyHeadquarters("Chicago, IL")
                .companySize("10000+")
                .skills(Arrays.asList("Excel", "SQL", "PowerBI", "Communication"))
                .benefits(Arrays.asList("Mentorship programme", "Networking events"))
                .applyUrl("https://globalfinancecorp.wd5.myworkdayjobs.com/careers/wd-002")
                .jobUrl("https://globalfinancecorp.wd5.myworkdayjobs.com/careers/wd-002")
                .postedDate(LocalDate.now().minusDays(8))
                .expiresDate(LocalDate.now().plusDays(15))
                .build()
        );
    }
}
