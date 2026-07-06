package com.jobpilotai.backend.candidateprofile.service;

import com.jobpilotai.backend.candidateprofile.domain.*;
import com.jobpilotai.backend.candidateprofile.repository.CandidateProfileRepository;
import com.jobpilotai.backend.resumeparser.dto.ResumeParserResult;
import com.jobpilotai.backend.resume.domain.Resume;
import com.jobpilotai.backend.user.domain.User;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Builds and manages candidate profiles from resume parser results.
 * Transforms parsed resume data into normalized candidate profile entities.
 */
@Service
public class CandidateProfileBuilderService {

    private static final Logger log = LoggerFactory.getLogger(CandidateProfileBuilderService.class);

    private final CandidateProfileRepository profileRepository;
    private final ProfileStrengthCalculator strengthCalculator;
    private final CompletenessCalculator completenessCalculator;

    public CandidateProfileBuilderService(CandidateProfileRepository profileRepository,
                                          ProfileStrengthCalculator strengthCalculator,
                                          CompletenessCalculator completenessCalculator) {
        this.profileRepository = profileRepository;
        this.strengthCalculator = strengthCalculator;
        this.completenessCalculator = completenessCalculator;
    }

    /**
     * Build or update candidate profile from resume parser result.
     * Implements business rule: one active profile per active resume per user.
     */
    @Transactional
    public CandidateProfile buildProfile(User user, Resume resume, ResumeParserResult parserResult) {
        log.info("Building candidate profile for user: {} from resume: {}", user.getId(), resume.getId());

        // Check for existing profile
        CandidateProfile profile = profileRepository.findByUserAndResume(user, resume)
                .orElse(new CandidateProfile());

        // Set basic associations
        profile.setUser(user);
        profile.setResume(resume);

        // Extract and set profile metadata
        extractProfileMetadata(profile, parserResult);

        // Extract and set skills
        extractSkills(profile, parserResult);

        // Extract and set experiences
        extractExperiences(profile, parserResult);

        // Extract and set projects
        extractProjects(profile, parserResult);

        // Calculate scores
        profile.setProfileStrength(strengthCalculator.calculateStrength(profile));
        profile.setCompletenessScore(completenessCalculator.calculateCompleteness(profile));

        // Save profile
        profile = profileRepository.save(profile);

        log.info("Candidate profile built successfully. PublicId: {}, Strength: {}, Completeness: {}",
                profile.getPublicId(), profile.getProfileStrength(), profile.getCompletenessScore());

        return profile;
    }

    /**
     * Extract profile metadata from parser result
     */
    private void extractProfileMetadata(CandidateProfile profile, ResumeParserResult parserResult) {
        // Set headline from first experience or summary
        if (!parserResult.getExperience().isEmpty()) {
            var firstExp = parserResult.getExperience().get(0);
            profile.setCurrentRole(firstExp.getDesignation());
            profile.setCurrentCompany(firstExp.getCompany());
            profile.setHeadline(firstExp.getDesignation() + " at " + firstExp.getCompany());
        }

        // Set summary
        if (parserResult.getSummary() != null && !parserResult.getSummary().isBlank()) {
            profile.setSummary(parserResult.getSummary());
        }

        // Set education
        if (!parserResult.getEducation().isEmpty()) {
            var topEducation = parserResult.getEducation().get(0);
            String educationStr = (topEducation.getDegree() != null ? topEducation.getDegree() : "") +
                    (topEducation.getField() != null ? " in " + topEducation.getField() : "");
            if (!educationStr.isBlank()) {
                profile.setHighestEducation(educationStr);
            }
        }

        // Calculate total experience years
        Integer totalExpYears = calculateTotalExperienceYears(parserResult.getExperience());
        if (totalExpYears != null) {
            profile.setTotalExperienceYears(totalExpYears);
        }
    }

    /**
     * Extract skills from parser result and populate profile
     */
    private void extractSkills(CandidateProfile profile, ResumeParserResult parserResult) {
        // Clear existing skills
        profile.getSkills().clear();

        for (ResumeParserResult.SkillDto skillDto : parserResult.getSkills()) {
            CandidateSkill skill = new CandidateSkill();
            skill.setProfile(profile);
            skill.setSkillName(skillDto.getName());
            skill.setCategory(skillDto.getCategory() != null ? skillDto.getCategory() : "Technical");
            skill.setConfidenceScore(skillDto.getRelevanceScore() != null ? skillDto.getRelevanceScore() : 50);

            // Determine proficiency based on confidence score
            CandidateSkill.Proficiency proficiency = CandidateSkill.Proficiency.INTERMEDIATE;
            if (skillDto.getRelevanceScore() != null) {
                if (skillDto.getRelevanceScore() >= 80) {
                    proficiency = CandidateSkill.Proficiency.EXPERT;
                } else if (skillDto.getRelevanceScore() >= 60) {
                    proficiency = CandidateSkill.Proficiency.ADVANCED;
                } else if (skillDto.getRelevanceScore() >= 40) {
                    proficiency = CandidateSkill.Proficiency.INTERMEDIATE;
                } else {
                    proficiency = CandidateSkill.Proficiency.BEGINNER;
                }
            }
            skill.setProficiency(proficiency);

            profile.getSkills().add(skill);
        }

        log.debug("Extracted {} skills for profile", profile.getSkills().size());
    }

