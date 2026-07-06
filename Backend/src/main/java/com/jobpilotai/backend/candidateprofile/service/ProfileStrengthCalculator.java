package com.jobpilotai.backend.candidateprofile.service;

import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import org.springframework.stereotype.Service;

/**
 * Calculates profile strength score (0-100) based on quality indicators.
 * Evaluates skills, experience, projects, education, and certifications.
 */
@Service
public class ProfileStrengthCalculator {

    /**
     * Calculate profile strength score (0-100)
     * Based on: number and diversity of skills, years of experience,
     * number of projects, education level, and certifications
     */
    public Integer calculateStrength(CandidateProfile profile) {
        int score = 0;

        // Skills evaluation (max 25 points)
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            int skillCount = profile.getSkills().size();
            // 1-3 skills: 8 points, 4-6 skills: 15 points, 7+ skills: 25 points
            if (skillCount >= 7) {
                score += 25;
            } else if (skillCount >= 4) {
                score += 15;
            } else if (skillCount >= 1) {
                score += 8;
            }

            // Advanced skills bonus
            long advancedCount = profile.getSkills().stream()
                    .filter(s -> s.getProficiency().name().equals("ADVANCED") ||
                                 s.getProficiency().name().equals("EXPERT"))
                    .count();
            if (advancedCount > 0) {
                score += Math.min(10, advancedCount * 2);
            }
        }

        // Experience evaluation (max 25 points)
        if (profile.getExperiences() != null && !profile.getExperiences().isEmpty()) {
            int experienceCount = profile.getExperiences().size();
            // 1 job: 8 points, 2-3 jobs: 15 points, 4+ jobs: 25 points
            if (experienceCount >= 4) {
                score += 25;
            } else if (experienceCount >= 2) {
                score += 15;
            } else {
                score += 8;
            }
        }

        // Years of experience bonus (max 15 points)
        if (profile.getTotalExperienceYears() != null) {
            int years = profile.getTotalExperienceYears();
            if (years >= 10) {
                score += 15;
            } else if (years >= 5) {
                score += 10;
            } else if (years >= 1) {
                score += 5;
            }
        }

        // Projects (max 15 points)
        if (profile.getProjects() != null && !profile.getProjects().isEmpty()) {
            int projectCount = profile.getProjects().size();
            if (projectCount >= 3) {
                score += 15;
            } else if (projectCount >= 2) {
                score += 10;
            } else {
                score += 5;
            }
        }

        // Education (max 10 points)
        if (profile.getHighestEducation() != null && !profile.getHighestEducation().isBlank()) {
            String education = profile.getHighestEducation().toUpperCase();
            if (education.contains("MASTER") || education.contains("M.") || education.contains("MBA")) {
                score += 10;
            } else if (education.contains("BACHELOR") || education.contains("B.")) {
                score += 7;
            } else if (education.contains("DIPLOMA") || education.contains("CERTIFICATION")) {
                score += 4;
            }
        }

        return Math.min(score, 100);
    }
}
