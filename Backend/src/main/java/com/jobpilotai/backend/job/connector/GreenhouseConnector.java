package com.jobpilotai.backend.job.connector;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobpilotai.backend.job.config.JobSourceProperties;
import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.JobSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Greenhouse ATS connector.
 * Fetches real jobs from the Greenhouse public boards API.
 * API: https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs
 */
@Component("jobGreenhouseConnector")
public class GreenhouseConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(GreenhouseConnector.class);
    private static final String API_BASE = "https://boards-api.greenhouse.io/v1/boards/";
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final JobSourceProperties jobSourceProperties;

    public GreenhouseConnector(JobSourceProperties jobSourceProperties) {
        this.jobSourceProperties = jobSourceProperties;
    }

    @Override
    public boolean supports(JobSource source) {
        return JobSource.GREENHOUSE == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        log.info("Connector Started: Greenhouse");
        List<NormalizedJob> allJobs = new ArrayList<>();

        for (String board : jobSourceProperties.getGreenhouseBoards()) {
            try {
                List<NormalizedJob> boardJobs = fetchFromBoard(board);
                allJobs.addAll(boardJobs);
                log.info("Greenhouse [{}]: fetched {} jobs", board, boardJobs.size());
            } catch (Exception e) {
                log.error("Greenhouse [{}]: failed to fetch — {}", board, e.getMessage());
            }
        }

        log.info("Connector Finished: Greenhouse — {} total jobs fetched", allJobs.size());
        return allJobs;
    }

    private List<NormalizedJob> fetchFromBoard(String boardToken) throws Exception {
        String url = API_BASE + boardToken + "/jobs?content=true";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP " + response.statusCode() + " from Greenhouse for board: " + boardToken);
        }

        JsonNode root = mapper.readTree(response.body());
        JsonNode jobsNode = root.get("jobs");
        if (jobsNode == null || !jobsNode.isArray()) {
            return List.of();
        }

        List<NormalizedJob> jobs = new ArrayList<>();
        for (JsonNode jobNode : jobsNode) {
            try {
                NormalizedJob job = parseJob(jobNode, boardToken);
                if (job != null) {
                    jobs.add(job);
                }
            } catch (Exception e) {
                log.warn("Greenhouse: failed to parse job node — {}", e.getMessage());
            }
        }
        return jobs;
    }

    private NormalizedJob parseJob(JsonNode node, String boardToken) {
        String externalId = "gh-" + node.path("id").asText();
        String title = node.path("title").asText("");
        if (title.isBlank()) return null;

        // Extract location
        JsonNode locationNode = node.path("location");
        String location = locationNode.path("name").asText("Remote");

        // Extract description (HTML content)
        String description = "";
        JsonNode contentNode = node.path("content");
        if (!contentNode.isMissingNode()) {
            description = contentNode.asText("");
            // Strip HTML tags for cleaner text
            description = description.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
        }

        // Build apply URL
        String applyUrl = "https://boards.greenhouse.io/" + boardToken + "/jobs/" + node.path("id").asText();

        // Extract department info for enrichment
        String department = "";
        JsonNode deptArray = node.path("departments");
        if (deptArray.isArray() && !deptArray.isEmpty()) {
            department = deptArray.get(0).path("name").asText("");
        }

        // Infer remote type from location text
        String remoteType = "ONSITE";
        String locLower = location.toLowerCase();
        if (locLower.contains("remote")) {
            remoteType = "REMOTE";
        } else if (locLower.contains("hybrid")) {
            remoteType = "HYBRID";
        }

        // Extract posted date
        LocalDate postedDate = LocalDate.now();
        String updatedAt = node.path("updated_at").asText("");
        if (!updatedAt.isBlank()) {
            try {
                postedDate = LocalDate.parse(updatedAt.substring(0, 10));
            } catch (Exception ignored) {}
        }

        return NormalizedJob.builder()
                .externalJobId(externalId)
                .source(JobSource.GREENHOUSE.name())
                .title(title)
                .description(description.length() > 5000 ? description.substring(0, 5000) : description)
                .location(location)
                .remoteType(remoteType)
                .employmentType("FULL_TIME")
                .experienceLevel(inferExperienceLevel(title))
                .companyName(boardToken.substring(0, 1).toUpperCase() + boardToken.substring(1))
                .companyWebsite("https://" + boardToken + ".com")
                .companyIndustry("Technology")
                .companyHeadquarters(location)
                .applyUrl(applyUrl)
                .jobUrl(applyUrl)
                .postedDate(postedDate)
                .expiresDate(postedDate.plusDays(60))
                .skills(extractSkillsFromDescription(description))
                .build();
    }

    private String inferExperienceLevel(String title) {
        String lower = title.toLowerCase();
        if (lower.contains("senior") || lower.contains("sr.") || lower.contains("lead") || lower.contains("principal") || lower.contains("staff")) return "Senior";
        if (lower.contains("junior") || lower.contains("jr.") || lower.contains("entry")) return "Entry";
        if (lower.contains("intern")) return "Intern";
        return "Mid-level";
    }

    private List<String> extractSkillsFromDescription(String description) {
        List<String> skills = new ArrayList<>();
        String lower = description.toLowerCase();
        String[] techKeywords = {"java", "python", "javascript", "typescript", "react", "angular", "vue",
                "node.js", "spring boot", "kubernetes", "docker", "aws", "gcp", "azure",
                "sql", "postgresql", "mongodb", "redis", "graphql", "rest api", "microservices",
                "machine learning", "data engineering", "ci/cd", "terraform", "go", "rust", "scala",
                "kafka", "elasticsearch", "spark", "airflow", "snowflake", "dbt"};
        for (String kw : techKeywords) {
            if (lower.contains(kw)) {
                skills.add(kw.substring(0, 1).toUpperCase() + kw.substring(1));
            }
        }
        return skills;
    }

    @Override
    public NormalizedJob normalize(Object rawJob) {
        return (NormalizedJob) rawJob;
    }

    @Override
    public boolean health() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_BASE + "stripe/jobs"))
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public JobSource getSource() {
        return JobSource.GREENHOUSE;
    }
}
