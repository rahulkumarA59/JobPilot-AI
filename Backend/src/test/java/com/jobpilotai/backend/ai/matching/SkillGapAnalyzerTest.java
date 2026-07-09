package com.jobpilotai.backend.ai.matching;

import com.jobpilotai.backend.ai.dto.SkillGap;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.candidateprofile.domain.CandidateSkill;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.domain.JobSkill;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SkillGapAnalyzerTest {

    private SkillGapAnalyzer analyzer;

    @BeforeEach
    void setUp() {
        analyzer = new SkillGapAnalyzer();
    }

    @Test
    void analyzeSkillGap() {
        CandidateProfile candidate = new CandidateProfile();
        CandidateSkill java = new CandidateSkill();
        java.setSkillName("Java");
        java.setProficiency(CandidateSkill.Proficiency.ADVANCED);
        
        CandidateSkill spring = new CandidateSkill();
        spring.setSkillName("Spring");
        spring.setProficiency(CandidateSkill.Proficiency.BEGINNER);
        candidate.setSkills(List.of(java, spring));

        Job job = new Job();
        JobSkill javaReq = new JobSkill();
        javaReq.setSkillName("Java");
        
        JobSkill springReq = new JobSkill();
        springReq.setSkillName("Spring");
        
        JobSkill awsReq = new JobSkill();
        awsReq.setSkillName("AWS");
        job.setSkills(List.of(javaReq, springReq, awsReq));

        SkillGap gap = analyzer.analyzeSkillGap(candidate, job);

        assertEquals(1, gap.getMissingSkills().size());
        assertEquals("aws", gap.getMissingSkills().get(0));
        
        assertEquals(2, gap.getStrongSkills().size());
        
        assertEquals(1, gap.getWeakSkills().size());
        assertEquals("Spring", gap.getWeakSkills().get(0));
        
        assertEquals(33, gap.getPriorityScore());
        assertEquals("Easy", gap.getLearningDifficulty());
        assertEquals(2, gap.getEstimatedLearningTimeWeeks());
    }
}
