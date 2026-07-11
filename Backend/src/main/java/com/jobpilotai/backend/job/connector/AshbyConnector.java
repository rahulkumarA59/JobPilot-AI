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
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Ashby ATS connector.
 * Fetches real jobs from the Ashby public posting API.
 * API: https://api.ashbyhq.com/posting-api/job-board/{company}
 */
@Component("jobAshbyConnector")
public class AshbyConnector implements JobConnector {

    private static final Logger log = LoggerFactory.getLogger(AshbyConnector.class);
    private static final String API_BASE = "https://api.ashbyhq.com/posting-api/job-board/";
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final JobSourceProperties jobSourceProperties;

    public AshbyConnector(JobSourceProperties jobSourceProperties) {
        this.jobSourceProperties = jobSourceProperties;
    }

    @Override
    public boolean supports(JobSource source) {
        return JobSource.ASHBY == source;
    }

    @Override
    public List<NormalizedJob> fetchJobs() {
        log.info("Connector Started: Ashby");
        List<NormalizedJob> allJobs = new ArrayList<>();

        for (String company : jobSourceProperties.getAshbyCompanies()) {
            try {
                List<NormalizedJob> companyJobs = fetchFromCompany(company);
                allJobs.addAll(companyJobs);
                log.info("Ashby [{}]: fetched {} jobs", company, companyJobs.size());
            } catch (Exception e) {
                log.error("Ashby [{}]: failed to fetch — {}", company, e.getMessage());
            }
        }

        log.info("Connector Finished: Ashby — {} total jobs fetched", allJobs.size());
        return allJobs;
    }

    private List<NormalizedJob> fetchFromCompany(String company) throws Exception {
        String url = API_BASE + company;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP " + response.statusCode() + " from Ashby for company: " + company);
        }

        JsonNode root = mapper.readTree(response.body());
        JsonNode jobsNode = root.get("jobs");
        if (jobsNode == null || !jobsNode.isArray()) {
            return List.of();
        }

        List<NormalizedJob> jobs = new ArrayList<>();
        for (JsonNode jobNode : jobsNode) {
            try {
                NormalizedJob job = parseJob(jobNode, company);
                if (job != null) {
                    jobs.add(job);
                }
            } catch (Exception e) {
                log.warn("Ashby: failed to parse job node — {}", e.getMessage());
            }
        }
        return jobs;
    }

    private NormalizedJob parseJob(JsonNode node, String company) {
        String externalId = "ab-" + node.path("id").asText();
        String title = node.path("title").asText("");
        if (title.isBlank()) return null;

        // Location
        String location = node.path("location").asText("Remote");
        String remoteType = "ONSITE";
        if (location.toLowerCase().contains("remote")) {
            remoteType = "REMOTE";
        } else if (location.toLowerCase().contains("hybrid")) {
            remoteType = "HYBRID";
        }

        // Apply URL / Job URL
        String jobUrl = node.path("jobUrl").asText("");
        if (jobUrl.isBlank()) {
            jobUrl = "https://jobs.ashbyhq.com/" + company + "/" + node.path("id").asText();
        }
        String applyUrl = jobUrl; // Ashby usually has the form on the same page

        // Department
        String department = node.path("department").asText("");

        // Description - Ashby might return full HTML in descriptionHtml, we'll map if present
        // Otherwise, fetch it specifically (requires hitting /job-board/{company}/job/{id})
        // For V1 aggregator, we will leave description blank if not present, but Ashby often returns basic HTML
        String descriptionHtml = node.path("descriptionHtml").asText("");
        if (descriptionHtml.isBlank()) {
            descriptionHtml = "Ashby job at " + company + ". See " + jobUrl + " for details.";
        }
        descriptionHtml = descriptionHtml.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();

        LocalDate postedDate = LocalDate.now();
        String publishedAt = node.path("publishedAt").asText("");
        if (!publishedAt.isBlank()) {
            try {
                postedDate = LocalDate.parse(publishedAt.substring(0, 10));
            } catch (Exception ignored) {}
        }

        return NormalizedJob.builder()
                .externalJobId(externalId)
                .source(JobSource.ASHBY.name())
                .title(title)
                .description(descriptionHtml.length() > 5000 ? descriptionHtml.substring(0, 5000) : descriptionHtml)
                .location(location)
                .remoteType(remoteType)
                .employmentType("FULL_TIME") // Default
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
                "sql", "postgresql", "mongodb", "redis", "graphql", "rest api", "microservices"};
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
                    .uri(URI.create(API_BASE + "linear")) // linear uses ashby
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
        return JobSource.ASHBY;
    }
}
