package com.jobpilotai.backend.job.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Standard normalized format for job data from any connector.
 * All connectors must transform their data into this format.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NormalizedJob {

    private String externalJobId;
    private String source;

    // ── Job Details ──
    private String title;
    private String description;
    private String location;
    private String remoteType;
    private String employmentType;
    private String experienceLevel;

    // ── Salary ──
    private Long salaryMin;
    private Long salaryMax;
    private String currency;

    // ── Company ──
    private String companyName;
    private String companyWebsite;
    private String companyLogoUrl;
    private String companyIndustry;
    private String companyHeadquarters;
    private String companySize;
    private String companyDescription;

    // ── Skills & Benefits ──
    private List<String> skills;
    private List<String> benefits;

    // ── URLs ──
    private String applyUrl;
    private String jobUrl;

    // ── Dates ──
    private LocalDate postedDate;
    private LocalDate expiresDate;
}
