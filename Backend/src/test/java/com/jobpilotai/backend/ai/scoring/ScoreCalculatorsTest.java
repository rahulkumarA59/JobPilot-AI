package com.jobpilotai.backend.ai.scoring;

import com.jobpilotai.backend.ai.dto.CandidateScore;
import com.jobpilotai.backend.ai.dto.CompanyScore;
import com.jobpilotai.backend.candidateprofile.domain.CandidateExperience;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.candidateprofile.domain.CandidateSkill;
import com.jobpilotai.backend.job.domain.Company;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ScoreCalculatorsTest {

    @Test
    void candidateScoreCalculator() {
        CandidateScoreCalculator calc = new CandidateScoreCalculator();
        CandidateProfile p = new CandidateProfile();
        p.setSummary("Great dev");
        p.setCurrentRole("Dev");
        p.setExperiences(List.of(new CandidateExperience()));
        p.setSkills(List.of(new CandidateSkill()));
        p.setHighestEducation("BS");

        CandidateScore score = calc.calculateScore(p);
        
        assertEquals(100, score.getProfileQuality());
        assertEquals(100, score.getApplicationReadiness());
        assertEquals(100, score.getReadinessScore());
        assertEquals(100, score.getCandidateScore());
    }

    @Test
    void companyScoreCalculator() {
        CompanyScoreCalculator calc = new CompanyScoreCalculator();
        Company c = new Company();
        c.setSize("1-10");
        
        CompanyScore score = calc.calculateScore(c);
        
        assertEquals(70, score.getHiringProbability());
        assertEquals("Low", score.getCompetitionLevel());
        assertEquals(90, score.getCareerGrowth());
        assertEquals("Easy", score.getInterviewDifficulty());
    }
}
