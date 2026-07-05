package com.jobpilotai.backend.user.dto;

import java.time.Instant;

public record UserResponse(
        String publicId,
        String fullName,
        String email,
        String role,
        String status,
        boolean emailVerified,
        Instant lastLoginAt
) {
}
