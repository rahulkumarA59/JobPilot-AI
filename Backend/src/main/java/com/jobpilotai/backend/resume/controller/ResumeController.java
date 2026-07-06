package com.jobpilotai.backend.resume.controller;

import com.jobpilotai.backend.common.dto.ApiResponse;
import com.jobpilotai.backend.resume.dto.ResumeResponse;
import com.jobpilotai.backend.resume.dto.ResumeVersionResponse;
import com.jobpilotai.backend.resume.dto.UploadResumeRequest;
import com.jobpilotai.backend.resume.service.ResumeService;
import com.jobpilotai.backend.resume.service.ResumeVersionService;
import com.jobpilotai.backend.resumeversion.service.LocalFileStorageService;
import com.jobpilotai.backend.user.domain.User;
import com.jobpilotai.backend.user.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Resume Management REST Controller
 * 
 * Endpoints:
 * - POST /api/resumes/upload - Upload new resume
 * - GET /api/resumes - List user resumes
 * - GET /api/resumes/{publicId} - Get resume details
 * - GET /api/resumes/{publicId}/versions - Get resume versions
 * - POST /api/resumes/{publicId}/activate - Activate resume
 * - DELETE /api/resumes/{publicId} - Delete resume
 */
@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private static final Logger log = LoggerFactory.getLogger(ResumeController.class);

    private final ResumeService resumeService;
    private final ResumeVersionService resumeVersionService;
    private final LocalFileStorageService fileStorageService;
    private final UserService userService;

    public ResumeController(ResumeService resumeService,
                           ResumeVersionService resumeVersionService,
                           LocalFileStorageService fileStorageService,
                           UserService userService) {
        this.resumeService = resumeService;
        this.resumeVersionService = resumeVersionService;
        this.fileStorageService = fileStorageService;
        this.userService = userService;
    }

    /**
     * Upload a new resume
     * 
     * POST /api/resumes/upload
     * Accepts: multipart/form-data with file field
     * Maximum file size: 5 MB
     * Allowed formats: PDF, DOC, DOCX
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ResumeResponse> uploadResume(
            @Valid @ModelAttribute UploadResumeRequest request,
            Authentication authentication) throws IOException {

        User user = userService.getCurrentUserEntity(authentication.getName());
        log.info("Resume upload request userId={} filename={}", user.getId(), request.file().getOriginalFilename());

        try {
            // Store file and get checksum
            String storedFilename = fileStorageService.storeFile(request.file());
            String checksum = fileStorageService.getChecksum();
            String filePath = fileStorageService.getFilePath(storedFilename).toString();

            // Prepare and save resume metadata
            var resume = resumeService.prepareResumeMetadata(
                    user,
                    request.file().getOriginalFilename(),
                    storedFilename,
                    filePath,
                    request.file().getSize(),
                    request.file().getContentType(),
                    checksum
            );

            // Create initial version
            resumeVersionService.createInitialVersion(resume.getPublicId());

            log.info("Resume uploaded successfully publicId={} userId={}", resume.getPublicId(), user.getId());
            return ApiResponse.success("Resume uploaded successfully", 
                    new ResumeResponse(
                            resume.getPublicId(),
                            resume.getOriginalFilename(),
                            resume.getFileSize(),
                            resume.getMimeType(),
                            resume.isActive(),
                            resume.getUploadedAt()
                    ));
        } catch (IllegalArgumentException e) {
            log.warn("Duplicate resume upload attempt userId={}", user.getId());
            throw e;
        }
    }

    /**
     * List all non-deleted resumes for authenticated user
     * 
     * GET /api/resumes
     */
    @GetMapping
    public ApiResponse<List<ResumeResponse>> listResumes(Authentication authentication) {
        User user = userService.getCurrentUserEntity(authentication.getName());
        log.info("Listing resumes for userId={}", user.getId());

        List<ResumeResponse> resumes = resumeService.listUserResumes(user);
        return ApiResponse.success("Resumes retrieved successfully", resumes);
    }

    /**
     * Get a specific resume by public ID
     * 
     * GET /api/resumes/{publicId}
     */
    @GetMapping("/{publicId}")
    public ApiResponse<ResumeResponse> getResume(
            @PathVariable UUID publicId,
            Authentication authentication) {

        User user = userService.getCurrentUserEntity(authentication.getName());
        log.info("Fetching resume publicId={} userId={}", publicId, user.getId());

        ResumeResponse resume = resumeService.findByPublicIdForUser(publicId, user);
        return ApiResponse.success(resume);
    }

    /**
     * Get all versions of a resume
     * 
     * GET /api/resumes/{publicId}/versions
     */
    @GetMapping("/{publicId}/versions")
    public ApiResponse<List<ResumeVersionResponse>> getVersions(
            @PathVariable UUID publicId,
            Authentication authentication) {

        User user = userService.getCurrentUserEntity(authentication.getName());
        
        // Verify user owns this resume
        resumeService.findByPublicIdForUser(publicId, user);
        
        log.info("Fetching resume versions publicId={} userId={}", publicId, user.getId());
        List<ResumeVersionResponse> versions = resumeVersionService.listVersions(publicId);
        return ApiResponse.success(versions);
    }

    /**
     * Activate a resume
     * 
     * POST /api/resumes/{publicId}/activate
     * Business rule: Only one active resume per user
     */
    @PostMapping("/{publicId}/activate")
    public ApiResponse<Void> activateResume(
            @PathVariable UUID publicId,
            Authentication authentication) {

        User user = userService.getCurrentUserEntity(authentication.getName());
        log.info("Resume activation request publicId={} userId={}", publicId, user.getId());

        resumeService.activateResume(publicId, user);
        return ApiResponse.success("Resume activated successfully", null);
    }

    /**
     * Soft delete a resume
     * 
     * DELETE /api/resumes/{publicId}
     * Business rule: Soft delete only (marks as DELETED, does not remove file)
     */
    @DeleteMapping("/{publicId}")
    public ApiResponse<Void> deleteResume(
            @PathVariable UUID publicId,
            Authentication authentication) {

        User user = userService.getCurrentUserEntity(authentication.getName());
        log.info("Resume deletion request publicId={} userId={}", publicId, user.getId());

        resumeService.softDeleteResume(publicId, user);
        return ApiResponse.success("Resume deleted successfully", null);
    }
}

