package com.jobpilotai.backend.ai.tailoring;

import com.jobpilotai.backend.ai.dto.SkillGap;
import com.jobpilotai.backend.ai.dto.TailoredResumeSuggestion;
import com.jobpilotai.backend.ai.matching.SkillGapAnalyzer;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Job;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResumeTailoringServiceTest {

    @Mock private SkillGapAnalyzer skillGapAnalyzer;
    @InjectMocks private ResumeTailoringService tailoringService;

    @Test
    void generateTailoringSuggestions() {
        CandidateProfile profile = new CandidateProfile();
        Job job = new Job();
        job.setExperienceLevel("Senior");

        SkillGap gap = SkillGap.builder()
                .missingSkills(List.of("Kubernetes"))
                .strongSkills(List.of("Java", "Spring"))
                .recommendedSkills(List.of("Kubernetes", "AWS"))
                .build();
        when(skillGapAnalyzer.analyzeSkillGap(any(), any())).thenReturn(gap);

        TailoredResumeSuggestion suggestion = tailoringService.generateTailoringSuggestions(profile, job);

        assertEquals(1, suggestion.getMissingKeywords().size());
        assertEquals(2, suggestion.getRecommendedKeywords().size());
        assertEquals(0.1, suggestion.getKeywordDensity());
        
        assertEquals(1, suggestion.getSectionImprovements().size());
        assertTrue(suggestion.getSectionImprovements().get(0).contains("Kubernetes"));
        
        assertEquals(2, suggestion.getBulletPointSuggestions().size()); // Senior rules applied
    }
}
