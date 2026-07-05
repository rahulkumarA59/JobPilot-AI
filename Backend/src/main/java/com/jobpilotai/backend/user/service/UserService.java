package com.jobpilotai.backend.user.service;

import com.jobpilotai.backend.user.domain.User;
import com.jobpilotai.backend.user.dto.UserResponse;
import com.jobpilotai.backend.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        return toResponse(getByEmail(email));
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getPublicId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName(),
                user.getStatus().name(),
                user.isEmailVerified(),
                user.getLastLoginAt()
        );
    }
}
