package com.jobpilotai.backend.common.constants;

import java.util.Set;

public final class ValidationConstants {

    public static final int PASSWORD_MIN_LENGTH = 8;
    public static final long DEFAULT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
    public static final Set<String> DEFAULT_ALLOWED_FILE_TYPES = Set.of("pdf", "doc", "docx");

    private ValidationConstants() {
    }
}
