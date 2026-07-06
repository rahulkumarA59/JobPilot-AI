package com.jobpilotai.backend.candidateprofile.repository;

import com.jobpilotai.backend.candidateprofile.domain.CandidateProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateProjectRepository extends JpaRepository<CandidateProject, Long> {
}
