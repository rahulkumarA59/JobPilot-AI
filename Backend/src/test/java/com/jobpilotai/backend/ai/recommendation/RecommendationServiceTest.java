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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock private JobRankingService rankingService;
    @Mock private LearningRoadmapService roadmapService;
    @Mock private ResumeTailoringService tailoringService;
    
    @InjectMocks private RecommendationService recommendationService;

    @Test
    void generateRecommendation() {
        CandidateProfile p = new CandidateProfile();
        Job j1 = new Job();
        Job j2 = new Job();

        RankedJob rj1 = RankedJob.builder().jobId(1L).companyName("C1").build();
        RankedJob rj2 = RankedJob.builder().jobId(2L).companyName("C2").build();

        when(rankingService.rankJobs(any(), any())).thenReturn(List.of(rj1, rj2));
        
        LearningRoadmap lr = LearningRoadmap.builder().certificationPath(List.of("AWS Cert")).build();
        when(roadmapService.generateRoadmap(any(), any())).thenReturn(lr);
        
        TailoredResumeSuggestion ts = TailoredResumeSuggestion.builder()
                .sectionImprovements(List.of("Add Java"))
                .build();
        when(tailoringService.generateTailoringSuggestions(any(), any())).thenReturn(ts);

        Recommendation rec = recommendationService.generateRecommendation(p, List.of(j1, j2));

        assertEquals(2, rec.getTopJobs().size());
        assertEquals(2, rec.getTopCompanies().size());
        assertNotNull(rec.getLearningRoadmap());
        assertEquals(1, rec.getResumeImprovements().size());
        assertEquals(2, rec.getRecommendedProjects().size());
        assertEquals(1, rec.getRecommendedCertifications().size());
    }
}
