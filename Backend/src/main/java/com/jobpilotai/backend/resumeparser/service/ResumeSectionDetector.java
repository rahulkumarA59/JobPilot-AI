package com.jobpilotai.backend.resumeparser.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Detect and identify different resume sections.
 * Maps section headers to section types.
 */
@Service
public class ResumeSectionDetector {

    private static final Logger log = LoggerFactory.getLogger(ResumeSectionDetector.class);

    public enum SectionType {
        SUMMARY("summary", "objective", "professional summary", "executive summary"),
        SKILLS("skills", "technical skills", "core competencies", "proficiencies"),
        EXPERIENCE("experience", "work experience", "professional experience", "employment", "career history"),
        PROJECTS("projects", "portfolio", "projects & achievements", "personal projects"),
        EDUCATION("education", "academic", "qualifications", "academic background"),
        CERTIFICATIONS("certifications", "licenses", "certifications & awards", "credentials"),
        ACHIEVEMENTS("achievements", "awards", "accomplishments", "honors"),
        LANGUAGES("languages", "language proficiency", "language skills");

        private final String[] keywords;

        SectionType(String... keywords) {
            this.keywords = keywords;
        }

        public String[] getKeywords() {
            return keywords;
        }
    }

    private static final Map<SectionType, Pattern> SECTION_PATTERNS = new HashMap<>();

    static {
        for (SectionType type : SectionType.values()) {
            StringBuilder pattern = new StringBuilder();
            pattern.append("(?i)^\\s*(");
            for (int i = 0; i < type.getKeywords().length; i++) {
                pattern.append(Pattern.quote(type.getKeywords()[i]));
                if (i < type.getKeywords().length - 1) {
                    pattern.append("|");
                }
            }
            pattern.append(")\\s*:?\\s*$");

            SECTION_PATTERNS.put(type, Pattern.compile(pattern.toString()));
        }
    }

    /**
     * Detect section type from header line
     *
     * @param line Header line to classify
     * @return SectionType if detected, null otherwise
     */
    public SectionType detectSection(String line) {
        if (line == null || line.trim().isEmpty()) {
            return null;
        }

        for (Map.Entry<SectionType, Pattern> entry : SECTION_PATTERNS.entrySet()) {
            if (entry.getValue().matcher(line).find()) {
                return entry.getKey();
            }
        }

        return null;
    }

    /**
     * Extract summary/objective from first section
     *
     * @param text Resume text
     * @return Summary text if found
     */
    public String extractSummary(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }

        String[] lines = text.split("\n");
        StringBuilder summary = new StringBuilder();
        boolean inSummary = false;
        int lineCount = 0;

        for (String line : lines) {
            String trimmedLine = line.trim();

            if (detectSection(trimmedLine) == SectionType.SUMMARY) {
                inSummary = true;
                continue;
            }

            if (inSummary) {
                // Stop when we hit another section
                if (detectSection(trimmedLine) != null) {
                    break;
                }

                if (!trimmedLine.isEmpty()) {
                    summary.append(trimmedLine).append(" ");
                    lineCount++;
                    
                    // Limit summary to 5 lines
                    if (lineCount > 5) {
                        break;
                    }
                }
            }
        }

        String result = summary.toString().trim();
        if (result.isEmpty()) {
            // Try to extract first few lines as summary if no explicit summary section
            StringBuilder firstLines = new StringBuilder();
            int count = 0;
            for (String line : lines) {
                String trimmedLine = line.trim();
                if (!trimmedLine.isEmpty() && detectSection(trimmedLine) == null) {
                    firstLines.append(trimmedLine).append(" ");
                    count++;
                    if (count >= 3) break;
                } else if (detectSection(trimmedLine) != null) {
                    break;
                }
            }
            result = firstLines.toString().trim();
        }

        return result.isEmpty() ? null : result;
    }

    /**
     * Check if a line is a section header
     *
     * @param line Line to check
     * @return true if line is a section header
     */
    public boolean isSectionHeader(String line) {
        return detectSection(line) != null;
    }
}
