package com.jobpilotai.backend.auth.controller;

import com.jobpilotai.backend.auth.dto.LoginRequest;
import com.jobpilotai.backend.auth.dto.LoginResponse;
import com.jobpilotai.backend.auth.dto.LogoutRequest;
import com.jobpilotai.backend.auth.dto.RefreshTokenRequest;
import com.jobpilotai.backend.auth.dto.RefreshTokenResponse;
import com.jobpilotai.backend.auth.dto.RegisterRequest;
import com.jobpilotai.backend.auth.dto.RegisterResponse;
import com.jobpilotai.backend.auth.service.AuthenticationService;
import com.jobpilotai.backend.common.dto.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("Registration completed successfully", authenticationService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login completed successfully", authenticationService.login(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<RefreshTokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success("Token refreshed successfully", authenticationService.refresh(request));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@Valid @RequestBody LogoutRequest request) {
        authenticationService.logout(request.refreshToken());
        return ApiResponse.success("Logout completed successfully", null);
    }
}
