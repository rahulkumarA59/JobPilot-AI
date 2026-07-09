package com.jobpilotai.backend.job.analytics;

import com.jobpilotai.backend.job.cache.JobCacheService;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.domain.JobSkill;
import com.jobpilotai.backend.job.dto.CompanyAnalyticsResponse;
import com.jobpilotai.backend.job.dto.JobAnalyticsResponse;
import com.jobpilotai.backend.job.enums.JobStatus;
import com.jobpilotai.backend.job.enums.RemoteType;
import com.jobpilotai.backend.job.repository.CompanyRepository;
import com.jobpilotai.backend.job.repository.JobRepository;
import com.jobpilotai.backend.job.repository.JobSkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Generates analytics across all collected jobs and companies.
 * Results are cached in the in-memory cache.
 */
@Service
public class JobAnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(JobAnalyticsService.class);

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final JobSkillRepository jobSkillRepository;
    private final JobCacheService cacheService;

    public JobAnalyticsService(JobRepository jobRepository,
                                CompanyRepository companyRepository,
                                JobSkillRepository jobSkillRepository,
                                JobCacheService cacheService) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.cacheService = cacheService;
    }

    /**
     * Generate job analytics. Uses cache if available.
     */
    @Transactional(readOnly = true)
    public JobAnalyticsResponse getJobAnalytics() {
        Optional<JobAnalyticsResponse> cached = cacheService.getJobAnalytics();
        if (cached.isPresent()) {
            return cached.get();
        }

        JobAnalyticsResponse analytics = generateJobAnalytics();
        cacheService.putJobAnalytics(analytics);
        log.info("Analytics Updated: job analytics generated");
        return analytics;
    }

    /**
     * Generate company analytics. Uses cache if available.
     */
    @Transactional(readOnly = true)
    public CompanyAnalyticsResponse getCompanyAnalytics() {
        Optional<CompanyAnalyticsResponse> cached = cacheService.getCompanyAnalytics();
        if (cached.isPresent()) {
            return cached.get();
        }

        CompanyAnalyticsResponse analytics = generateCompanyAnalytics();
        cacheService.putCompanyAnalytics(analytics);
        log.info("Analytics Updated: company analytics generated");
        return analytics;
    }

    /**
     * Force-refresh all analytics (clears cache).
     */
    @Transactional(readOnly = true)
    public void refreshAnalytics() {
        cacheService.evict(JobCacheService.KEY_JOB_ANALYTICS);
        cacheService.evict(JobCacheService.KEY_COMPANY_ANALYTICS);
        getJobAnalytics();
        getCompanyAnalytics();
        log.info("Analytics Updated: all analytics refreshed");
    }

    // ── Private analytics generators ─────────────────────────

    private JobAnalyticsResponse generateJobAnalytics() {
        List<Job> allJobs = jobRepository.findAll();

        long totalJobs = allJobs.size();
        long activeJobs = allJobs.stream().filter(j -> j.getStatus() == JobStatus.ACTIVE).count();
        long expiredJobs = allJobs.stream().filter(j -> j.getStatus() == JobStatus.EXPIRED).count();

        // Jobs per source
        Map<String, Long> jobsPerSource = allJobs.stream()
                .collect(Collectors.groupingBy(j -> j.getSource().name(), Collectors.counting()));

        // Jobs per company
        Map<String, Long> jobsPerCompany = allJobs.stream()
                .collect(Collectors.groupingBy(j -> j.getCompany().getName(), Collectors.counting()));

        // Remote percentage
        long remoteCount = allJobs.stream()
                .filter(j -> j.getRemoteType() == RemoteType.REMOTE)
                .count();
        double remotePercentage = totalJobs > 0 ? (remoteCount * 100.0) / totalJobs : 0.0;

        // Average salary
        double avgSalaryMin = allJobs.stream()
                .filter(j -> j.getSalaryMin() != null)
                .mapToLong(Job::getSalaryMin)
                .average().orElse(0.0);
        double avgSalaryMax = allJobs.stream()
                .filter(j -> j.getSalaryMax() != null)
                .mapToLong(Job::getSalaryMax)
                .average().orElse(0.0);

        // Top skills
        Map<String, Long> topSkills = allJobs.stream()
                .flatMap(j -> j.getSkills().stream())
                .collect(Collectors.groupingBy(JobSkill::getSkillName, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(20)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (a, b) -> a, LinkedHashMap::new));

        // Top hiring companies (sorted by job count)
        Map<String, Long> topHiringCompanies = jobsPerCompany.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (a, b) -> a, LinkedHashMap::new));

        // Jobs per employment type
        Map<String, Long> jobsPerEmploymentType = allJobs.stream()
                .filter(j -> j.getEmploymentType() != null)
                .collect(Collectors.groupingBy(j -> j.getEmploymentType().name(), Collectors.counting()));

        // Jobs per remote type
        Map<String, Long> jobsPerRemoteType = allJobs.stream()
                .filter(j -> j.getRemoteType() != null)
                .collect(Collectors.groupingBy(j -> j.getRemoteType().name(), Collectors.counting()));

        return JobAnalyticsResponse.builder()
                .totalJobs(totalJobs)
                .activeJobs(activeJobs)
                .expiredJobs(expiredJobs)
                .jobsPerSource(jobsPerSource)
                .jobsPerCompany(jobsPerCompany)
                .remotePercentage(Math.round(remotePercentage * 100.0) / 100.0)
                .averageSalaryMin(Math.round(avgSalaryMin * 100.0) / 100.0)
                .averageSalaryMax(Math.round(avgSalaryMax * 100.0) / 100.0)
                .topSkills(topSkills)
                .topHiringCompanies(topHiringCompanies)
                .jobsPerEmploymentType(jobsPerEmploymentType)
                .jobsPerRemoteType(jobsPerRemoteType)
                .generatedAt(Instant.now())
                .build();
    }

    private CompanyAnalyticsResponse generateCompanyAnalytics() {
        var allCompanies = companyRepository.findAll();
        List<Job> allJobs = jobRepository.findAll();

        long totalCompanies = allCompanies.size();

        // Companies per industry
        Map<String, Long> companiesPerIndustry = allCompanies.stream()
                .filter(c -> c.getIndustry() != null)
                .collect(Collectors.groupingBy(c -> c.getIndustry(), Collectors.counting()));

        // Companies per size
        Map<String, Long> companiesPerSize = allCompanies.stream()
                .filter(c -> c.getSize() != null)
                .collect(Collectors.groupingBy(c -> c.getSize(), Collectors.counting()));

        // Top hiring companies
        Map<String, Long> topHiring = allJobs.stream()
                .collect(Collectors.groupingBy(j -> j.getCompany().getName(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (a, b) -> a, LinkedHashMap::new));

        double avgJobsPerCompany = totalCompanies > 0 ? (double) allJobs.size() / totalCompanies : 0.0;

        return CompanyAnalyticsResponse.builder()
                .totalCompanies(totalCompanies)
                .companiesPerIndustry(companiesPerIndustry)
                .companiesPerSize(companiesPerSize)
                .topHiringCompanies(topHiring)
                .averageJobsPerCompany(Math.round(avgJobsPerCompany * 100.0) / 100.0)
                .generatedAt(Instant.now())
                .build();
    }
}
