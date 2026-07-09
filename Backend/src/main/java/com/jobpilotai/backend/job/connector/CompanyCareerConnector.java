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
 * Company Career Site connector.
 * V1: Returns deterministic mock jobs.
 */
@Component("jobCompanyCareerConnector")
public class CompanyCareerConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(CompanyCareerConnector.class);

    @Override
    public boolean supports(JobSource source) {
        return JobSource.COMPANY_CAREER == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        log.info("Connector Started: Company Career");
        List<NormalizedJob> jobs = generateMockJobs();
        log.info("Connector Finished: Company Career — {} jobs fetched", jobs.size());
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
        return JobSource.COMPANY_CAREER;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("cc-001")
                .source(JobSource.COMPANY_CAREER.name())
                .title("Full Stack Developer")
                .description("Work across the entire stack building customer-facing features for our e-commerce platform.")
                .location("Los Angeles, CA")
                .remoteType("HYBRID")
                .employmentType("FULL_TIME")
                .experienceLevel("Mid-level")
                .salaryMin(115000L).salaryMax(150000L).currency("USD")
                .companyName("ShopWave")
                .companyWebsite("https://shopwave.com")
                .companyIndustry("E-commerce")
                .companyHeadquarters("Los Angeles, CA")
                .companySize("201-500")
                .skills(Arrays.asList("React", "Node.js", "PostgreSQL", "TypeScript"))
                .benefits(Arrays.asList("Health insurance", "Gym membership", "Flexible hours"))
                .applyUrl("https://careers.shopwave.com/jobs/cc-001")
                .jobUrl("https://careers.shopwave.com/jobs/cc-001")
                .postedDate(LocalDate.now().minusDays(1))
                .expiresDate(LocalDate.now().plusDays(45))
                .build(),
            NormalizedJob.builder()
                .externalJobId("cc-002")
                .source(JobSource.COMPANY_CAREER.name())
                .title("UX Designer")
                .description("Design intuitive user experiences for mobile and web. Strong portfolio required.")
                .location("Remote, US")
                .remoteType("REMOTE")
                .employmentType("FREELANCE")
                .experienceLevel("Senior")
                .salaryMin(80000L).salaryMax(120000L).currency("USD")
                .companyName("ShopWave")
                .companyWebsite("https://shopwave.com")
                .companyIndustry("E-commerce")
                .companyHeadquarters("Los Angeles, CA")
                .companySize("201-500")
                .skills(Arrays.asList("Figma", "User Research", "Prototyping", "Design Systems"))
                .benefits(Arrays.asList("Project-based bonuses", "Flexible schedule"))
                .applyUrl("https://careers.shopwave.com/jobs/cc-002")
                .jobUrl("https://careers.shopwave.com/jobs/cc-002")
                .postedDate(LocalDate.now().minusDays(3))
                .expiresDate(LocalDate.now().plusDays(30))
                .build()
        );
    }
}
