package com.jobpilotai.backend.resumeparser.service;

import com.jobpilotai.backend.resumeparser.dto.ResumeParserResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Extract technical skills from resume text.
 * Uses dictionary-based approach with common tech keywords.
 */
@Service
public class SkillExtractor {

    private static final Logger log = LoggerFactory.getLogger(SkillExtractor.class);

    // Skills dictionary with categories
    private static final Map<String, String> SKILLS_DICTIONARY = new HashMap<>();

    static {
        // Programming Languages
        SKILLS_DICTIONARY.put("java", "Language");
        SKILLS_DICTIONARY.put("python", "Language");
        SKILLS_DICTIONARY.put("javascript", "Language");
        SKILLS_DICTIONARY.put("typescript", "Language");
        SKILLS_DICTIONARY.put("c#", "Language");
        SKILLS_DICTIONARY.put("c\\+\\+", "Language");
        SKILLS_DICTIONARY.put("kotlin", "Language");
        SKILLS_DICTIONARY.put("go", "Language");
        SKILLS_DICTIONARY.put("rust", "Language");
        SKILLS_DICTIONARY.put("php", "Language");
        SKILLS_DICTIONARY.put("ruby", "Language");
        SKILLS_DICTIONARY.put("scala", "Language");
        SKILLS_DICTIONARY.put("r", "Language");
        SKILLS_DICTIONARY.put("perl", "Language");

        // Frameworks & Libraries
        SKILLS_DICTIONARY.put("spring boot", "Framework");
        SKILLS_DICTIONARY.put("spring", "Framework");
        SKILLS_DICTIONARY.put("react", "Framework");
        SKILLS_DICTIONARY.put("angular", "Framework");
        SKILLS_DICTIONARY.put("vue", "Framework");
        SKILLS_DICTIONARY.put("node.js", "Framework");
        SKILLS_DICTIONARY.put("express", "Framework");
        SKILLS_DICTIONARY.put("django", "Framework");
        SKILLS_DICTIONARY.put("flask", "Framework");
        SKILLS_DICTIONARY.put("asp.net", "Framework");
        SKILLS_DICTIONARY.put("hibernate", "Framework");
        SKILLS_DICTIONARY.put("jpa", "Framework");

        // Databases
        SKILLS_DICTIONARY.put("sql", "Database");
        SKILLS_DICTIONARY.put("mysql", "Database");
        SKILLS_DICTIONARY.put("postgresql", "Database");
        SKILLS_DICTIONARY.put("oracle", "Database");
        SKILLS_DICTIONARY.put("mongodb", "Database");
        SKILLS_DICTIONARY.put("cassandra", "Database");
        SKILLS_DICTIONARY.put("redis", "Database");
        SKILLS_DICTIONARY.put("elasticsearch", "Database");
        SKILLS_DICTIONARY.put("dynamodb", "Database");

        // Cloud & DevOps
        SKILLS_DICTIONARY.put("aws", "Cloud");
        SKILLS_DICTIONARY.put("azure", "Cloud");
        SKILLS_DICTIONARY.put("gcp", "Cloud");
        SKILLS_DICTIONARY.put("docker", "DevOps");
        SKILLS_DICTIONARY.put("kubernetes", "DevOps");
        SKILLS_DICTIONARY.put("jenkins", "DevOps");
        SKILLS_DICTIONARY.put("gitlab", "DevOps");
        SKILLS_DICTIONARY.put("github", "DevOps");
        SKILLS_DICTIONARY.put("terraform", "DevOps");
        SKILLS_DICTIONARY.put("ansible", "DevOps");
        SKILLS_DICTIONARY.put("ci/cd", "DevOps");

        // Web Technologies
        SKILLS_DICTIONARY.put("rest api", "Web");
        SKILLS_DICTIONARY.put("graphql", "Web");
        SKILLS_DICTIONARY.put("html", "Web");
        SKILLS_DICTIONARY.put("css", "Web");
        SKILLS_DICTIONARY.put("json", "Web");
        SKILLS_DICTIONARY.put("xml", "Web");
        SKILLS_DICTIONARY.put("soap", "Web");

        // Architecture
        SKILLS_DICTIONARY.put("microservices", "Architecture");
        SKILLS_DICTIONARY.put("monolithic", "Architecture");
        SKILLS_DICTIONARY.put("event-driven", "Architecture");
        SKILLS_DICTIONARY.put("mq", "Architecture");

        // Testing
        SKILLS_DICTIONARY.put("junit", "Testing");
        SKILLS_DICTIONARY.put("mockito", "Testing");
        SKILLS_DICTIONARY.put("testng", "Testing");
        SKILLS_DICTIONARY.put("selenium", "Testing");
        SKILLS_DICTIONARY.put("jest", "Testing");

        // Version Control
        SKILLS_DICTIONARY.put("git", "VCS");
        SKILLS_DICTIONARY.put("svn", "VCS");
        SKILLS_DICTIONARY.put("mercurial", "VCS");

        // Other Tools
        SKILLS_DICTIONARY.put("linux", "OS");
        SKILLS_DICTIONARY.put("windows", "OS");
        SKILLS_DICTIONARY.put("unix", "OS");
        SKILLS_DICTIONARY.put("agile", "Methodology");
        SKILLS_DICTIONARY.put("scrum", "Methodology");
        SKILLS_DICTIONARY.put("maven", "Tool");
        SKILLS_DICTIONARY.put("gradle", "Tool");
    }

    /**
     * Extract skills from resume text
     *
     * @param text Resume text
     * @return List of detected skills
     */
    public List<ResumeParserResult.SkillDto> extractSkills(String text) {
        List<ResumeParserResult.SkillDto> skills = new ArrayList<>();
        Set<String> foundSkills = new java.util.HashSet<>();

        if (text == null || text.isBlank()) {
            return skills;
        }

        String lowerText = text.toLowerCase();

        for (Map.Entry<String, String> skill : SKILLS_DICTIONARY.entrySet()) {
            String skillName = skill.getKey();
            String category = skill.getValue();

            // Use word boundary matching for more accurate detection
            Pattern pattern = Pattern.compile("\\b" + skillName + "\\b", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);

            if (matcher.find() && !foundSkills.contains(skillName)) {
                // Count occurrences for relevance scoring
                int count = 0;
                Matcher countMatcher = pattern.matcher(text);
                while (countMatcher.find()) {
                    count++;
                }

                ResumeParserResult.SkillDto skillDto = new ResumeParserResult.SkillDto();
                skillDto.setName(skillName);
                skillDto.setCategory(category);
                // Relevance score: 0-100 based on occurrence frequency
                skillDto.setRelevanceScore(Math.min(100, 50 + (count * 10)));

                skills.add(skillDto);
                foundSkills.add(skillName);
            }
        }

        log.info("Extracted {} skills from resume", skills.size());
        return skills;
    }
}
