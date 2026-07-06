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
 * Extract education information from resume text.
 * Looks for degrees, institutions, GPA, graduation years.
 */
@Service
public class EducationExtractor {

    private static final Logger log = LoggerFactory.getLogger(EducationExtractor.class);

    private static final Pattern DEGREE_PATTERN = Pattern.compile(
            "(?i)(bachelor|master|phd|b\\.?a\\.?|b\\.?s\\.?|b\\.?tech|m\\.?a\\.?|m\\.?s\\.?|m\\.?tech|" +
            "mba|b\\.?com|m\\.?com|diploma|associate|postgraduate|undergraduate|honours|hons)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern INSTITUTION_PATTERN = Pattern.compile(
            "(?i)(university|college|institute|school|academy|polytechnic)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern CGPA_PATTERN = Pattern.compile(
            "(?:cgpa|gpa|grade point)\\s*:?\\s*([0-9]\\.[0-9]{1,2}|[0-9]{2,3}(?:\\.[0-9]{1,2})?)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern YEAR_PATTERN = Pattern.compile(
            "(?:(?:20|19)\\d{2})",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern FIELD_PATTERN = Pattern.compile(
            "(?:in|of)\\s+([a-zA-Z\\s]{5,50}?)(?:\\.|,|;|\\n|$)",
            Pattern.CASE_INSENSITIVE
    );

    /**
     * Extract education entries from resume text
     *
     * @param text Resume text
     * @return List of detected education entries
     */
    public List<ResumeParserResult.EducationDto> extractEducation(String text) {
        List<ResumeParserResult.EducationDto> educationList = new ArrayList<>();

        if (text == null || text.isBlank()) {
            return educationList;
        }

        // Split by lines and process
        String[] lines = text.split("\n");
        ResumeParserResult.EducationDto currentEducation = null;
        StringBuilder description = new StringBuilder();

        for (String line : lines) {
            String trimmedLine = line.trim();

            if (trimmedLine.isBlank()) {
                if (currentEducation != null) {
                    educationList.add(currentEducation);
                    currentEducation = null;
                    description = new StringBuilder();
                }
                continue;
            }

            // Look for degree
            Matcher degreeMatcher = DEGREE_PATTERN.matcher(trimmedLine);
            if (degreeMatcher.find()) {
                if (currentEducation != null) {
                    educationList.add(currentEducation);
                }

                currentEducation = new ResumeParserResult.EducationDto();
                currentEducation.setDegree(degreeMatcher.group(1));

                // Extract institution name
                Matcher instMatcher = INSTITUTION_PATTERN.matcher(trimmedLine);
                if (instMatcher.find()) {
                    // Extract institution name from around the match
                    int startIdx = Math.max(0, instMatcher.start() - 30);
                    int endIdx = Math.min(trimmedLine.length(), instMatcher.end() + 30);
                    String snippet = trimmedLine.substring(startIdx, endIdx);
                    
                    // Try to extract institution name
                    String[] parts = snippet.split("(?i)(university|college|institute|school)");
                    if (parts.length > 0) {
                        currentEducation.setInstitution(parts[parts.length - 1].trim());
                    }
                }

                // Extract field of study
                Matcher fieldMatcher = FIELD_PATTERN.matcher(trimmedLine);
                if (fieldMatcher.find()) {
                    currentEducation.setField(fieldMatcher.group(1).trim());
                }

                // Extract CGPA
                Matcher cgpaMatcher = CGPA_PATTERN.matcher(trimmedLine);
                if (cgpaMatcher.find()) {
                    try {
                        currentEducation.setCgpa(Double.parseDouble(cgpaMatcher.group(1)));
                    } catch (NumberFormatException e) {
                        // Ignore parsing errors
                    }
                }

                // Extract year
                Matcher yearMatcher = YEAR_PATTERN.matcher(trimmedLine);
                if (yearMatcher.find()) {
                    try {
                        Integer year = Integer.parseInt(yearMatcher.group());
                        if (year >= 1990 && year <= 2030) {
                            currentEducation.setGraduationYear(year);
                        }
                    } catch (NumberFormatException e) {
                        // Ignore parsing errors
                    }
                }
            } else if (currentEducation != null) {
                // Accumulate description
                description.append(trimmedLine).append(" ");
            }
        }

        if (currentEducation != null) {
            educationList.add(currentEducation);
        }

        log.info("Extracted {} education entries", educationList.size());
        return educationList;
    }
}
