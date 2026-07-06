package com.jobpilotai.backend.resume.service;

import com.jobpilotai.backend.resume.dto.ResumeVersionResponse;
import com.jobpilotai.backend.resume.dto.UploadResumeRequest;
import com.jobpilotai.backend.resume.repository.ResumeRepository;
import com.jobpilotai.backend.resumeversion.domain.ResumeVersion;
import com.jobpilotai.backend.resumeversion.domain.ResumeVersionSource;
import com.jobpilotai.backend.resumeversion.domain.ResumeVersionStatus;
import com.jobpilotai.backend.resumeversion.repository.ResumeVersionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeVersionService {

    private static final Logger log = LoggerFactory.getLogger(ResumeVersionService.class);

    private final ResumeRepository resumeRepository;
    private final ResumeVersionRepository resumeVersionRepository;

    public ResumeVersionService(ResumeRepository resumeRepository,
                                ResumeVersionRepository resumeVersionRepository) {
        this.resumeRepository = resumeRepository;
        this.resumeVersionRepository = resumeVersionRepository;
    }

    @Transactional
    public ResumeVersionResponse createInitialVersion(UUID resumePublicId) {
        var resume = resumeRepository.findByPublicId(resumePublicId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));

        // Version 1
        ResumeVersion v1 = new ResumeVersion();
        v1.setResume(resume);
        v1.setVersionNumber(1);
        v1.setVersionName("Version 1");
        v1.setSource(ResumeVersionSource.ORIGINAL);
        v1.setStatus(ResumeVersionStatus.ACTIVE);

        ResumeVersion saved = resumeVersionRepository.save(v1);
        log.info("Version Created resumePublicId={} versionNumber={} source={}", 
                resumePublicId, saved.getVersionNumber(), saved.getSource());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ResumeVersionResponse> listVersions(UUID resumePublicId) {
        var resume = resumeRepository.findByPublicId(resumePublicId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));

        return resumeVersionRepository.findByResumeOrderByVersionNumber(resume)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void archiveVersions(UUID resumePublicId) {
        var resume = resumeRepository.findByPublicId(resumePublicId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));

        var versions = resumeVersionRepository.findByResumeOrderByVersionNumber(resume);
        for (ResumeVersion v : versions) {
            if (v.getStatus() == ResumeVersionStatus.ACTIVE) {
                v.setStatus(ResumeVersionStatus.ARCHIVED);
            }
        }
    }

    @Transactional
    public void activateVersion(UUID resumePublicId, int versionNumber) {
        var resume = resumeRepository.findByPublicId(resumePublicId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));

        var versions = resumeVersionRepository.findByResumeOrderByVersionNumber(resume);
        ResumeVersion target = versions.stream()
                .filter(v -> v.getVersionNumber() == versionNumber)
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Version not found"));

        for (ResumeVersion v : versions) {
            v.setStatus(v == target ? ResumeVersionStatus.ACTIVE : ResumeVersionStatus.ARCHIVED);
        }
    }

    private ResumeVersionResponse toResponse(ResumeVersion version) {
        return new ResumeVersionResponse(
                version.getVersionNumber(),
                version.getVersionName(),
                version.getSource(),
                version.getStatus(),
                version.getCreatedAt()
        );
    }
}

