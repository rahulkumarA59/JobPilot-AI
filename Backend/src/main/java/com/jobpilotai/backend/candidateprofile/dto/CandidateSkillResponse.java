package com.jobpilotai.backend.candidateprofile.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * Response DTO for candidate skill details.
 */
@Getter
@Setter
public class CandidateSkillResponse {

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
