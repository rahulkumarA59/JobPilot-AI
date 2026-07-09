package com.jobpilotai.backend.application.validator;

import com.jobpilotai.backend.application.repository.ApplicationRepository;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import java.lang.IllegalArgumentException;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.enums.JobStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationValidatorTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private ApplicationValidator validator;

    @Test
    void validateNewApplication_whenValid_doesNotThrow() {
        CandidateProfile profile = new CandidateProfile();
        profile.setId(1L);

        Job job = new Job();
        job.setId(1L);
        job.setStatus(JobStatus.ACTIVE);
        job.setExpiresDate(LocalDate.now().plusDays(10));

        when(applicationRepository.existsByCandidateProfileIdAndJobId(1L, 1L)).thenReturn(false);

        assertDoesNotThrow(() -> validator.validateNewApplication(profile, job));
    }

    @Test
    void validateNewApplication_whenDuplicate_throwsException() {
        CandidateProfile profile = new CandidateProfile();
        profile.setId(1L);

        Job job = new Job();
        job.setId(1L);
        job.setStatus(JobStatus.ACTIVE);

        when(applicationRepository.existsByCandidateProfileIdAndJobId(1L, 1L)).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> validator.validateNewApplication(profile, job));
    }

    @Test
    void validateNewApplication_whenJobInactive_throwsException() {
        CandidateProfile profile = new CandidateProfile();
        profile.setId(1L);

        Job job = new Job();
        job.setId(1L);
        job.setStatus(JobStatus.CLOSED);

        when(applicationRepository.existsByCandidateProfileIdAndJobId(1L, 1L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> validator.validateNewApplication(profile, job));
    }

    @Test
    void validateNewApplication_whenJobExpired_throwsException() {
        CandidateProfile profile = new CandidateProfile();
        profile.setId(1L);

        Job job = new Job();
        job.setId(1L);
        job.setStatus(JobStatus.ACTIVE);
        job.setExpiresDate(LocalDate.now().minusDays(1));

        when(applicationRepository.existsByCandidateProfileIdAndJobId(1L, 1L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> validator.validateNewApplication(profile, job));
    }
}
