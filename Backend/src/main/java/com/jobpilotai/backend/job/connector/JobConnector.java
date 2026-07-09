package com.jobpilotai.backend.job.connector;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.JobSource;

import java.util.List;

/**
 * Interface for job connectors from various platforms.
 * Each connector implements this to fetch and normalize jobs from their source.
 */
public interface JobConnector {

    /**
     * Check if this connector supports the given job source.
     */
    boolean supports(JobSource source);

    /**
     * Fetch jobs from the source and return them in normalized format.
     * V1: Returns deterministic mock data. No API calls.
     */
    List<NormalizedJob> fetchJobs();

    /**
     * Normalize a single raw job object into the standard format.
     */
    NormalizedJob normalize(Object rawJob);

    /**
     * Health check for this connector.
     * @return true if the connector is operational
     */
    boolean health();

    /**
     * Get the job source this connector handles.
     */
    JobSource getSource();
}
