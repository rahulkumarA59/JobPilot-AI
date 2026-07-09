package com.jobpilotai.backend.job.collector;

import com.jobpilotai.backend.job.connector.JobConnector;
import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.dto.ConnectorJobResponse;
import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.JobSource;
import com.jobpilotai.backend.job.factory.JobConnectorFactory;
import com.jobpilotai.backend.job.normalizer.JobNormalizer;
import com.jobpilotai.backend.job.repository.JobRepository;
import com.jobpilotai.backend.job.service.CompanyEnrichmentService;
import com.jobpilotai.backend.job.service.DuplicateJobDetector;
import com.jobpilotai.backend.job.validator.JobValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobCollectionServiceTest {

    @Mock
    private JobConnectorFactory connectorFactory;
    @Mock
    private JobNormalizer normalizer;
    @Mock
    private JobValidator validator;
    @Mock
    private DuplicateJobDetector duplicateDetector;
    @Mock
    private CompanyEnrichmentService companyEnrichmentService;
    @Mock
    private JobRepository jobRepository;
    @Mock
    private JobConnector mockConnector;

    private JobCollectionService collectionService;

    @BeforeEach
    void setUp() {
        collectionService = new JobCollectionService(
                connectorFactory, normalizer, validator, duplicateDetector,
                companyEnrichmentService, jobRepository
        );
    }

    @Test
    void collectFromSource_success() {
        // Arrange
        JobSource source = JobSource.GREENHOUSE;
        NormalizedJob rawJob = NormalizedJob.builder().title("Raw").build();
        NormalizedJob normalizedJob = NormalizedJob.builder().title("Normalized").source(source.name()).build();
        
        when(connectorFactory.getConnector(source)).thenReturn(mockConnector);
        when(mockConnector.fetchJobs()).thenReturn(List.of(rawJob));
        when(mockConnector.health()).thenReturn(true);
        
        when(normalizer.normalizeAll(anyList())).thenReturn(List.of(normalizedJob));
        when(validator.isValid(normalizedJob)).thenReturn(true);
        when(duplicateDetector.isDuplicate(normalizedJob)).thenReturn(false);
        when(duplicateDetector.calculateChecksum(any())).thenReturn("dummy-checksum");
        
        Company mockCompany = new Company();
        mockCompany.setName("TestCo");
        when(companyEnrichmentService.enrichAndResolve(normalizedJob)).thenReturn(mockCompany);
        
        Job savedJob = new Job();
        savedJob.setTitle("Normalized");
        when(jobRepository.save(any(Job.class))).thenReturn(savedJob);

        // Act
        ConnectorJobResponse response = collectionService.collectFromSource(source);

        // Assert
        assertNotNull(response);
        assertEquals("GREENHOUSE", response.getSource());
        assertEquals(1, response.getJobsFetched());
        assertEquals(1, response.getJobsSaved());
        assertEquals(0, response.getDuplicatesSkipped());
        assertEquals(0, response.getValidationFailures());
        assertTrue(response.isConnectorHealthy());
        
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    void collectFromSource_skipsInvalidJobs() {
        JobSource source = JobSource.LEVER;
        NormalizedJob invalidJob = NormalizedJob.builder().title("Invalid").build();
        
        when(connectorFactory.getConnector(source)).thenReturn(mockConnector);
        when(mockConnector.fetchJobs()).thenReturn(List.of(invalidJob));
        when(normalizer.normalizeAll(anyList())).thenReturn(List.of(invalidJob));
        when(validator.isValid(invalidJob)).thenReturn(false); // Fails validation

        ConnectorJobResponse response = collectionService.collectFromSource(source);

        assertEquals(1, response.getJobsFetched());
        assertEquals(0, response.getJobsSaved());
        assertEquals(1, response.getValidationFailures());
        
        verify(duplicateDetector, never()).isDuplicate(any());
        verify(jobRepository, never()).save(any());
    }

    @Test
    void collectFromSource_skipsDuplicates() {
        JobSource source = JobSource.ASHBY;
        NormalizedJob duplicateJob = NormalizedJob.builder().title("Duplicate").build();
        
        when(connectorFactory.getConnector(source)).thenReturn(mockConnector);
        when(mockConnector.fetchJobs()).thenReturn(List.of(duplicateJob));
        when(normalizer.normalizeAll(anyList())).thenReturn(List.of(duplicateJob));
        when(validator.isValid(duplicateJob)).thenReturn(true);
        when(duplicateDetector.isDuplicate(duplicateJob)).thenReturn(true); // Is duplicate

        ConnectorJobResponse response = collectionService.collectFromSource(source);

        assertEquals(1, response.getJobsFetched());
        assertEquals(0, response.getJobsSaved());
        assertEquals(1, response.getDuplicatesSkipped());
        
        verify(jobRepository, never()).save(any());
    }

    @Test
    void collectFromAllSources_orchestratesCorrectly() {
        when(connectorFactory.getHealthyConnectors()).thenReturn(List.of(mockConnector));
        when(mockConnector.getSource()).thenReturn(JobSource.WORKDAY);
        when(connectorFactory.getConnector(JobSource.WORKDAY)).thenReturn(mockConnector);
        when(mockConnector.fetchJobs()).thenReturn(List.of());
        when(mockConnector.health()).thenReturn(true);
        when(normalizer.normalizeAll(anyList())).thenReturn(List.of());

        List<ConnectorJobResponse> responses = collectionService.collectFromAllSources();

        assertEquals(1, responses.size());
        verify(connectorFactory).getConnector(JobSource.WORKDAY);
    }
}
