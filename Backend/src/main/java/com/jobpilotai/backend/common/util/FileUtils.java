package com.jobpilotai.backend.common.util;

import org.springframework.web.multipart.MultipartFile;

import java.util.Locale;
import java.util.Optional;

public final class FileUtils {

    private FileUtils() {
    }

    public static Optional<String> extension(String filename) {
        if (!StringUtils.hasText(filename)) {
            return Optional.empty();
        }
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            return Optional.empty();
        }
        return Optional.of(filename.substring(dotIndex + 1).toLowerCase(Locale.ROOT));
    }

    public static Optional<String> extension(MultipartFile file) {
        if (file == null) {
            return Optional.empty();
        }
        return extension(file.getOriginalFilename());
    }

    public static boolean hasSizeWithin(MultipartFile file, long maxBytes) {
        return file != null && !file.isEmpty() && file.getSize() <= maxBytes;
    }
}
