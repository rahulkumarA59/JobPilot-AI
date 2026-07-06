package com.jobpilotai.backend.candidateprofile.service;

import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import org.springframework.stereotype.Service;

/**
 * Calculates profile completeness score (0-100) based on filled fields.
 * Checks presence of key profile information.
 */
@Service
public class CompletenessCalculator {

    /**
     * Calculate profile completeness score (0-100)
     * Based on presence of: headline, summary, currentRole, currentCompany,
     * highestEducation, currentLocation, skills, experience, projects
     */
    public Integer calculateCompleteness(CandidateProfile profile) {
        int score = 0;
        int totalFields = 9;

        // Basic info (each worth ~11 points)
        if (profile.getHeadline() != null && !profile.getHeadline().isBlank()) {
            score += 11;
        }
        if (profile.getSummary() != null && !profile.getSummary().isBlank()) {
            score += 11;
        }
        if (profile.getCurrentRole() != null && !profile.getCurrentRole().isBlank()) {
            score += 11;
        }
        if (profile.getCurrentCompany() != null && !profile.getCurrentCompany().isBlank()) {
            score += 11;
        }
        if (profile.getHighestEducation() != null && !profile.getHighestEducation().isBlank()) {
            score += 11;
        }
        if (profile.getCurrentLocation() != null && !profile.getCurrentLocation().isBlank()) {
            score += 11;
        }

        // Experience info
        if (profile.getTotalExperienceYears() != null && profile.getTotalExperienceYears() > 0) {
            score += 11;
        }

        // Collections
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            score += 11;
        }
        if (profile.getExperiences() != null && !profile.getExperiences().isEmpty()) {
            score += 11;
        }

        return Math.min(score, 100);
    }
}
