package com.jobpilotai.backend.job.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * Response DTO for job skill details.
 */
@Getter
@Setter
public class JobSkillResponse {

    @JsonProperty("skill_name")
    private String skillName;

    private String category;

    private boolean required;

    private int priority;
}
