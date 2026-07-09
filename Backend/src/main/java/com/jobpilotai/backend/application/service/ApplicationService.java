package com.jobpilotai.backend.application.service;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationStage;
import com.jobpilotai.backend.application.dto.ApplicationResponse;
import com.jobpilotai.backend.application.mapper.ApplicationMapper;
import com.jobpilotai.backend.application.repository.ApplicationRepository;
import com.jobpilotai.backend.application.validator.ApplicationValidator;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.candidateprofile.repository.CandidateProfileRepository;
import java.lang.IllegalArgumentException;
import jakarta.persistence.EntityNotFoundException;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.repository.JobRepository;
import com.jobpilotai.backend.resume.domain.Resume;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationValidator applicationValidator;
    private final ApplicationWorkflowService workflowService;
    private final ApplicationQueueService queueService;
    private final ApplicationMapper applicationMapper;
    private final ApplicationTrackerService trackerService;

    @Transactional
    public ApplicationResponse createApplication(Long candidateProfileId, Long jobId, Resume tailoredResume, String coverLetterRef) {
        CandidateProfile profile = candidateProfileRepository.findById(candidateProfileId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate Profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new EntityNotFoundException("Job not found"));

        applicationValidator.validateNewApplication(profile, job);

        Application application = new Application();
        application.setCandidateProfile(profile);
        application.setJob(job);
        application.setCompany(job.getCompany());
        application.setResume(tailoredResume);
        application.setCoverLetterReference(coverLetterRef);
        application.setSource("JOB_PILOT_ENGINE");
        
        application = applicationRepository.save(application);

        trackerService.recordTransition(application, null, ApplicationStage.QUEUED, "Initial Application Queued", "SYSTEM");
        queueService.calculateAndSetPriority(application);

        log.info("Created Application {} for Job {}", application.getPublicId(), job.getId());
        return applicationMapper.toResponse(application);
    }

    @Transactional
    public void markAsApplied(UUID publicId) {
        Application application = applicationRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        workflowService.transitionTo(application, ApplicationStage.APPLIED, "Application submitted successfully", "BROWSER_AGENT");
        application.setAppliedAt(Instant.now());
        applicationRepository.save(application);
    }

    @Transactional
    public void failApplication(UUID publicId, String reason) {
        Application application = applicationRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        workflowService.transitionTo(application, ApplicationStage.FAILED, reason, "SYSTEM");
        applicationRepository.save(application);
    }

    public ApplicationResponse getApplication(UUID publicId) {
        return applicationRepository.findByPublicId(publicId)
                .map(applicationMapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));
    }
}
