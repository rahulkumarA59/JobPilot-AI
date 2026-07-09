package com.jobpilotai.backend.ai.coverletter;

import com.jobpilotai.backend.ai.dto.CoverLetterTemplate;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.user.domain.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CoverLetterServiceTest {

    @Test
    void generateTemplate() {
        CoverLetterService service = new CoverLetterService();
        
        CandidateProfile p = new CandidateProfile();
        p.setCurrentRole("Backend Engineer");
        p.setTotalExperienceYears(4);
        User u = new User(); u.setFullName("John Doe");
        p.setUser(u);

        Job j = new Job();
        j.setTitle("Senior Java Dev");
        j.setExperienceLevel("Senior");
        Company c = new Company(); c.setName("TechCorp");
        j.setCompany(c);

        CoverLetterTemplate template = service.generateTemplate(p, j);

        assertEquals("SENIOR", template.getType());
        assertEquals("Authoritative", template.getTone());
        assertTrue(template.getContent().contains("TechCorp"));
        assertTrue(template.getContent().contains("Senior Java Dev"));
        assertTrue(template.getContent().contains("Backend Engineer"));
        assertTrue(template.getContent().contains("John Doe"));
    }
}
