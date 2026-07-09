package com.jobpilotai.backend.job.repository;

import com.jobpilotai.backend.job.domain.JobBenefit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobBenefitRepository extends JpaRepository<JobBenefit, Long> {

    List<JobBenefit> findByJobId(Long jobId);

    void deleteByJobId(Long jobId);
}
