package com.jobpilotai.backend.application.validator;

import com.jobpilotai.backend.application.repository.ApplicationRepository;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import java.lang.IllegalArgumentException;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.enums.JobStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class ApplicationValidator {

    private final ApplicationRepository applicationRepository;

    public void validateNewApplication(CandidateProfile profile, Job job) {
        if (applicationRepository.existsByCandidateProfileIdAndJobId(profile.getId(), job.getId())) {
            throw new IllegalArgumentException("Application already exists for this job and profile.");
        }

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new IllegalArgumentException("Cannot apply to a job that is not ACTIVE. Current status: " + job.getStatus());
        }

        if (job.getExpiresDate() != null && job.getExpiresDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot apply to an expired job.");
        }
    }
}
