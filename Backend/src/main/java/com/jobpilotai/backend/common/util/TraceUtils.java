package com.jobpilotai.backend.common.util;

import org.slf4j.MDC;

import java.util.UUID;

public final class TraceUtils {

    public static final String TRACE_ID_KEY = "traceId";

    private TraceUtils() {
    }

    public static String currentTraceId() {
        String traceId = MDC.get(TRACE_ID_KEY);
        if (StringUtils.hasText(traceId)) {
            return traceId;
        }
        return createTraceId();
    }

    public static String createTraceId() {
        return UUID.randomUUID().toString();
    }
}
