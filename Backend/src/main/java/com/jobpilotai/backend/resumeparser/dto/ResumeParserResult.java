package com.jobpilotai.backend.resumeparser.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Structured resume data extracted from parsed resume.
 * Contains sections and entities identified in the resume text.
 */
@Getter
@Setter
public class ResumeParserResult {

    private String rawText;

    private String summary;

    private List<SkillDto> skills = new ArrayList<>();

    private List<EducationDto> education = new ArrayList<>();

    private List<ExperienceDto> experience = new ArrayList<>();

    private List<ProjectDto> projects = new ArrayList<>();

    private List<CertificationDto> certifications = new ArrayList<>();

    private List<String> languages = new ArrayList<>();

    /**
     * Skill information
     */
    @Getter
    @Setter
    public static class SkillDto {
        private String name;
        private String category; // Technical, Language, Framework, Tool, etc.
        private Integer relevanceScore; // 0-100
    }

    /**
     * Education information
     */
    @Getter
    @Setter
    public static class EducationDto {
        private String degree;
        private String field;
        private String institution;
        private Integer graduationYear;
        private Double cgpa;
        private String grade;
    }

    /**
     * Work experience information
     */
    @Getter
    @Setter
    public static class ExperienceDto {
        private String company;
        private String designation;
        private String startDate;
        private String endDate;
        private String duration; // e.g., "2 years 3 months"
        private String description;
        private List<String> technologies = new ArrayList<>();
    }

    /**
     * Project information
     */
    @Getter
    @Setter
    public static class ProjectDto {
        private String title;
        private String description;
        private List<String> technologies = new ArrayList<>();
        private String startDate;
        private String endDate;
        private String url;
    }

    /**
     * Certification information
     */
    @Getter
    @Setter
    public static class CertificationDto {
        private String name;
        private String issuedBy;
        private Integer issuedYear;
        private String credentialId;
        private String credentialUrl;
    }
}