    /**
     * Extract experiences from parser result and populate profile
     */
    private void extractExperiences(CandidateProfile profile, ResumeParserResult parserResult) {
        // Clear existing experiences
        profile.getExperiences().clear();

        for (ResumeParserResult.ExperienceDto expDto : parserResult.getExperience()) {
            CandidateExperience experience = new CandidateExperience();
            experience.setProfile(profile);
            experience.setCompany(expDto.getCompany());
            experience.setDesignation(expDto.getDesignation());
            experience.setDuration(expDto.getDuration());

            // Parse dates
            LocalDate startDate = parseDate(expDto.getStartDate());
            LocalDate endDate = parseDate(expDto.getEndDate());
            experience.setStartDate(startDate);
            experience.setEndDate(endDate);

            // Set technologies
            if (expDto.getTechnologies() != null) {
                experience.setTechnologies(new ArrayList<>(expDto.getTechnologies()));
            }

            profile.getExperiences().add(experience);
        }

        log.debug("Extracted {} experiences for profile", profile.getExperiences().size());
    }

    /**
     * Extract projects from parser result and populate profile
     */
    private void extractProjects(CandidateProfile profile, ResumeParserResult parserResult) {
        // Clear existing projects
        profile.getProjects().clear();

        for (ResumeParserResult.ProjectDto projectDto : parserResult.getProjects()) {
            CandidateProject project = new CandidateProject();
            project.setProfile(profile);
            project.setTitle(projectDto.getTitle());
            project.setDescription(projectDto.getDescription());

            // Extract URLs - check if it's a GitHub URL or generic URL
            if (projectDto.getUrl() != null) {
                if (projectDto.getUrl().toLowerCase().contains("github")) {
                    project.setGithubUrl(projectDto.getUrl());
                } else {
                    project.setLiveUrl(projectDto.getUrl());
                }
            }

            // Set technologies
            if (projectDto.getTechnologies() != null) {
                project.setTechnologies(new ArrayList<>(projectDto.getTechnologies()));
            }

            profile.getProjects().add(project);
        }

        log.debug("Extracted {} projects for profile", profile.getProjects().size());
    }

    /**
     * Calculate total experience years from experience list
     */
    private Integer calculateTotalExperienceYears(List<ResumeParserResult.ExperienceDto> experiences) {
        if (experiences == null || experiences.isEmpty()) {
            return 0;
        }

        LocalDate now = LocalDate.now();
        long totalDays = 0;

        for (ResumeParserResult.ExperienceDto exp : experiences) {
            LocalDate start = parseDate(exp.getStartDate());
            LocalDate end = parseDate(exp.getEndDate());

            if (start != null && end != null) {
                totalDays += ChronoUnit.DAYS.between(start, end);
            } else if (start != null) {
                // Current job - calculate until now
                totalDays += ChronoUnit.DAYS.between(start, now);
            }
        }

        // Convert days to years (365.25 days per year accounting for leap years)
        return (int) (totalDays / 365.25);
    }

    /**
     * Parse date strings in various formats
     */
    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) {
            return null;
        }

        dateStr = dateStr.trim();

        // Try common date formats
        String[] formats = {
            "yyyy-MM-dd",
            "MM/dd/yyyy",
            "dd/MM/yyyy",
            "MMM yyyy",
            "MMMM yyyy",
            "yyyy",
        };

        for (String format : formats) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
                if (format.equals("MMM yyyy") || format.equals("MMMM yyyy")) {
                    YearMonth yearMonth = YearMonth.parse(dateStr, formatter);
                    return yearMonth.atDay(1);
                } else if (format.equals("yyyy")) {
                    return LocalDate.parse(dateStr + "-01-01");
                } else {
                    return LocalDate.parse(dateStr, formatter);
                }
            } catch (Exception e) {
                // Try next format
            }
        }

        log.warn("Could not parse date: {}", dateStr);
        return null;
    }
}
