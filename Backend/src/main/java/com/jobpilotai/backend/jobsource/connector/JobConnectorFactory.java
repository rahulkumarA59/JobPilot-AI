package com.jobpilotai.backend.jobsource.connector;

import com.jobpilotai.backend.jobsource.domain.JobSource;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Factory for creating job connectors based on JobSource.
 * Routes to the appropriate connector implementation.
 */
@Component
public class JobConnectorFactory {

    private final List<JobConnector> connectors;

    public JobConnectorFactory(List<JobConnector> connectors) {
        this.connectors = connectors;
    }

    /**
     * Get the connector for a specific job source.
     * @param source The JobSource enum
     * @return The appropriate JobConnector
     * @throws IllegalArgumentException if no connector found for source
     */
    public JobConnector getConnector(JobSource source) {
        return connectors.stream()
                .filter(connector -> connector.supports(source))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No connector found for source: " + source));
    }

    /**
     * Get all available connectors.
     * @return List of all registered connectors
     */
    public List<JobConnector> getAllConnectors() {
        return connectors;
    }
}
