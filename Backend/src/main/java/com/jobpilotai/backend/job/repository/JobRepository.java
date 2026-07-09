package com.jobpilotai.backend.job.repository;

import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.enums.JobSource;
import com.jobpilotai.backend.job.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Optional<Job> findByPublicId(UUID publicId);

    @Query("SELECT j FROM Job j WHERE j.source = :source AND j.externalJobId = :externalJobId")
    Optional<Job> findBySourceAndExternalJobId(@Param("source") JobSource source,
                                                @Param("externalJobId") String externalJobId);

    Optional<Job> findByChecksum(String checksum);

    boolean existsByChecksum(String checksum);

    boolean existsBySourceAndExternalJobId(JobSource source, String externalJobId);

    @Query("SELECT j FROM Job j WHERE j.status = :status ORDER BY j.postedDate DESC")
    Page<Job> findByStatus(@Param("status") JobStatus status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' ORDER BY j.postedDate DESC")
    Page<Job> findActiveJobs(Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.company.id = :companyId ORDER BY j.postedDate DESC")
    Page<Job> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);
}
