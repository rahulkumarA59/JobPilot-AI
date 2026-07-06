package com.jobpilotai.backend.candidateprofile.repository;

import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.resume.domain.Resume;
import com.jobpilotai.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {

    Optional<CandidateProfile> findByPublicId(UUID publicId);

    @Query("SELECT cp FROM CandidateProfile cp WHERE cp.user = :user AND cp.resume = :resume")
    Optional<CandidateProfile> findByUserAndResume(@Param("user") User user, @Param("resume") Resume resume);

    @Query("SELECT cp FROM CandidateProfile cp WHERE cp.user = :user")
    Optional<CandidateProfile> findLatestByUser(@Param("user") User user);
}
