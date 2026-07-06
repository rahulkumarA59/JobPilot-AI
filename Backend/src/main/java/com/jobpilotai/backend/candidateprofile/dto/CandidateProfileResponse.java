package com.jobpilotai.backend.candidateprofile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for candidate profile details.
 */
@Getter
@Setter
public class CandidateProfileResponse {

    @JsonProperty("public_id")
    private UUID publicId;

    private String headline;

    private String summary;

    @JsonProperty("total_experience_years")
    private Integer totalExperienceYears;

    @JsonProperty("current_role")
    private String currentRole;

    @JsonProperty("current_company")
    private String currentCompany;

    @JsonProperty("highest_education")
    private String highestEducation;

    @JsonProperty("current_location")
    private String currentLocation;

    @JsonProperty("preferred_locations")
    private String preferredLocations;

    @JsonProperty("expected_salary")
    private Long expectedSalary;

    @JsonProperty("notice_period")
    private String noticePeriod;

    @JsonProperty("profile_strength")
    private Integer profileStrength;

    @JsonProperty("completeness_score")
    private Integer completenessScore;

    private List<CandidateSkillResponse> skills;

    private List<CandidateExperienceResponse> experiences;

    private List<CandidateProjectResponse> projects;

    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonProperty("updated_at")
    private Instant updatedAt;

    /**
     * Nested skill response
     */
    @Getter
    @Setter
    public static class CandidateSkillResponse {
        private Long id;

        @JsonProperty("skill_name")
        private String skillName;

        private String category;

        private String proficiency;

        @JsonProperty("experience_years")
        private Integer experienceYears;

        @JsonProperty("confidence_score")
        private Integer confidenceScore;
    }

    /**
     * Nested experience response
     */
    @Getter
    @Setter
    public static class CandidateExperienceResponse {
        private Long id;

        private String company;

        private String designation;

        @JsonProperty("start_date")
        private String startDate;

        @JsonProperty("end_date")
        private String endDate;

        private String duration;

        private List<String> technologies;
    }

    /**
     * Nested project response
     */
    @Getter
    @Setter
    public static class CandidateProjectResponse {
        private Long id;

        private String title;

        private String description;

        private List<String> technologies;

        @JsonProperty("github_url")
        private String githubUrl;

        @JsonProperty("live_url")
        private String liveUrl;
    }
}
