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
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

/**
 * Lever ATS connector.
 * Fetches real jobs from the Lever public postings API.
 * API: https://api.lever.co/v0/postings/{company}
 */
@Component("jobLeverConnector")
public class LeverConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(LeverConnector.class);
    private static final String API_BASE = "https://api.lever.co/v0/postings/";
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final JobSourceProperties jobSourceProperties;

    public LeverConnector(JobSourceProperties jobSourceProperties) {
        this.jobSourceProperties = jobSourceProperties;
    }

    @Override
    public boolean supports(JobSource source) {
        return JobSource.LEVER == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        log.info("Connector Started: Lever");
        List<NormalizedJob> allJobs = new ArrayList<>();

        for (String company : jobSourceProperties.getLeverCompanies()) {
            try {
                List<NormalizedJob> companyJobs = fetchFromCompany(company);
                allJobs.addAll(companyJobs);
                log.info("Lever [{}]: fetched {} jobs", company, companyJobs.size());
            } catch (Exception e) {
                log.error("Lever [{}]: failed to fetch — {}", company, e.getMessage());
            }
        }

        log.info("Connector Finished: Lever — {} total jobs fetched", allJobs.size());
        return allJobs;
    }

    private List<NormalizedJob> fetchFromCompany(String company) throws Exception {
        String url = API_BASE + company + "?mode=json";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP " + response.statusCode() + " from Lever for company: " + company);
        }

        JsonNode root = mapper.readTree(response.body());
        if (!root.isArray()) {
            return List.of();
        }

        List<NormalizedJob> jobs = new ArrayList<>();
        for (JsonNode jobNode : root) {
            try {
                NormalizedJob job = parseJob(jobNode, company);
                if (job != null) {
                    jobs.add(job);
                }
            } catch (Exception e) {
                log.warn("Lever: failed to parse job node — {}", e.getMessage());
            }
        }
        return jobs;
    }

    private NormalizedJob parseJob(JsonNode node, String company) {
        String externalId = "lv-" + node.path("id").asText();
        String title = node.path("text").asText("");
        if (title.isBlank()) return null;

        // Location
        String location = "Remote";
        JsonNode categoriesNode = node.path("categories");
        if (!categoriesNode.isMissingNode()) {
            String loc = categoriesNode.path("location").asText("");
            if (!loc.isBlank()) location = loc;
        }

        // Description
        String descriptionHtml = node.path("descriptionPlain").asText("");
        if (descriptionHtml.isBlank()) {
            descriptionHtml = node.path("description").asText("");
            descriptionHtml = descriptionHtml.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
        }

        // Apply URL
        String applyUrl = node.path("applyUrl").asText("");
        if (applyUrl.isBlank()) {
            applyUrl = node.path("hostedUrl").asText("https://jobs.lever.co/" + company);
        }

        String jobUrl = node.path("hostedUrl").asText(applyUrl);

        // Remote type
        String remoteType = "ONSITE";
        String locLower = location.toLowerCase();
        if (locLower.contains("remote")) remoteType = "REMOTE";
        else if (locLower.contains("hybrid")) remoteType = "HYBRID";

        // Team/department
        String team = "";
        if (!categoriesNode.isMissingNode()) {
            team = categoriesNode.path("team").asText("");
        }

        // Posted date from createdAt (milliseconds epoch)
        LocalDate postedDate = LocalDate.now();
        long createdAt = node.path("createdAt").asLong(0);
        if (createdAt > 0) {
            postedDate = Instant.ofEpochMilli(createdAt).atZone(ZoneId.systemDefault()).toLocalDate();
        }

        // Commitment (full-time, part-time, etc.)
        String commitment = "";
        if (!categoriesNode.isMissingNode()) {
            commitment = categoriesNode.path("commitment").asText("Full-time");
        }

        String employmentType = "FULL_TIME";
        if (commitment.toLowerCase().contains("part")) employmentType = "PART_TIME";
        else if (commitment.toLowerCase().contains("contract")) employmentType = "CONTRACT";
        else if (commitment.toLowerCase().contains("intern")) employmentType = "INTERNSHIP";

        return NormalizedJob.builder()
                .externalJobId(externalId)
                .source(JobSource.LEVER.name())
                .title(title)
                .description(descriptionHtml.length() > 5000 ? descriptionHtml.substring(0, 5000) : descriptionHtml)
                .location(location)
                .remoteType(remoteType)
                .employmentType(employmentType)
                .experienceLevel(inferExperienceLevel(title))
                .companyName(company.substring(0, 1).toUpperCase() + company.substring(1))
                .companyWebsite("https://" + company + ".com")
                .companyIndustry("Technology")
                .companyHeadquarters(location)
                .applyUrl(applyUrl)
                .jobUrl(jobUrl)
                .postedDate(postedDate)
                .expiresDate(postedDate.plusDays(60))
                .skills(extractSkillsFromDescription(descriptionHtml))
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
                    .uri(URI.create(API_BASE + "netflix?mode=json&limit=1"))
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
        return JobSource.LEVER;
    }
}
