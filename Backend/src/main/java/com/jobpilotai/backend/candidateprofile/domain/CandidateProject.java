package com.jobpilotai.backend.candidateprofile.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a project associated with a candidate profile.
 */
@Getter
@Setter
@Entity
@Table(name = "candidate_projects")
public class CandidateProject extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private CandidateProfile profile;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "candidate_project_technologies", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "technology")
    private List<String> technologies = new ArrayList<>();

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "live_url", length = 500)
    private String liveUrl;
}
