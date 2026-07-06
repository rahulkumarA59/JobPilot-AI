package com.jobpilotai.backend.candidateprofile.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a skill associated with a candidate profile.
 * Includes proficiency level and experience years.
 */
@Getter
@Setter
@Entity
@Table(name = "candidate_skills")
public class CandidateSkill extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private CandidateProfile profile;

    @Column(name = "skill_name", nullable = false, length = 150)
    private String skillName;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "proficiency", nullable = false, length = 20)
    private Proficiency proficiency;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "confidence_score")
    private Integer confidenceScore; // 0-100

    /**
     * Proficiency levels for candidate skills
     */
    public enum Proficiency {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }
}
