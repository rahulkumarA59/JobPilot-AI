package com.jobpilotai.backend.resume.repository;

import com.jobpilotai.backend.resume.domain.Resume;
import com.jobpilotai.backend.resume.domain.ResumeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    Optional<Resume> findByPublicId(UUID publicId);

    List<Resume> findActiveByUser(com.jobpilotai.backend.user.domain.User user);

    List<Resume> findByUser(com.jobpilotai.backend.user.domain.User user);

    Optional<Resume> findByChecksum(String checksum);

    List<Resume> findByUserAndStatusNot(com.jobpilotai.backend.user.domain.User user, ResumeStatus status);

}


