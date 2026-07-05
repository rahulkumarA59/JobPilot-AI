package com.jobpilotai.backend.common.util;

import java.util.Collection;

public final class ValidationUtils {

    private ValidationUtils() {
    }

    public static boolean isEmailLike(String value) {
        return StringUtils.hasText(value) && value.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    }

    public static boolean isBetween(long value, long min, long max) {
        return value >= min && value <= max;
    }

    public static boolean isPresent(Collection<?> values) {
        return values != null && !values.isEmpty();
    }
}
