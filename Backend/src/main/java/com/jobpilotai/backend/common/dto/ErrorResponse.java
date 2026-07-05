package com.jobpilotai.backend.common.dto;

import com.jobpilotai.backend.common.util.TraceUtils;
import com.jobpilotai.backend.exception.ErrorCode;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class ErrorResponse {

    ErrorCode errorCode;
    String message;
    List<?> details;
    Instant timestamp;
    String traceId;

    public static ErrorResponse of(ErrorCode errorCode, String message) {
        return of(errorCode, message, List.of());
    }

    public static ErrorResponse of(ErrorCode errorCode, String message, List<?> details) {
        return ErrorResponse.builder()
                .errorCode(errorCode)
                .message(message)
                .details(details == null ? List.of() : details)
                .timestamp(Instant.now())
                .traceId(TraceUtils.currentTraceId())
                .build();
    }
}
