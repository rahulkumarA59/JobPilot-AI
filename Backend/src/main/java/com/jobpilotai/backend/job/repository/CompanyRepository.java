package com.jobpilotai.backend.job.repository;

import com.jobpilotai.backend.job.domain.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByPublicId(UUID publicId);

    Optional<Company> findByName(String name);

    @Query("SELECT c FROM Company c WHERE LOWER(c.name) = LOWER(:name)")
    Optional<Company> findByNameIgnoreCase(@Param("name") String name);

    Optional<Company> findByWebsite(String website);
}
