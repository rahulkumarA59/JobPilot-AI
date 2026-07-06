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
 * Extract project information from resume text.
 * Looks for project titles, descriptions, technologies used.
 */
@Service
public class ProjectExtractor {

    private static final Logger log = LoggerFactory.getLogger(ProjectExtractor.class);

    private static final Pattern URL_PATTERN = Pattern.compile(
            "(?:https?://|www\\.)\\S+",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern GITHUB_PATTERN = Pattern.compile(
            "github\\.com/\\S+",
            Pattern.CASE_INSENSITIVE
    );

    /**
     * Extract project entries from resume text
     *
     * @param text Resume text
     * @return List of detected projects
     */
    public List<ResumeParserResult.ProjectDto> extractProjects(String text) {
        List<ResumeParserResult.ProjectDto> projects = new ArrayList<>();

        if (text == null || text.isBlank()) {
            return projects;
        }

        String[] lines = text.split("\n");
        ResumeParserResult.ProjectDto currentProject = null;
        StringBuilder description = new StringBuilder();

        for (String line : lines) {
            String trimmedLine = line.trim();

            if (trimmedLine.isBlank()) {
                if (currentProject != null) {
                    if (description.length() > 0) {
                        currentProject.setDescription(description.toString().trim());
                    }
                    projects.add(currentProject);
                    currentProject = null;
                    description = new StringBuilder();
                }
                continue;
            }

            // Check if line contains URL or GitHub link (likely a project)
            if (URL_PATTERN.matcher(trimmedLine).find() || 
                GITHUB_PATTERN.matcher(trimmedLine).find()) {
                
                if (currentProject == null) {
                    currentProject = new ResumeParserResult.ProjectDto();
                }

                // Extract URL
                Matcher urlMatcher = URL_PATTERN.matcher(trimmedLine);
                if (urlMatcher.find()) {
                    currentProject.setUrl(urlMatcher.group());
                }

                // Extract project name (usually before URL)
                String[] parts = trimmedLine.split("(?:https?://|www\\.|github\\.com/|\\||-|:)");
                if (parts.length > 0 && !parts[0].trim().isEmpty()) {
                    currentProject.setTitle(parts[0].trim());
                }

                // Extract technologies
                List<String> techs = extractTechnologies(trimmedLine);
                currentProject.getTechnologies().addAll(techs);
            } else if (currentProject != null) {
                // Accumulate description
                description.append(trimmedLine).append(" ");

                // Also extract technologies from description lines
                List<String> techs = extractTechnologies(trimmedLine);
                for (String tech : techs) {
                    if (!currentProject.getTechnologies().contains(tech)) {
                        currentProject.getTechnologies().add(tech);
                    }
                }
            }
        }

        if (currentProject != null) {
            if (description.length() > 0) {
                currentProject.setDescription(description.toString().trim());
            }
            projects.add(currentProject);
        }

        log.info("Extracted {} projects", projects.size());
        return projects;
    }

    /**
     * Extract technology mentions from a line
     */
    private List<String> extractTechnologies(String line) {
        List<String> techs = new ArrayList<>();
        String[] keywords = {
                "java", "python", "javascript", "typescript", "c#", "kotlin", "go",
                "spring", "spring boot", "react", "angular", "vue", "next.js", "node",
                "sql", "mysql", "mongodb", "postgresql", "firebase",
                "aws", "azure", "gcp", "docker", "kubernetes", "aws lambda",
                "git", "rest api", "graphql", "websocket", "microservices",
                "html", "css", "bootstrap", "tailwind", "material ui",
                "junit", "jest", "selenium", "cypress"
        };

        String lowerLine = line.toLowerCase();
        for (String tech : keywords) {
            if (lowerLine.contains(tech) && !techs.contains(tech)) {
                techs.add(tech);
            }
        }

        return techs;
    }
}
