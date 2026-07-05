package com.jobpilotai.backend.profile.dto;

import com.jobpilotai.backend.profile.domain.RemotePreference;

import java.math.BigDecimal;
import java.util.List;

public record UserProfileResponse(
        String publicId,
        String fullName,
        String email,
        String headline,
        String summary,
        String location,
        List<String> targetRoles,
        List<String> targetLocations,
        RemotePreference remotePreference,
        BigDecimal yearsExperience
) {
}
