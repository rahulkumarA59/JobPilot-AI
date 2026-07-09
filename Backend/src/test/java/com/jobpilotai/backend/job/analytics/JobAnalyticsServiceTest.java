package com.jobpilotai.backend.job.analytics;

import com.jobpilotai.backend.job.cache.JobCacheService;
import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.dto.CompanyAnalyticsResponse;
import com.jobpilotai.backend.job.dto.JobAnalyticsResponse;
import com.jobpilotai.backend.job.enums.JobSource;
import com.jobpilotai.backend.job.enums.JobStatus;
import com.jobpilotai.backend.job.enums.RemoteType;
import com.jobpilotai.backend.job.repository.CompanyRepository;
import com.jobpilotai.backend.job.repository.JobRepository;
import com.jobpilotai.backend.job.repository.JobSkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobAnalyticsServiceTest {

    @Mock
    private JobRepository jobRepository;
    @Mock
    private CompanyRepository companyRepository;
    @Mock
    private JobSkillRepository jobSkillRepository;
    @Mock
    private JobCacheService cacheService;

    private JobAnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
        analyticsService = new JobAnalyticsService(
                jobRepository, companyRepository, jobSkillRepository, cacheService);
    }

    @Test
    void getJobAnalytics_usesCacheIfPresent() {
        JobAnalyticsResponse cachedResponse = JobAnalyticsResponse.builder().totalJobs(5).build();
        when(cacheService.getJobAnalytics()).thenReturn(Optional.of(cachedResponse));

        JobAnalyticsResponse result = analyticsService.getJobAnalytics();

        assertEquals(5, result.getTotalJobs());
        verify(jobRepository, never()).findAll();
    }

    @Test
    void getJobAnalytics_generatesAndCachesIfEmpty() {
        when(cacheService.getJobAnalytics()).thenReturn(Optional.empty());
        when(jobRepository.findAll()).thenReturn(List.of(createMockJob()));

        JobAnalyticsResponse result = analyticsService.getJobAnalytics();

        assertEquals(1, result.getTotalJobs());
        assertEquals(1, result.getActiveJobs());
        assertEquals(1, result.getJobsPerSource().get("GREENHOUSE"));
        assertEquals(100000.0, result.getAverageSalaryMin());
        verify(cacheService).putJobAnalytics(any(JobAnalyticsResponse.class));
    }

    @Test
    void getCompanyAnalytics_usesCacheIfPresent() {
        CompanyAnalyticsResponse cachedResponse = CompanyAnalyticsResponse.builder().totalCompanies(2).build();
        when(cacheService.getCompanyAnalytics()).thenReturn(Optional.of(cachedResponse));

        CompanyAnalyticsResponse result = analyticsService.getCompanyAnalytics();

        assertEquals(2, result.getTotalCompanies());
        verify(companyRepository, never()).findAll();
    }

    @Test
    void getCompanyAnalytics_generatesAndCachesIfEmpty() {
        when(cacheService.getCompanyAnalytics()).thenReturn(Optional.empty());
        when(companyRepository.findAll()).thenReturn(List.of(createMockCompany()));
        when(jobRepository.findAll()).thenReturn(List.of(createMockJob()));

        CompanyAnalyticsResponse result = analyticsService.getCompanyAnalytics();

        assertEquals(1, result.getTotalCompanies());
        assertEquals(1, result.getCompaniesPerIndustry().get("Tech"));
        assertEquals(1, result.getTopHiringCompanies().get("TestCo"));
        verify(cacheService).putCompanyAnalytics(any(CompanyAnalyticsResponse.class));
    }

    @Test
    void refreshAnalytics_clearsCacheAndRegenerates() {
        when(cacheService.getJobAnalytics()).thenReturn(Optional.empty());
        when(cacheService.getCompanyAnalytics()).thenReturn(Optional.empty());
        
        analyticsService.refreshAnalytics();

        verify(cacheService).evict(JobCacheService.KEY_JOB_ANALYTICS);
        verify(cacheService).evict(JobCacheService.KEY_COMPANY_ANALYTICS);
        verify(jobRepository, times(2)).findAll(); // Once for jobs, once for companies
        verify(companyRepository).findAll();
    }

    private Job createMockJob() {
        Job job = new Job();
        job.setId(1L);
        job.setSource(JobSource.GREENHOUSE);
        job.setStatus(JobStatus.ACTIVE);
        job.setRemoteType(RemoteType.REMOTE);
        job.setSalaryMin(100000L);
        job.setCompany(createMockCompany());
        return job;
    }

    private Company createMockCompany() {
        Company company = new Company();
        company.setId(1L);
        company.setName("TestCo");
        company.setIndustry("Tech");
        company.setSize("1-10");
        return company;
    }
}
