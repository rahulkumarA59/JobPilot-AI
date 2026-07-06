package com.jobpilotai.backend.candidateprofile.repository;

import com.jobpilotai.backend.candidateprofile.domain.CandidateExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateExperienceRepository extends JpaRepository<CandidateExperience, Long> {
}
