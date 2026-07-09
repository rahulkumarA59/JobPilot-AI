package com.jobpilotai.backend.candidateprofile.domain;

import com.jobpilotai.backend.common.domain.AuditableEntity;
import com.jobpilotai.backend.resume.domain.Resume;
import com.jobpilotai.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Represents a candidate profile built from resume parsing.
 * One active profile per active resume per user.
 */
@Getter
@Setter
@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile extends AuditableEntity {

    @org.hibernate.annotations.JdbcTypeCode(java.sql.Types.VARCHAR)
    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private UUID publicId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(name = "headline", length = 200)
    private String headline;

    @Column(name = "summary", length = 2000)
    private String summary;

    @Column(name = "total_experience_years")
    private Integer totalExperienceYears;

    @Column(name = "current_role", length = 150)
    private String currentRole;

    @Column(name = "current_company", length = 200)
    private String currentCompany;

    @Column(name = "highest_education", length = 150)
    private String highestEducation;

    @Column(name = "current_location", length = 150)
    private String currentLocation;

    @Column(name = "preferred_locations", length = 1000)
    private String preferredLocations;

    @Column(name = "expected_salary")
    private Long expectedSalary;

    @Column(name = "notice_period", length = 100)
    private String noticePeriod;

    @Column(name = "profile_strength")
    private Integer profileStrength; // 0-100

    @Column(name = "completeness_score")
    private Integer completenessScore; // 0-100

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateSkill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateExperience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateProject> projects = new ArrayList<>();

    @PrePersist
    private void prePersist() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
    }
}
