package com.jobpilotai.backend.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

public class ValidFileSizeValidator implements ConstraintValidator<ValidFileSize, MultipartFile> {

    private long maxBytes;

    @Override
    public void initialize(ValidFileSize constraintAnnotation) {
        this.maxBytes = constraintAnnotation.maxBytes();
    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        return file == null || file.isEmpty() || file.getSize() <= maxBytes;
    }
}
