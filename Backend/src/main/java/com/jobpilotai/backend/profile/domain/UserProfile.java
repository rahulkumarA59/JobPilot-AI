package com.jobpilotai.backend.profile.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import com.jobpilotai.backend.user.domain.User;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "user_profiles")
public class UserProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 255)
    private String headline;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(length = 150)
    private String location;

    @ElementCollection
    @CollectionTable(name = "user_profile_target_roles", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "target_role", length = 150)
    private List<String> targetRoles = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_profile_target_locations", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "target_location", length = 150)
    private List<String> targetLocations = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "remote_preference", length = 50)
    private RemotePreference remotePreference;

    @Column(name = "years_experience", precision = 4, scale = 1)
    private BigDecimal yearsExperience;
}
