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
 * Greenhouse connector for fetching jobs.
 * V1: Returns deterministic mock jobs.
 */
@Component
public class GreenhouseConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(GreenhouseConnector.class);

    @Override
    public List<?> fetchJobs() {
        log.info("Fetching jobs from Greenhouse (mock data)");
        return generateMockJobs();
    }

    @Override
    public boolean supports(JobSource source) {
        return JobSource.GREENHOUSE == source;
    }

    @Override
    public NormalizedJob normalize(Object rawJob) {
        // For V1 mock data, rawJob is a map
        return (NormalizedJob) rawJob;
    }

    @Override
    public JobSource getSource() {
        return JobSource.GREENHOUSE;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("gh-001")
                .source(JobSource.GREENHOUSE.name())
                .title("Senior Backend Engineer")
                .description("We are looking for a Senior Backend Engineer with 5+ years of experience...")
                .location("San Francisco, CA")
                .remoteType("HYBRID")
                .employmentType("FULL_TIME")
                .experienceLevel("Senior")
                .salaryMin(150000L)
                .salaryMax(200000L)
                .currency("USD")
                .companyName("TechCorp")
                .companyWebsite("https://techcorp.com")
                .companyIndustry("Technology")
                .companyHeadquarters("San Francisco, CA")
                .companySize("501-1000")
                .skills(Arrays.asList("Java", "Spring Boot", "Kubernetes", "AWS"))
                .responsibilities("Design and implement scalable backend systems")
                .qualifications("5+ years backend experience, strong system design skills")
                .benefits("Health insurance, 401k, remote flexibility")
                .applyUrl("https://greenhouse.io/apply/gh-001")
                .jobUrl("https://greenhouse.io/job/gh-001")
                .postedDate(LocalDate.now().minusDays(5))
                .expiresDate(LocalDate.now().plusDays(30))
                .build(),

            NormalizedJob.builder()
                .externalJobId("gh-002")
                .source(JobSource.GREENHOUSE.name())
                .title("DevOps Engineer")
                .description("Join our DevOps team to build and maintain infrastructure...")
                .location("New York, NY")
                .remoteType("REMOTE")
                .employmentType("FULL_TIME")
                .experienceLevel("Mid-level")
                .salaryMin(120000L)
                .salaryMax(160000L)
                .currency("USD")
                .companyName("CloudInnovate")
                .companyWebsite("https://cloudinnovate.io")
                .companyIndustry("Cloud Computing")
                .companyHeadquarters("New York, NY")
                .companySize("51-200")
                .skills(Arrays.asList("Docker", "Kubernetes", "Terraform", "AWS"))
                .responsibilities("Maintain production infrastructure and CI/CD pipelines")
                .qualifications("3+ years DevOps experience")
                .benefits("Competitive salary, stock options")
                .applyUrl("https://greenhouse.io/apply/gh-002")
                .jobUrl("https://greenhouse.io/job/gh-002")
                .postedDate(LocalDate.now().minusDays(2))
                .expiresDate(LocalDate.now().plusDays(45))
                .build()
        );
    }
}
