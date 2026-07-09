package com.jobpilotai.backend.ai.router;

import com.jobpilotai.backend.ai.config.AIGatewayProperties;
import com.jobpilotai.backend.ai.gateway.AIProvider;
import com.jobpilotai.backend.ai.gateway.domain.AIProviderType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AIRouter {

    private final AIGatewayProperties properties;
    private final Map<AIProviderType, AIProvider> providerMap;

    public AIRouter(AIGatewayProperties properties, List<AIProvider> providers) {
        this.properties = properties;
        this.providerMap = providers.stream()
                .collect(Collectors.toMap(AIProvider::getProviderType, Function.identity()));
        log.info("AI Router initialized with {} providers: {}", providerMap.size(), providerMap.keySet());
    }

    public AIProvider selectProvider(AIProviderType preferred) {
        // 1. Try preferred provider if specified and healthy
        if (preferred != null) {
            AIProvider provider = providerMap.get(preferred);
            if (provider != null && provider.isHealthy()) {
                log.info("Selected preferred provider: {}", preferred);
                return provider;
            }
            log.warn("Preferred provider {} is unavailable. Attempting fallback.", preferred);
        }

        // 2. Try primary provider from config
        AIProvider primary = providerMap.get(properties.getPrimaryProvider());
        if (primary != null && primary.isHealthy()) {
            log.info("Selected primary provider: {}", properties.getPrimaryProvider());
            return primary;
        }

        // 3. Fallback chain
        if (properties.isFallbackEnabled()) {
            for (AIProviderType fallback : properties.getFallbackOrder()) {
                AIProvider provider = providerMap.get(fallback);
                if (provider != null && provider.isHealthy()) {
                    log.warn("Fallback to provider: {}", fallback);
                    return provider;
                }
            }
        }

        throw new IllegalStateException("No healthy AI provider available");
    }

    public AIProvider selectProviderForOperation(AIProviderType preferred, String operation) {
        // 1. Try preferred
        if (preferred != null) {
            AIProvider provider = providerMap.get(preferred);
            if (provider != null && provider.isHealthy() && provider.getSupportedOperations().contains(operation)) {
                log.info("Selected preferred provider {} for operation {}", preferred, operation);
                return provider;
            }
        }

        // 2. Try primary
        AIProvider primary = providerMap.get(properties.getPrimaryProvider());
        if (primary != null && primary.isHealthy() && primary.getSupportedOperations().contains(operation)) {
            log.info("Selected primary provider {} for operation {}", properties.getPrimaryProvider(), operation);
            return primary;
        }

        // 3. Fallback chain (capability-aware)
        if (properties.isFallbackEnabled()) {
            for (AIProviderType fallback : properties.getFallbackOrder()) {
                AIProvider provider = providerMap.get(fallback);
                if (provider != null && provider.isHealthy() && provider.getSupportedOperations().contains(operation)) {
                    log.warn("Fallback to provider {} for operation {}", fallback, operation);
                    return provider;
                }
            }
        }

        throw new IllegalStateException("No healthy AI provider available for operation: " + operation);
    }

    public Optional<AIProvider> getProvider(AIProviderType type) {
        return Optional.ofNullable(providerMap.get(type));
    }

    public Map<AIProviderType, Boolean> getHealthStatus() {
        return providerMap.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().isHealthy()));
    }
}
