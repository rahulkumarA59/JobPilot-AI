package com.jobpilotai.backend.resume.dto;

import com.jobpilotai.backend.common.validation.ValidFileSize;
import com.jobpilotai.backend.common.validation.ValidFileType;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;

public record UploadResumeRequest(
        @NotNull(message = "Resume file is required")
        @ValidFileType(allowed = {"pdf", "doc", "docx"}, message = "Only PDF, DOC, DOCX files are allowed")
        @ValidFileSize(maxBytes = 5242880, message = "File size must not exceed 5 MB")
        MultipartFile file
) {
}

