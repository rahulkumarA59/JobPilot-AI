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
 * Company Career Site connector for fetching jobs.
 * V1: Returns deterministic mock jobs.
 */
@Component
public class CompanyCareerConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(CompanyCareerConnector.class);

    @Override
    public List<?> fetchJobs() {
        log.info("Fetching jobs from Company Career Sites (mock data)");
        return generateMockJobs();
    }

    @Override
    public boolean supports(JobSource source) {
        return JobSource.COMPANY_CAREER == source;
    }

    @Override
    public NormalizedJob normalize(Object rawJob) {
        return (NormalizedJob) rawJob;
    }

    @Override
    public JobSource getSource() {
        return JobSource.COMPANY_CAREER;
    }

    private List<NormalizedJob> generateMockJobs() {
        return Arrays.asList(
            NormalizedJob.builder()
                .externalJobId("career-001")
                .source(JobSource.COMPANY_CAREER.name())
                .title("Software Engineer Intern")
                .description("Join our internship program and work on real projects...")
                .location("Mountain View, CA")
                .remoteType("ONSITE")
                .employmentType("INTERNSHIP")
                .experienceLevel("Entry-level")
                .salaryMin(25000L)
                .salaryMax(35000L)
                .currency("USD")
                .companyName("MegaTech")
                .companyWebsite("https://careers.megatech.io")
                .companyIndustry("Technology")
                .companyHeadquarters("Mountain View, CA")
                .companySize("5000+")
                .skills(Arrays.asList("Java", "Python", "SQL"))
                .responsibilities("Contribute to software development and learn best practices")
                .qualifications("Currently enrolled in CS program or recent grad")
                .benefits("Mentorship, future full-time opportunities")
                .applyUrl("https://careers.megatech.io/apply/career-001")
                .jobUrl("https://careers.megatech.io/job/career-001")
                .postedDate(LocalDate.now().minusDays(7))
                .expiresDate(LocalDate.now().plusDays(25))
                .build()
        );
    }
}
