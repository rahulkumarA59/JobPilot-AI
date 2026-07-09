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
 * Greenhouse ATS connector.
 * V1: Returns deterministic mock jobs.
 */
@Component("jobGreenhouseConnector")
public class GreenhouseConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(GreenhouseConnector.class);

    @Override
    public boolean supports(JobSource source) {
        return JobSource.GREENHOUSE == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        log.info("Connector Started: Greenhouse");
        List<NormalizedJob> jobs = generateMockJobs();
        log.info("Connector Finished: Greenhouse — {} jobs fetched", jobs.size());
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
        return JobSource.GREENHOUSE;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("gh-001")
                .source(JobSource.GREENHOUSE.name())
                .title("Senior Backend Engineer")
                .description("Build scalable microservices powering our core platform. Requires deep Java and distributed systems experience.")
                .location("San Francisco, CA")
                .remoteType("HYBRID")
                .employmentType("FULL_TIME")
                .experienceLevel("Senior")
                .salaryMin(150000L).salaryMax(200000L).currency("USD")
                .companyName("TechCorp")
                .companyWebsite("https://techcorp.com")
                .companyIndustry("Technology")
                .companyHeadquarters("San Francisco, CA")
                .companySize("501-1000")
                .skills(Arrays.asList("Java", "Spring Boot", "Kubernetes", "AWS"))
                .benefits(Arrays.asList("Health insurance", "401k matching", "Remote flexibility"))
                .applyUrl("https://boards.greenhouse.io/techcorp/jobs/gh-001")
                .jobUrl("https://boards.greenhouse.io/techcorp/jobs/gh-001")
                .postedDate(LocalDate.now().minusDays(5))
                .expiresDate(LocalDate.now().plusDays(30))
                .build(),
            NormalizedJob.builder()
                .externalJobId("gh-002")
                .source(JobSource.GREENHOUSE.name())
                .title("DevOps Engineer")
                .description("Maintain and evolve our CI/CD infrastructure and cloud-native platform.")
                .location("New York, NY")
                .remoteType("REMOTE")
                .employmentType("FULL_TIME")
                .experienceLevel("Mid-level")
                .salaryMin(120000L).salaryMax(160000L).currency("USD")
                .companyName("CloudInnovate")
                .companyWebsite("https://cloudinnovate.io")
                .companyIndustry("Cloud Computing")
                .companyHeadquarters("New York, NY")
                .companySize("51-200")
                .skills(Arrays.asList("Docker", "Kubernetes", "Terraform", "AWS"))
                .benefits(Arrays.asList("Competitive salary", "Stock options", "Unlimited PTO"))
                .applyUrl("https://boards.greenhouse.io/cloudinnovate/jobs/gh-002")
                .jobUrl("https://boards.greenhouse.io/cloudinnovate/jobs/gh-002")
                .postedDate(LocalDate.now().minusDays(2))
                .expiresDate(LocalDate.now().plusDays(45))
                .build(),
            NormalizedJob.builder()
                .externalJobId("gh-003")
                .source(JobSource.GREENHOUSE.name())
                .title("Frontend Developer")
                .description("Create beautiful, performant UIs with React and TypeScript for our SaaS platform.")
                .location("Austin, TX")
                .remoteType("ONSITE")
                .employmentType("FULL_TIME")
                .experienceLevel("Mid-level")
                .salaryMin(110000L).salaryMax(145000L).currency("USD")
                .companyName("TechCorp")
                .companyWebsite("https://techcorp.com")
                .companyIndustry("Technology")
                .companyHeadquarters("San Francisco, CA")
                .companySize("501-1000")
                .skills(Arrays.asList("React", "TypeScript", "CSS", "GraphQL"))
                .benefits(Arrays.asList("Health insurance", "401k matching", "Free lunch"))
                .applyUrl("https://boards.greenhouse.io/techcorp/jobs/gh-003")
                .jobUrl("https://boards.greenhouse.io/techcorp/jobs/gh-003")
                .postedDate(LocalDate.now().minusDays(1))
                .expiresDate(LocalDate.now().plusDays(60))
                .build()
        );
    }
}
