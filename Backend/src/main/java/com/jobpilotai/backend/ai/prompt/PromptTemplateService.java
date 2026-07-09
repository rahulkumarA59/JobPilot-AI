package com.jobpilotai.backend.ai.prompt;

import com.jobpilotai.backend.ai.gateway.domain.PromptType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.Map;

@Slf4j
@Service
public class PromptTemplateService {

    private final Map<PromptType, String> templates = new EnumMap<>(PromptType.class);

    public PromptTemplateService() {
        templates.put(PromptType.RESUME_TAILORING,
                "You are a professional resume writer. Tailor the following resume for the target job position.\n\n" +
                "Resume:\n{{resume}}\n\nJob Description:\n{{jobDescription}}\n\nCompany:\n{{companyName}}\n\n" +
                "Generate a tailored resume that highlights relevant skills and experience.");

        templates.put(PromptType.COVER_LETTER,
                "You are a professional cover letter writer. Create a compelling cover letter.\n\n" +
                "Candidate:\n{{candidateName}}\n\nResume Summary:\n{{resumeSummary}}\n\nJob Title:\n{{jobTitle}}\n\n" +
                "Company:\n{{companyName}}\n\nJob Description:\n{{jobDescription}}\n\n" +
                "Write a professional, concise cover letter.");

        templates.put(PromptType.SKILL_GAP,
                "Analyze the skill gap between the candidate's profile and the target job.\n\n" +
                "Candidate Skills:\n{{candidateSkills}}\n\nRequired Skills:\n{{requiredSkills}}\n\n" +
                "Provide a detailed skill gap analysis with actionable recommendations.");

        templates.put(PromptType.LEARNING_ROADMAP,
                "Create a personalized learning roadmap based on the skill gap analysis.\n\n" +
                "Missing Skills:\n{{missingSkills}}\n\nTarget Role:\n{{targetRole}}\n\n" +
                "Include recommended courses, certifications, and timeline.");

        templates.put(PromptType.CAREER_ADVICE,
                "Provide career advice for the following candidate.\n\n" +
                "Profile:\n{{candidateProfile}}\n\nCareer Goals:\n{{careerGoals}}\n\n" +
                "Provide actionable career guidance.");

        templates.put(PromptType.RESUME_PARSING,
                "Extract structured data from the following resume text.\n\n" +
                "Resume Text:\n{{resumeText}}\n\n" +
                "Extract: name, email, phone, skills, experience, education.");

        templates.put(PromptType.JOB_MATCHING,
                "Score the match between the candidate profile and the job listing.\n\n" +
                "Candidate Profile:\n{{candidateProfile}}\n\nJob Listing:\n{{jobListing}}\n\n" +
                "Provide a match score and reasoning.");

        log.info("Loaded {} prompt templates", templates.size());
    }

    public String getTemplate(PromptType type) {
        String template = templates.get(type);
        if (template == null) {
            throw new IllegalArgumentException("No template found for type: " + type);
        }
        return template;
    }

    public String buildPrompt(PromptType type, Map<String, String> variables) {
        String template = getTemplate(type);
        String prompt = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            prompt = prompt.replace("{{" + entry.getKey() + "}}", entry.getValue() != null ? entry.getValue() : "");
        }
        log.debug("Built prompt for type {}, length: {}", type, prompt.length());
        return prompt;
    }
}
