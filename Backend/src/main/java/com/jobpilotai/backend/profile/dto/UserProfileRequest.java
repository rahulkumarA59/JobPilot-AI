package com.jobpilotai.backend.profile.dto;

import com.jobpilotai.backend.profile.domain.RemotePreference;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record UserProfileRequest(
        @Size(max = 255) String headline,
        String summary,
        @Size(max = 150) String location,
        List<@Size(max = 150) String> targetRoles,
        List<@Size(max = 150) String> targetLocations,
        RemotePreference remotePreference,
        @DecimalMin("0.0") BigDecimal yearsExperience
) {
}
