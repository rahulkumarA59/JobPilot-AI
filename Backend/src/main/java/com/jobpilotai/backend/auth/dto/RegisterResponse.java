package com.jobpilotai.backend.auth.dto;

public record RegisterResponse(
        String publicId,
        String fullName,
        String email,
        String role,
        String status
) {
}
