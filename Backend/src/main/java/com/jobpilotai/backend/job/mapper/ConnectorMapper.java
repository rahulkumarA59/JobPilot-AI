package com.jobpilotai.backend.job.mapper;

import com.jobpilotai.backend.job.connector.JobConnector;
import com.jobpilotai.backend.job.dto.ConnectorJobResponse;
import org.mapstruct.Mapper;

import java.time.Instant;

/**
 * Mapper for connector-related conversions.
 */
@Mapper(componentModel = "spring")
public interface ConnectorMapper {

    /**
     * Create a health-check response for a connector.
     */
    default ConnectorJobResponse toHealthResponse(JobConnector connector) {
        return ConnectorJobResponse.builder()
                .source(connector.getSource().name())
                .connectorHealthy(connector.health())
                .jobsFetched(0)
                .jobsSaved(0)
                .duplicatesSkipped(0)
                .validationFailures(0)
                .executionTimeMs(0)
                .executedAt(Instant.now())
                .build();
    }
}
