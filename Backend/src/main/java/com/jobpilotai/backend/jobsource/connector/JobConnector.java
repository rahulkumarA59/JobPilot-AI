package com.jobpilotai.backend.jobsource.connector;

import com.jobpilotai.backend.jobsource.domain.JobSource;
import com.jobpilotai.backend.jobsource.dto.NormalizedJob;

import java.util.List;

/**
 * Interface for job connectors from various platforms.
 * Each connector implements this to fetch and normalize jobs from their source.
 */
public interface JobConnector {

    /**
     * Fetch raw jobs from the source platform.
     * For V1, returns deterministic mock data.
     * @return List of raw job data
     */
    List<?> fetchJobs();

    /**
     * Check if this connector supports the given job source.
     * @param source JobSource enum value
     * @return true if this connector can handle the source
     */
    boolean supports(JobSource source);

    /**
     * Normalize a single job from raw format to NormalizedJob.
     * @param rawJob The raw job data from the source
     * @return Normalized job in standard format
     */
    NormalizedJob normalize(Object rawJob);

    /**
     * Get the job source this connector handles.
     * @return JobSource enum
     */
    JobSource getSource();
}
