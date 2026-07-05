package com.jobpilotai.backend.common.validation;

import com.jobpilotai.backend.common.constants.ValidationConstants;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidPasswordValidator implements ConstraintValidator<ValidPassword, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        boolean hasMinimumLength = value.length() >= ValidationConstants.PASSWORD_MIN_LENGTH;
        boolean hasUppercase = value.chars().anyMatch(Character::isUpperCase);
        boolean hasLowercase = value.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = value.chars().anyMatch(Character::isDigit);
        return hasMinimumLength && hasUppercase && hasLowercase && hasDigit;
    }
}
