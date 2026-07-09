package com.jobpilotai.backend.jobsource.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

/**
 * Standard normalized format for job data from any connector.
 * All connectors must transform their data into this format.
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
public class NormalizedJob {

    private String externalJobId;

    private String source;

    private String title;

    private String description;

    private String location;

    private String remoteType;

    private String employmentType;

    private String experienceLevel;

    private Long salaryMin;

    private Long salaryMax;

    private String currency;

    private String companyName;

    private String companyWebsite;

    private String companyIndustry;

    private String companyHeadquarters;

    private String companySize;

    private String companyLogoUrl;

    private List<String> skills;

    private String responsibilities;

    private String qualifications;

    private String benefits;

    private String applyUrl;

    private String jobUrl;

    private LocalDate postedDate;

    private LocalDate expiresDate;

    public NormalizedJob() {
    }
}
