package com.jobpilotai.backend.resume.service;

import com.jobpilotai.backend.resume.dto.ResumeResponse;
import com.jobpilotai.backend.resume.repository.ResumeRepository;
import com.jobpilotai.backend.resumeversion.domain.ResumeVersionSource;
import com.jobpilotai.backend.resumeversion.domain.ResumeVersionStatus;
import com.jobpilotai.backend.resumeversion.repository.ResumeVersionRepository;
import com.jobpilotai.backend.resume.domain.ResumeStatus;
import com.jobpilotai.backend.resume.domain.Resume;
import com.jobpilotai.backend.user.domain.User;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);

    private final ResumeRepository resumeRepository;
    private final ResumeVersionRepository resumeVersionRepository;

    public ResumeService(ResumeRepository resumeRepository,
                          ResumeVersionRepository resumeVersionRepository) {
        this.resumeRepository = resumeRepository;
        this.resumeVersionRepository = resumeVersionRepository;
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> listForUser(User user) {
        return resumeRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResumeResponse findByPublicIdForUser(UUID publicId, User user) {
        var resume = resumeRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));

        if (!resume.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }

        return toResponse(resume);
    }

    @Transactional
    public void activate(UUID publicId, User user) {
        // Only one active resume
        var target = resumeRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));

        if (!target.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }

        var actives = resumeRepository.findActiveByUser(user);
        for (var r : actives) {
            r.deactivate();
        }
        target.activate();
        log.info("Resume Activated publicId={} userId={}", publicId, user.getId());
    }

    @Transactional
    public void softDelete(UUID publicId, User user) {
        var target = resumeRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));

        if (!target.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }

        target.softDelete();
        log.info("Resume Deleted publicId={} userId={}", publicId, user.getId());
    }

    /**
     * Prepare resume metadata from uploaded file.
     * Called during resume upload to populate resume entity with file details.
     */
    @Transactional
    public Resume prepareResumeMetadata(User user, String originalFilename, String storedFilename,
                                        String filePath, Long fileSize, String mimeType, String checksum) {
        // Validate no duplicate by checksum
        validateDuplicateChecksum(user, checksum);

        Resume resume = new Resume();
        resume.setUser(user);
        resume.setOriginalFilename(originalFilename);
        resume.setStoredFilename(storedFilename);
        resume.setFilePath(filePath);
        resume.setFileSize(fileSize);
        resume.setMimeType(mimeType);
        resume.setChecksum(checksum);
        resume.setActive(true);
        resume.setUploadedAt(Instant.now());
        resume.setStatus(ResumeStatus.ACTIVE);

        Resume saved = resumeRepository.save(resume);
        log.info("Resume Uploaded publicId={} userId={} filename={} fileSize={} checksum={}",
                saved.getPublicId(), user.getId(), originalFilename, fileSize, checksum);

        return saved;
    }

    /**
     * Validate that no resume with the same checksum exists for this user.
     * Business Rule: Duplicate checksum not allowed
     *
     * @param user User uploading the resume
     * @param checksum Checksum of the file
     * @throws IllegalArgumentException if duplicate checksum found
     */
    @Transactional(readOnly = true)
    public void validateDuplicateChecksum(User user, String checksum) {
        var existing = resumeRepository.findByChecksum(checksum);
        if (existing.isPresent() && existing.get().getUser().getId().equals(user.getId())) {
            log.warn("Duplicate Resume attempt userId={} checksum={}", user.getId(), checksum);
            throw new IllegalArgumentException("Resume with same checksum already exists");
        }
    }

    /**
     * List all non-deleted resumes for authenticated user.
     * Business Rule: Resume belongs to authenticated user
     */
    @Transactional(readOnly = true)
    public List<ResumeResponse> listUserResumes(User user) {
        return resumeRepository.findByUserAndStatusNot(user, ResumeStatus.DELETED)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Activate a resume for the authenticated user.
     * Business Rule: One active resume per user
     */
    @Transactional
    public void activateResume(UUID publicId, User user) {
        activate(publicId, user);
    }

    /**
     * Soft delete a resume for the authenticated user.
     * Business Rule: Soft delete only
     */
    @Transactional
    public void softDeleteResume(UUID publicId, User user) {
        softDelete(publicId, user);
    }

    private ResumeResponse toResponse(Resume resume) {
        return new ResumeResponse(
                resume.getPublicId(),
                resume.getOriginalFilename(),
                resume.getFileSize(),
                resume.getMimeType(),
                resume.isActive(),
                resume.getUploadedAt()
        );
    }
}

