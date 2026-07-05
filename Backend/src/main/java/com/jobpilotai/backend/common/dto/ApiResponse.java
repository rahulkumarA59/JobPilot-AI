package com.jobpilotai.backend.common.dto;

import com.jobpilotai.backend.common.util.TraceUtils;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class ApiResponse<T> {

    boolean success;
    String message;
    T data;
    Instant timestamp;
    String traceId;

    public static <T> ApiResponse<T> success(T data) {
        return success("Request completed successfully", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .traceId(TraceUtils.currentTraceId())
                .build();
    }
}
