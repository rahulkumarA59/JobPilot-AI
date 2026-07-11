package com.jobpilotai.backend.job.connector;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.JobSource;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Company Career connector.
 * V1: Since company career pages vary wildly, REST-based collection is deferred.
 * Finding jobs on generic pages relies heavily on Playwright in the application phase.
 */
@Component("jobCompanyCareerConnector")
public class CompanyCareerConnector implements JobConnector {

    @Override
    public boolean supports(JobSource source) {
        return JobSource.COMPANY_CAREER == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        return List.of();
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
}
