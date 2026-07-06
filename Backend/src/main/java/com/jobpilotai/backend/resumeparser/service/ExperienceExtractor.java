package com.jobpilotai.backend.resumeparser.service;

import com.jobpilotai.backend.resumeparser.dto.ResumeParserResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Extract work experience information from resume text.
 * Looks for company, designation, duration, and technologies used.
 */
@Service
public class ExperienceExtractor {

    private static final Logger log = LoggerFactory.getLogger(ExperienceExtractor.class);

    private static final Pattern DESIGNATION_PATTERN = Pattern.compile(
            "(?i)(software engineer|developer|architect|manager|lead|senior|junior|" +
            "backend|frontend|fullstack|devops|qa|tester|analyst|consultant|" +
            "engineer|programmer|associate|intern|trainee)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern DATE_PATTERN = Pattern.compile(
            "(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?\\s*(?:20|19)\\d{2}|" +
            "(?:20|19)\\d{2}|present|current)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern DURATION_PATTERN = Pattern.compile(
            "(?:(\\d+)\\s*(?:years?|yrs?))\\s*(?:(\\d+)\\s*(?:months?|mos?))?",
            Pattern.CASE_INSENSITIVE
    );

    /**
     * Extract work experience entries from resume text
     *
     * @param text Resume text
     * @return List of detected work experiences
     */
    public List<ResumeParserResult.ExperienceDto> extractExperience(String text) {
        List<ResumeParserResult.ExperienceDto> experiences = new ArrayList<>();

        if (text == null || text.isBlank()) {
            return experiences;
        }

        String[] lines = text.split("\n");
        ResumeParserResult.ExperienceDto currentExperience = null;
        StringBuilder description = new StringBuilder();

        for (String line : lines) {
            String trimmedLine = line.trim();

            if (trimmedLine.isBlank()) {
                if (currentExperience != null && description.length() > 0) {
                    currentExperience.setDescription(description.toString().trim());
                    experiences.add(currentExperience);
                    currentExperience = null;
                    description = new StringBuilder();
                }
                continue;
            }

            // Look for designation
            Matcher desMatcher = DESIGNATION_PATTERN.matcher(trimmedLine);
            if (desMatcher.find() && !trimmedLine.contains("@")) {
                if (currentExperience != null && description.length() > 0) {
                    currentExperience.setDescription(description.toString().trim());
                    experiences.add(currentExperience);
                    description = new StringBuilder();
                }

                currentExperience = new ResumeParserResult.ExperienceDto();
                currentExperience.setDesignation(desMatcher.group(1));

                // Try to extract company name (usually before designation)
                String[] parts = trimmedLine.split("(?i)at|@|-");
                if (parts.length > 1) {
                    currentExperience.setCompany(parts[0].trim());
                }

                // Extract dates
                Matcher dateMatcher = DATE_PATTERN.matcher(trimmedLine);
                List<String> dates = new ArrayList<>();
                while (dateMatcher.find()) {
                    dates.add(dateMatcher.group());
                }
                if (!dates.isEmpty()) {
                    currentExperience.setStartDate(dates.get(0));
                    if (dates.size() > 1) {
                        currentExperience.setEndDate(dates.get(dates.size() - 1));
                    }
                }

                // Extract duration
                Matcher durationMatcher = DURATION_PATTERN.matcher(trimmedLine);
                if (durationMatcher.find()) {
                    currentExperience.setDuration(durationMatcher.group().trim());
                }
            } else if (currentExperience != null) {
                // Accumulate description
                description.append(trimmedLine).append(" ");

                // Extract technologies mentioned in description
                List<String> techs = extractTechnologies(trimmedLine);
                currentExperience.getTechnologies().addAll(techs);
            }
        }

        if (currentExperience != null && description.length() > 0) {
            currentExperience.setDescription(description.toString().trim());
            experiences.add(currentExperience);
        }

        log.info("Extracted {} work experiences", experiences.size());
        return experiences;
    }

    /**
     * Extract technology mentions from a line
     */
    private List<String> extractTechnologies(String line) {
        List<String> techs = new ArrayList<>();
        String[] keywords = {
                "java", "python", "javascript", "typescript", "c#", "kotlin",
                "spring", "spring boot", "react", "angular", "vue", "node",
                "sql", "mysql", "mongodb", "postgresql", "oracle",
                "aws", "azure", "gcp", "docker", "kubernetes",
                "git", "rest api", "graphql", "microservices"
        };

        String lowerLine = line.toLowerCase();
        for (String tech : keywords) {
            if (lowerLine.contains(tech)) {
                techs.add(tech);
            }
        }

        return techs;
    }
}
