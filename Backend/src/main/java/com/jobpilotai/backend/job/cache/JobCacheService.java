package com.jobpilotai.backend.job.cache;

import com.jobpilotai.backend.job.dto.CompanyAnalyticsResponse;
import com.jobpilotai.backend.job.dto.JobAnalyticsResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * In-memory cache for job intelligence data.
 * V1 uses ConcurrentHashMap. Future versions will use Redis.
 */
@Service
public class JobCacheService {

    private static final Logger log = LoggerFactory.getLogger(JobCacheService.class);
    private static final long DEFAULT_TTL_MS = TimeUnit.MINUTES.toMillis(30);

    private final Map<String, CacheEntry<?>> cache = new ConcurrentHashMap<>();

    // ── Analytics cache keys ─────────────────────────────────
    public static final String KEY_JOB_ANALYTICS = "analytics:jobs";
    public static final String KEY_COMPANY_ANALYTICS = "analytics:companies";

    /**
     * Put a value into the cache with default TTL.
     */
    public <T> void put(String key, T value) {
        put(key, value, DEFAULT_TTL_MS);
    }

    /**
     * Put a value into the cache with custom TTL in milliseconds.
     */
    public <T> void put(String key, T value, long ttlMs) {
        cache.put(key, new CacheEntry<>(value, System.currentTimeMillis() + ttlMs));
        log.debug("Cache put: key={}", key);
    }

    /**
     * Get a value from the cache.
     */
    @SuppressWarnings("unchecked")
    public <T> Optional<T> get(String key, Class<T> type) {
        CacheEntry<?> entry = cache.get(key);
        if (entry == null) {
            return Optional.empty();
        }
        if (entry.isExpired()) {
            cache.remove(key);
            log.debug("Cache expired: key={}", key);
            return Optional.empty();
        }
        return Optional.of((T) entry.value());
    }

    /**
     * Get cached job analytics.
     */
    public Optional<JobAnalyticsResponse> getJobAnalytics() {
        return get(KEY_JOB_ANALYTICS, JobAnalyticsResponse.class);
    }

    /**
     * Cache job analytics.
     */
    public void putJobAnalytics(JobAnalyticsResponse analytics) {
        put(KEY_JOB_ANALYTICS, analytics);
    }

    /**
     * Get cached company analytics.
     */
    public Optional<CompanyAnalyticsResponse> getCompanyAnalytics() {
        return get(KEY_COMPANY_ANALYTICS, CompanyAnalyticsResponse.class);
    }

    /**
     * Cache company analytics.
     */
    public void putCompanyAnalytics(CompanyAnalyticsResponse analytics) {
        put(KEY_COMPANY_ANALYTICS, analytics);
    }

    /**
     * Evict a specific key.
     */
    public void evict(String key) {
        cache.remove(key);
        log.debug("Cache evict: key={}", key);
    }

    /**
     * Clear all cache entries.
     */
    public void clear() {
        cache.clear();
        log.info("Cache cleared");
    }

    /**
     * Get current cache size.
     */
    public int size() {
        return cache.size();
    }

    // ── Inner record ─────────────────────────────────────────

    private record CacheEntry<T>(T value, long expiresAt) {
        boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }
}
