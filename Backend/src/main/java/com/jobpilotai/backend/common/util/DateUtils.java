package com.jobpilotai.backend.common.util;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

public final class DateUtils {

    private DateUtils() {
    }

    public static Instant nowUtc() {
        return Instant.now();
    }

    public static LocalDateTime toUtcLocalDateTime(Instant instant) {
        if (instant == null) {
            return null;
        }
        return LocalDateTime.ofInstant(instant, ZoneOffset.UTC);
    }

    public static Instant fromLocalDateTime(LocalDateTime dateTime, ZoneId zoneId) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.atZone(zoneId == null ? ZoneOffset.UTC : zoneId).toInstant();
    }
}
