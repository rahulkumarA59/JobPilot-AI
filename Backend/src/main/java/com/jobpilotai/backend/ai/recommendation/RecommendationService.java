package com.jobpilotai.backend.ai.recommendation;

import com.jobpilotai.backend.ai.dto.LearningRoadmap;
import com.jobpilotai.backend.ai.dto.RankedJob;
import com.jobpilotai.backend.ai.dto.Recommendation;
import com.jobpilotai.backend.ai.dto.TailoredResumeSuggestion;
import com.jobpilotai.backend.ai.learning.LearningRoadmapService;
import com.jobpilotai.backend.ai.ranking.JobRankingService;
import com.jobpilotai.backend.ai.tailoring.ResumeTailoringService;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Job;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Orchestrates multiple AI engines to generate a holistic recommendation payload.
 */
@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final JobRankingService jobRankingService;
    private final LearningRoadmapService learningRoadmapService;
    private final ResumeTailoringService resumeTailoringService;

    public RecommendationService(JobRankingService jobRankingService,
                                 LearningRoadmapService learningRoadmapService,
                                 ResumeTailoringService resumeTailoringService) {
        this.jobRankingService = jobRankingService;
        this.learningRoadmapService = learningRoadmapService;
        this.resumeTailoringService = resumeTailoringService;
    }

    public Recommendation generateRecommendation(CandidateProfile candidate, List<Job> availableJobs) {
        log.info("Generating AI Recommendation for Candidate {}", candidate.getId());
        
        List<RankedJob> topJobs = jobRankingService.rankJobs(candidate, availableJobs)
                .stream()
                .limit(5)
                .collect(Collectors.toList());

        List<String> topCompanies = topJobs.stream()
                .map(RankedJob::getCompanyName)
                .distinct()
                .collect(Collectors.toList());

        LearningRoadmap roadmap = null;
        List<String> resumeImprovements = List.of();
        List<String> projects = List.of("Build a portfolio project", "Contribute to Open Source");
        
        if (!availableJobs.isEmpty()) {
            Job targetJob = availableJobs.get(0);
            roadmap = learningRoadmapService.generateRoadmap(candidate, targetJob);
            TailoredResumeSuggestion tailoring = resumeTailoringService.generateTailoringSuggestions(candidate, targetJob);
            resumeImprovements = tailoring.getSectionImprovements();
        }

        log.info("Recommendation Generated: {} jobs ranked", topJobs.size());

        return Recommendation.builder()
                .topJobs(topJobs)
                .topCompanies(topCompanies)
                .learningRoadmap(roadmap)
                .resumeImprovements(resumeImprovements)
                .recommendedProjects(projects)
                .recommendedCertifications(roadmap != null ? roadmap.getCertificationPath() : List.of())
                .build();
    }
}
