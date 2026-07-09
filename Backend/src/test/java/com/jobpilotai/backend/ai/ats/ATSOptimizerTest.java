package com.jobpilotai.backend.ai.ats;

import com.jobpilotai.backend.ai.dto.ATSReport;
import com.jobpilotai.backend.candidateprofile.domain.CandidateExperience;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.candidateprofile.domain.CandidateSkill;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ATSOptimizerTest {

    @Test
    void optimize_perfectProfile() {
        ATSOptimizer optimizer = new ATSOptimizer();
        CandidateProfile p = new CandidateProfile();
        p.setSummary("Good sum");
        p.setExperiences(List.of(new CandidateExperience()));
        
        // 6 skills to hit the > 5 condition
        List<CandidateSkill> skills = IntStream.range(0, 6)
                .mapToObj(i -> new CandidateSkill())
                .collect(Collectors.toList());
        p.setSkills(skills);
        p.setTotalExperienceYears(3);

        ATSReport report = optimizer.optimize(p);

        assertEquals(100, report.getSectionScore());
        assertEquals(100, report.getExperienceScore());
        assertEquals(100, report.getSkillScore());
        assertEquals(90, report.getFormattingScore());
        assertEquals(80, report.getKeywordScore());
        
        assertEquals(94, report.getAtsScore()); // (100+100+100+90+80) / 5
        assertEquals(0, report.getSuggestions().size());
    }

    @Test
    void optimize_poorProfile() {
        ATSOptimizer optimizer = new ATSOptimizer();
        CandidateProfile p = new CandidateProfile();
        // Null summary, no experience, no skills
        
        ATSReport report = optimizer.optimize(p);
        
        assertEquals(0, report.getSectionScore()); // 100 - 20 - 40 - 40
        assertEquals(50, report.getExperienceScore());
        assertEquals(50, report.getSkillScore());
        assertEquals(3, report.getSuggestions().size());
        
        // (0 + 90 + 50 + 50 + 80) / 5 = 54
        assertEquals(54, report.getAtsScore());
    }
}
