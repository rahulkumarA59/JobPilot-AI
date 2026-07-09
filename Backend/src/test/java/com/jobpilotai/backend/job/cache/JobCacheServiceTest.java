package com.jobpilotai.backend.job.cache;

import com.jobpilotai.backend.job.dto.JobAnalyticsResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for the JobCacheService.
 */
class JobCacheServiceTest {

    private JobCacheService cacheService;

    @BeforeEach
    void setUp() {
        cacheService = new JobCacheService();
    }

    @Test
    void put_and_get_returnsValue() {
        cacheService.put("test-key", "test-value");
        Optional<String> result = cacheService.get("test-key", String.class);
        assertTrue(result.isPresent());
        assertEquals("test-value", result.get());
    }

    @Test
    void get_missingKey_returnsEmpty() {
        Optional<String> result = cacheService.get("missing", String.class);
        assertTrue(result.isEmpty());
    }

    @Test
    void put_withExpiredTtl_returnsEmpty() throws InterruptedException {
        cacheService.put("expiring-key", "value", 50); // 50ms TTL
        Thread.sleep(100); // Wait for expiry
        Optional<String> result = cacheService.get("expiring-key", String.class);
        assertTrue(result.isEmpty());
    }

    @Test
    void evict_removesEntry() {
        cacheService.put("to-evict", "value");
        cacheService.evict("to-evict");
        assertTrue(cacheService.get("to-evict", String.class).isEmpty());
    }

    @Test
    void clear_removesAllEntries() {
        cacheService.put("key1", "v1");
        cacheService.put("key2", "v2");
        assertEquals(2, cacheService.size());
        cacheService.clear();
        assertEquals(0, cacheService.size());
    }

    @Test
    void putJobAnalytics_and_getJobAnalytics() {
        JobAnalyticsResponse analytics = JobAnalyticsResponse.builder()
                .totalJobs(100)
                .activeJobs(80)
                .expiredJobs(20)
                .jobsPerSource(Map.of("GREENHOUSE", 50L))
                .generatedAt(Instant.now())
                .build();

        cacheService.putJobAnalytics(analytics);
        Optional<JobAnalyticsResponse> result = cacheService.getJobAnalytics();

        assertTrue(result.isPresent());
        assertEquals(100, result.get().getTotalJobs());
    }
}
