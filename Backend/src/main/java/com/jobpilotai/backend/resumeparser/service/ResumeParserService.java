package com.jobpilotai.backend.resumeparser.service;

import com.jobpilotai.backend.resumeparser.dto.ResumeParserResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Main Resume Parser Service.
 * Orchestrates the parsing of uploaded resume files.
 * Uses deterministic, rule-based parsing (no AI/ML).
 */
@Service
public class ResumeParserService {

    private static final Logger log = LoggerFactory.getLogger(ResumeParserService.class);

    private final ResumeTextExtractor textExtractor;
    private final ResumeSectionDetector sectionDetector;
    private final SkillExtractor skillExtractor;
    private final EducationExtractor educationExtractor;
    private final ExperienceExtractor experienceExtractor;
    private final ProjectExtractor projectExtractor;

    public ResumeParserService(
            ResumeTextExtractor textExtractor,
            ResumeSectionDetector sectionDetector,
            SkillExtractor skillExtractor,
            EducationExtractor educationExtractor,
            ExperienceExtractor experienceExtractor,
            ProjectExtractor projectExtractor) {
        this.textExtractor = textExtractor;
        this.sectionDetector = sectionDetector;
        this.skillExtractor = skillExtractor;
        this.educationExtractor = educationExtractor;
        this.experienceExtractor = experienceExtractor;
        this.projectExtractor = projectExtractor;
    }

    /**
     * Parse uploaded resume file
     *
     * @param file Uploaded resume file (PDF or DOCX)
     * @return Structured resume data
     */
    public ResumeParserResult parseResume(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file cannot be empty");
        }

        log.info("Starting resume parsing for file: {}", file.getOriginalFilename());

        try {
            // Step 1: Extract raw text from file
            String rawText = textExtractor.extractText(file);
            log.debug("Extracted raw text: {} characters", rawText.length());

            // Step 2: Normalize text
            String normalizedText = textExtractor.normalizeText(rawText);
            log.debug("Normalized text: {} characters", normalizedText.length());

            // Step 3: Initialize result
            ResumeParserResult result = new ResumeParserResult();
            result.setRawText(normalizedText);

            // Step 4: Extract summary
            String summary = sectionDetector.extractSummary(normalizedText);
            result.setSummary(summary);
            log.debug("Extracted summary: {}", summary != null ? summary.length() + " chars" : "null");

            // Step 5: Extract skills
            var skills = skillExtractor.extractSkills(normalizedText);
            result.setSkills(skills);
            log.debug("Extracted {} skills", skills.size());

            // Step 6: Extract education
            var education = educationExtractor.extractEducation(normalizedText);
            result.setEducation(education);
            log.debug("Extracted {} education entries", education.size());

            // Step 7: Extract work experience
            var experience = experienceExtractor.extractExperience(normalizedText);
            result.setExperience(experience);
            log.debug("Extracted {} work experiences", experience.size());

            // Step 8: Extract projects
            var projects = projectExtractor.extractProjects(normalizedText);
            result.setProjects(projects);
            log.debug("Extracted {} projects", projects.size());

            // Step 9: Extract certifications and languages (placeholder for V1)
            // These can be enhanced in future versions
            result.setCertifications(extractCertifications(normalizedText));
            result.setLanguages(extractLanguages(normalizedText));

            log.info("Resume parsing completed successfully for file: {}", file.getOriginalFilename());
            return result;

        } catch (IOException e) {
            log.error("Failed to parse resume file", e);
            throw new IOException("Failed to parse resume file", e);
        }
    }

    /**
     * Extract certifications from resume text (basic implementation)
     */
    private java.util.List<ResumeParserResult.CertificationDto> extractCertifications(String text) {
        java.util.List<ResumeParserResult.CertificationDto> certifications = new java.util.ArrayList<>();

        String[] keywords = {
                "aws certified", "docker certified", "kubernetes certified",
                "microsoft certified", "oracle certified", "iso",
                "scrum master", "certified", "certification"
        };

        String lowerText = text.toLowerCase();
        for (String keyword : keywords) {
            if (lowerText.contains(keyword)) {
                ResumeParserResult.CertificationDto cert = new ResumeParserResult.CertificationDto();
                cert.setName(keyword);
                certifications.add(cert);
            }
        }

        return certifications;
    }

    /**
     * Extract languages from resume text (basic implementation)
     */
    private java.util.List<String> extractLanguages(String text) {
        java.util.List<String> languages = new java.util.ArrayList<>();

        String[] commonLanguages = {
                "english", "spanish", "french", "german", "chinese", "japanese",
                "hindi", "russian", "portuguese", "italian", "korean", "arabic"
        };

        String lowerText = text.toLowerCase();
        for (String language : commonLanguages) {
            if (lowerText.contains(language)) {
                languages.add(language);
            }
        }

        return languages;
    }
}
