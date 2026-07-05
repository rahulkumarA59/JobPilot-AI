package com.jobpilotai.backend.common.validation;

import com.jobpilotai.backend.common.constants.ValidationConstants;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = ValidFileSizeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidFileSize {

    String message() default "file size exceeds allowed limit";

    long maxBytes() default ValidationConstants.DEFAULT_MAX_FILE_SIZE_BYTES;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
