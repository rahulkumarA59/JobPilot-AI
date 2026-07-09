package com.jobpilotai.backend.jobsource.repository;

import com.jobpilotai.backend.jobsource.domain.JobPosting;
import com.jobpilotai.backend.jobsource.domain.JobSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    Optional<JobPosting> findByPublicId(UUID publicId);

    @Query("SELECT jp FROM JobPosting jp WHERE jp.source = :source AND jp.externalJobId = :externalJobId")
    Optional<JobPosting> findBySourceAndExternalJobId(@Param("source") JobSource source,
                                                       @Param("externalJobId") String externalJobId);

    Optional<JobPosting> findByChecksum(String checksum);

    @Query("SELECT jp FROM JobPosting jp WHERE jp.active = true AND jp.expiresDate >= CURRENT_DATE ORDER BY jp.postedDate DESC")
    Page<JobPosting> findActiveJobs(Pageable pageable);

    @Query("SELECT jp FROM JobPosting jp WHERE jp.active = true AND jp.title LIKE %:keyword% ORDER BY jp.postedDate DESC")
    Page<JobPosting> searchJobs(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT jp FROM JobPosting jp WHERE jp.active = true AND jp.location LIKE %:location% ORDER BY jp.postedDate DESC")
    Page<JobPosting> findByLocation(@Param("location") String location, Pageable pageable);

    @Query("SELECT jp FROM JobPosting jp WHERE jp.active = true AND jp.postedDate >= :date ORDER BY jp.postedDate DESC")
    Page<JobPosting> findRecentJobs(@Param("date") LocalDate date, Pageable pageable);
}
