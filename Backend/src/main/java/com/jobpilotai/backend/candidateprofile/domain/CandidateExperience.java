package com.jobpilotai.backend.candidateprofile.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents work experience of a candidate extracted from resume.
 */
@Getter
@Setter
@Entity
@Table(name = "candidate_experiences")
public class CandidateExperience extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private CandidateProfile profile;

    @Column(name = "company", nullable = false, length = 200)
    private String company;

    @Column(name = "designation", nullable = false, length = 150)
    private String designation;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "duration", length = 100)
    private String duration; // e.g., "2 years 3 months"

    @ElementCollection
    @CollectionTable(name = "candidate_experience_technologies", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "technology")
    private List<String> technologies = new ArrayList<>();
}
