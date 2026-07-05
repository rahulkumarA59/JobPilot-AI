package com.jobpilotai.backend.common.validation;

import com.jobpilotai.backend.common.util.FileUtils;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

public class ValidFileTypeValidator implements ConstraintValidator<ValidFileType, MultipartFile> {

    private Set<String> allowedExtensions;

    @Override
    public void initialize(ValidFileType constraintAnnotation) {
        allowedExtensions = Arrays.stream(constraintAnnotation.allowed())
                .map(extension -> extension.toLowerCase(Locale.ROOT))
                .collect(Collectors.toUnmodifiableSet());
    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null || file.isEmpty()) {
            return true;
        }
        return FileUtils.extension(file)
                .map(allowedExtensions::contains)
                .orElse(false);
    }
}
