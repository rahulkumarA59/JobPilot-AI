package com.jobpilotai.backend.ai.learning;

import com.jobpilotai.backend.ai.dto.LearningRoadmap;
import com.jobpilotai.backend.ai.dto.SkillGap;
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
class LearningRoadmapServiceTest {

    @Mock private SkillGapAnalyzer analyzer;
    @InjectMocks private LearningRoadmapService service;

    @Test
    void generateRoadmap_withGaps() {
        SkillGap gap = SkillGap.builder().missingSkills(List.of("Java", "AWS")).build();
        when(analyzer.analyzeSkillGap(any(), any())).thenReturn(gap);

        LearningRoadmap map = service.generateRoadmap(new CandidateProfile(), new Job());

        assertEquals(2, map.getDailyTasks().size());
        assertEquals(1, map.getWeeklyGoals().size());
        assertEquals(1, map.getMonthlyGoals().size());
        assertTrue(map.getMonthlyGoals().get(0).contains("Java and AWS"));
        
        assertEquals(2, map.getRecommendedCourses().size());
        assertEquals(2, map.getPracticeProblems().size());
        assertEquals(1, map.getCertificationPath().size()); // AWS triggers cert
    }
}
