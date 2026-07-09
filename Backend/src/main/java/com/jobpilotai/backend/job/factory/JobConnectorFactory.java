package com.jobpilotai.backend.job.factory;

import com.jobpilotai.backend.job.connector.JobConnector;
import com.jobpilotai.backend.job.enums.JobSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Factory for resolving job connectors by JobSource.
 * Auto-discovers all JobConnector beans and registers them.
 */
@Component("intelligenceJobConnectorFactory")
public class JobConnectorFactory {

    private static final Logger log = LoggerFactory.getLogger(JobConnectorFactory.class);

    private final Map<JobSource, JobConnector> connectorMap;
    private final List<JobConnector> connectors;

    public JobConnectorFactory(List<JobConnector> connectors) {
        this.connectors = connectors;
        this.connectorMap = connectors.stream()
                .collect(Collectors.toMap(JobConnector::getSource, Function.identity()));
        log.info("Registered {} job connectors: {}", connectors.size(),
                connectorMap.keySet().stream().map(Enum::name).collect(Collectors.joining(", ")));
    }

    /**
     * Get connector for a specific source.
     */
    public JobConnector getConnector(JobSource source) {
        JobConnector connector = connectorMap.get(source);
        if (connector == null) {
            throw new IllegalArgumentException("No connector registered for source: " + source);
        }
        return connector;
    }

    /**
     * Get all registered connectors.
     */
    public List<JobConnector> getAllConnectors() {
        return connectors;
    }

    /**
     * Get all available (healthy) connectors.
     */
    public List<JobConnector> getHealthyConnectors() {
        return connectors.stream()
                .filter(JobConnector::health)
                .collect(Collectors.toList());
    }

    /**
     * Check if a connector is registered for the given source.
     */
    public boolean hasConnector(JobSource source) {
        return connectorMap.containsKey(source);
    }
}
