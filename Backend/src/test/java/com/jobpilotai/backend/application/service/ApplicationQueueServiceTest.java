package com.jobpilotai.backend.application.service;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationPriority;
import com.jobpilotai.backend.application.repository.ApplicationRepository;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Job;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ApplicationQueueServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private ApplicationQueueService queueService;

    @Test
    void calculateAndSetPriority_withHighMatch_setsCriticalPriority() {
        Application application = new Application();
        
        Job job = new Job();
        job.setExpiresDate(LocalDate.now().plusDays(1)); // +30 score
        job.setPostedDate(LocalDate.now().minusDays(1)); // +20 score
        job.setSalaryMin(120000L); // +15 score
        application.setJob(job);
        
        CandidateProfile profile = new CandidateProfile();
        profile.setExpectedSalary(100000L);
        application.setCandidateProfile(profile);

        // Base 50 + 30 + 20 + 15 = 115 -> max 100

        queueService.calculateAndSetPriority(application);

        assertEquals(100, application.getScore());
        assertEquals(ApplicationPriority.CRITICAL, application.getPriority());
        verify(applicationRepository).save(application);
    }

    @Test
    void calculateAndSetPriority_withLowMatch_setsMediumPriority() {
        Application application = new Application();
        
        Job job = new Job();
        job.setExpiresDate(LocalDate.now().plusDays(30)); 
        job.setPostedDate(LocalDate.now().minusDays(10)); 
        job.setSalaryMin(80000L);
        application.setJob(job);
        
        CandidateProfile profile = new CandidateProfile();
        profile.setExpectedSalary(100000L);
        application.setCandidateProfile(profile);

        // Base 50 

        queueService.calculateAndSetPriority(application);

        assertEquals(50, application.getScore());
        assertEquals(ApplicationPriority.MEDIUM, application.getPriority());
        verify(applicationRepository).save(application);
    }
}
