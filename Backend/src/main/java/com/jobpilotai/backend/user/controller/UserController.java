package com.jobpilotai.backend.user.controller;

import com.jobpilotai.backend.common.dto.ApiResponse;
import com.jobpilotai.backend.profile.dto.UserProfileRequest;
import com.jobpilotai.backend.profile.dto.UserProfileResponse;
import com.jobpilotai.backend.profile.service.ProfileService;
import com.jobpilotai.backend.user.dto.UserResponse;
import com.jobpilotai.backend.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ProfileService profileService;

    public UserController(UserService userService, ProfileService profileService) {
        this.userService = userService;
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> me(Authentication authentication) {
        return ApiResponse.success(userService.getCurrentUser(authentication.getName()));
    }

    @PutMapping("/profile")
    public ApiResponse<UserProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileRequest request) {
        return ApiResponse.success("Profile updated successfully", profileService.updateProfile(authentication.getName(), request));
    }
}
