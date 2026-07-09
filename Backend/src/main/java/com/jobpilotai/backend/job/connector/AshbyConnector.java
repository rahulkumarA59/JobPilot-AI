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
 * Ashby ATS connector.
 * V1: Returns deterministic mock jobs.
 */
@Component("jobAshbyConnector")
public class AshbyConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(AshbyConnector.class);

    @Override
    public boolean supports(JobSource source) {
        return JobSource.ASHBY == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        log.info("Connector Started: Ashby");
        List<NormalizedJob> jobs = generateMockJobs();
        log.info("Connector Finished: Ashby — {} jobs fetched", jobs.size());
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
        return JobSource.ASHBY;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("ab-001")
                .source(JobSource.ASHBY.name())
                .title("Machine Learning Engineer")
                .description("Build and deploy ML models for our recommendation engine. Strong Python and MLOps experience required.")
                .location("Boston, MA")
                .remoteType("HYBRID")
                .employmentType("FULL_TIME")
                .experienceLevel("Senior")
                .salaryMin(160000L).salaryMax(210000L).currency("USD")
                .companyName("NeuralPath")
                .companyWebsite("https://neuralpath.ai")
                .companyIndustry("Artificial Intelligence")
                .companyHeadquarters("Boston, MA")
                .companySize("51-200")
                .skills(Arrays.asList("Python", "TensorFlow", "PyTorch", "MLOps", "Kubernetes"))
                .benefits(Arrays.asList("Health insurance", "Equity package", "Conference budget"))
                .applyUrl("https://jobs.ashbyhq.com/neuralpath/ab-001")
                .jobUrl("https://jobs.ashbyhq.com/neuralpath/ab-001")
                .postedDate(LocalDate.now().minusDays(4))
                .expiresDate(LocalDate.now().plusDays(28))
                .build(),
            NormalizedJob.builder()
                .externalJobId("ab-002")
                .source(JobSource.ASHBY.name())
                .title("QA Automation Engineer")
                .description("Develop and maintain test automation frameworks for web and mobile applications.")
                .location("Denver, CO")
                .remoteType("REMOTE")
                .employmentType("CONTRACT")
                .experienceLevel("Mid-level")
                .salaryMin(90000L).salaryMax(120000L).currency("USD")
                .companyName("NeuralPath")
                .companyWebsite("https://neuralpath.ai")
                .companyIndustry("Artificial Intelligence")
                .companyHeadquarters("Boston, MA")
                .companySize("51-200")
                .skills(Arrays.asList("Selenium", "Java", "Cypress", "CI/CD"))
                .benefits(Arrays.asList("Flexible hours", "Remote work"))
                .applyUrl("https://jobs.ashbyhq.com/neuralpath/ab-002")
                .jobUrl("https://jobs.ashbyhq.com/neuralpath/ab-002")
                .postedDate(LocalDate.now().minusDays(6))
                .expiresDate(LocalDate.now().plusDays(14))
                .build()
        );
    }
}
