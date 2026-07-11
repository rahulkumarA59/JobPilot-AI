package com.jobpilotai.backend.job.connector;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.JobSource;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Workday ATS connector.
 * V1: Since Workday lacks a standard public posting API across tenants,
 * REST-based collection is deferred. Workday automation relies heavily on
 * Playwright in the application phase.
 */
@Component("jobWorkdayConnector")
public class WorkdayConnector implements JobConnector {

    @Override
    public boolean supports(JobSource source) {
        return JobSource.WORKDAY == source;
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
        return JobSource.WORKDAY;
    }
}
