package com.jobpilotai.backend.auth.service;

import com.jobpilotai.backend.auth.domain.RefreshToken;
import com.jobpilotai.backend.auth.dto.LoginRequest;
import com.jobpilotai.backend.auth.dto.LoginResponse;
import com.jobpilotai.backend.auth.dto.RefreshTokenRequest;
import com.jobpilotai.backend.auth.dto.RefreshTokenResponse;
import com.jobpilotai.backend.auth.dto.RegisterRequest;
import com.jobpilotai.backend.auth.dto.RegisterResponse;
import com.jobpilotai.backend.profile.service.ProfileService;
import com.jobpilotai.backend.security.service.JwtService;
import com.jobpilotai.backend.user.domain.Role;
import com.jobpilotai.backend.user.domain.User;
import com.jobpilotai.backend.user.domain.UserStatus;
import com.jobpilotai.backend.user.repository.RoleRepository;
import com.jobpilotai.backend.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class AuthenticationService {

    private static final String DEFAULT_ROLE = "ROLE_USER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final ProfileService profileService;

    public AuthenticationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            ProfileService profileService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.profileService = profileService;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        Role role = roleRepository.findByName(DEFAULT_ROLE)
                .orElseThrow(() -> new IllegalStateException("Default user role is missing"));

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);
        profileService.createEmptyProfile(savedUser);

        return new RegisterResponse(
                savedUser.getPublicId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().getName(),
                savedUser.getStatus().name()
        );
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
        );

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException("User account is not active");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.create(user);
        return new LoginResponse(accessToken, refreshToken, "Bearer", jwtService.accessTokenSeconds());
    }

    @Transactional
    public RefreshTokenResponse refresh(RefreshTokenRequest request) {
        RefreshToken oldToken = refreshTokenService.verify(request.refreshToken());
        User user = oldToken.getUser();
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException("User account is not active");
        }
        refreshTokenService.revoke(oldToken);
        String accessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = refreshTokenService.create(user);
        return new RefreshTokenResponse(accessToken, newRefreshToken, "Bearer", jwtService.accessTokenSeconds());
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
    }
}
