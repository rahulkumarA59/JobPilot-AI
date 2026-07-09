package com.jobpilotai.backend.application.repository;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByPublicId(UUID publicId);

    List<Application> findByCandidateProfileId(Long candidateProfileId);

    boolean existsByCandidateProfileIdAndJobId(Long candidateProfileId, Long jobId);

    List<Application> findByStage(ApplicationStage stage);

    @Query("SELECT a FROM Application a WHERE a.stage IN :stages ORDER BY a.score DESC, a.priority ASC")
    List<Application> findByStageInOrderByScoreDescPriorityAsc(List<ApplicationStage> stages);

    List<Application> findByStageAndLastUpdatedBefore(ApplicationStage stage, Instant lastUpdated);
}
