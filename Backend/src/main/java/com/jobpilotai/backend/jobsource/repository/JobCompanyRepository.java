package com.jobpilotai.backend.jobsource.repository;

import com.jobpilotai.backend.jobsource.domain.JobCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobCompanyRepository extends JpaRepository<JobCompany, Long> {

    Optional<JobCompany> findByPublicId(UUID publicId);

    Optional<JobCompany> findByName(String name);

    Optional<JobCompany> findByWebsite(String website);

    @Query("SELECT jc FROM JobCompany jc WHERE LOWER(jc.name) = LOWER(:name)")
    Optional<JobCompany> findByNameIgnoreCase(@Param("name") String name);
}
