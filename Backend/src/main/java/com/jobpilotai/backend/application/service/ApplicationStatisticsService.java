package com.jobpilotai.backend.application.service;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationStage;
import com.jobpilotai.backend.application.dto.ApplicationStatistics;
import com.jobpilotai.backend.application.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicationStatisticsService {

    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public ApplicationStatistics getStatisticsForCandidate(Long candidateProfileId) {
        List<Application> apps = applicationRepository.findByCandidateProfileId(candidateProfileId);

        ApplicationStatistics stats = new ApplicationStatistics();
        stats.setTotalApplications(apps.size());

        Map<String, Integer> distribution = new HashMap<>();
        
        int applied = 0;
        int inProgress = 0;
        int failed = 0;
        int successful = 0;

        for (Application app : apps) {
            String stageStr = app.getStage().name();
            distribution.put(stageStr, distribution.getOrDefault(stageStr, 0) + 1);

            switch (app.getStage()) {
                case APPLIED, APPLICATION_CONFIRMED -> applied++;
                case ASSESSMENT, INTERVIEW, OFFER -> inProgress++;
                case FAILED, REJECTED, WITHDRAWN -> failed++;
                case HIRED -> successful++;
                default -> {} // QUEUED, READY, PREPARING, READY_TO_APPLY, APPLYING
            }
        }

        stats.setApplied(applied);
        stats.setInProgress(inProgress);
        stats.setFailed(failed);
        stats.setSuccessful(successful);
        stats.setStageDistribution(distribution);

        return stats;
    }
}
