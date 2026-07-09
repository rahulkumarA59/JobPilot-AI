package com.jobpilotai.backend.ai.matching;

import com.jobpilotai.backend.ai.dto.MatchResult;
import com.jobpilotai.backend.ai.dto.SkillGap;
import com.jobpilotai.backend.ai.explainability.ExplainabilityService;
import com.jobpilotai.backend.ai.rules.ScoringRules;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.enums.RemoteType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ATSMatchingServiceTest {

    @Mock private SkillGapAnalyzer skillGapAnalyzer;
    
    private ATSMatchingService matchingService;
    private ScoringRules rules;

    @BeforeEach
    void setUp() {
        rules = new ScoringRules();
        matchingService = new ATSMatchingService(rules, skillGapAnalyzer, new ExplainabilityService());
    }

    @Test
    void calculateMatch_fullMatch() {
        CandidateProfile candidate = new CandidateProfile();
        candidate.setId(1L);
        candidate.setTotalExperienceYears(5);
        candidate.setCurrentLocation("New York");
        candidate.setExpectedSalary(90000L);
        candidate.setPreferredLocations("Remote");

        Job job = new Job();
        job.setId(10L);
        job.setExperienceLevel("Senior");
        job.setLocation("New York");
        job.setSalaryMax(100000L);
        job.setRemoteType(RemoteType.REMOTE);

        SkillGap mockGap = SkillGap.builder()
                .missingSkills(List.of())
                .strongSkills(List.of("Java", "Spring"))
                .build();
        when(skillGapAnalyzer.analyzeSkillGap(any(), any())).thenReturn(mockGap);

        MatchResult result = matchingService.calculateMatch(candidate, job);

        assertEquals(100, result.getSkillScore());
        assertEquals(100, result.getExperienceScore());
        assertEquals(100, result.getLocationScore());
        assertEquals(100, result.getSalaryScore());
        assertEquals(100, result.getRemoteScore());
        assertEquals(100, result.getOverallScore());
    }

    @Test
    void calculateMatch_partialMatch() {
        CandidateProfile candidate = new CandidateProfile();
        candidate.setId(1L);
        candidate.setTotalExperienceYears(2); // needs 5 (Senior)
        candidate.setCurrentLocation("Boston"); // Job is NY
        candidate.setExpectedSalary(120000L); // Job is 100k
        candidate.setPreferredLocations("Remote");

        Job job = new Job();
        job.setId(10L);
        job.setExperienceLevel("Senior");
        job.setLocation("New York");
        job.setSalaryMax(100000L);
        job.setRemoteType(RemoteType.ONSITE); // Candidate wants remote

        SkillGap mockGap = SkillGap.builder()
                .missingSkills(List.of("AWS"))
                .strongSkills(List.of("Java")) // 1 out of total
                .build();
        when(skillGapAnalyzer.analyzeSkillGap(any(), any())).thenReturn(mockGap);

        MatchResult result = matchingService.calculateMatch(candidate, job);

        // Experience score should be (2/5) * 100 = 40
        assertEquals(40, result.getExperienceScore());
        assertEquals(50, result.getLocationScore());
        assertEquals(50, result.getSalaryScore());
        assertEquals(0, result.getRemoteScore());
    }
}
