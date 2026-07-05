package com.jobpilotai.backend.profile.service;

import com.jobpilotai.backend.profile.domain.UserProfile;
import com.jobpilotai.backend.profile.dto.UserProfileRequest;
import com.jobpilotai.backend.profile.dto.UserProfileResponse;
import com.jobpilotai.backend.profile.repository.UserProfileRepository;
import com.jobpilotai.backend.user.domain.User;
import com.jobpilotai.backend.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserService userService;

    public ProfileService(UserProfileRepository userProfileRepository, UserService userService) {
        this.userProfileRepository = userProfileRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        User user = userService.getByEmail(email);
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseGet(() -> newProfile(user));
        return toResponse(profile);
    }

    @Transactional
    public UserProfileResponse updateProfile(String email, UserProfileRequest request) {
        User user = userService.getByEmail(email);
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElseGet(() -> newProfile(user));
        profile.setHeadline(request.headline());
        profile.setSummary(request.summary());
        profile.setLocation(request.location());
        profile.setTargetRoles(copy(request.targetRoles()));
        profile.setTargetLocations(copy(request.targetLocations()));
        profile.setRemotePreference(request.remotePreference());
        profile.setYearsExperience(request.yearsExperience());
        return toResponse(userProfileRepository.save(profile));
    }

    @Transactional
    public UserProfile createEmptyProfile(User user) {
        return userProfileRepository.save(newProfile(user));
    }

    private UserProfile newProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        return profile;
    }

    private UserProfileResponse toResponse(UserProfile profile) {
        User user = profile.getUser();
        return new UserProfileResponse(
                user.getPublicId(),
                user.getFullName(),
                user.getEmail(),
                profile.getHeadline(),
                profile.getSummary(),
                profile.getLocation(),
                List.copyOf(profile.getTargetRoles()),
                List.copyOf(profile.getTargetLocations()),
                profile.getRemotePreference(),
                profile.getYearsExperience()
        );
    }

    private List<String> copy(List<String> values) {
        return values == null ? new ArrayList<>() : new ArrayList<>(values);
    }
}
