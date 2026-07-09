package com.jobpilotai.backend.ai.rules;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "ai.scoring")
public class ScoringRules {

    private int skillWeight = 40;
    private int experienceWeight = 25;
    private int educationWeight = 10;
    private int locationWeight = 10;
    private int salaryWeight = 10;
    private int remoteWeight = 5;

    private int minAcceptableScore = 50;

    // Getters and Setters
    public int getSkillWeight() { return skillWeight; }
    public void setSkillWeight(int skillWeight) { this.skillWeight = skillWeight; }
    
    public int getExperienceWeight() { return experienceWeight; }
    public void setExperienceWeight(int experienceWeight) { this.experienceWeight = experienceWeight; }

    public int getEducationWeight() { return educationWeight; }
    public void setEducationWeight(int educationWeight) { this.educationWeight = educationWeight; }

    public int getLocationWeight() { return locationWeight; }
    public void setLocationWeight(int locationWeight) { this.locationWeight = locationWeight; }

    public int getSalaryWeight() { return salaryWeight; }
    public void setSalaryWeight(int salaryWeight) { this.salaryWeight = salaryWeight; }

    public int getRemoteWeight() { return remoteWeight; }
    public void setRemoteWeight(int remoteWeight) { this.remoteWeight = remoteWeight; }

    public int getMinAcceptableScore() { return minAcceptableScore; }
    public void setMinAcceptableScore(int minAcceptableScore) { this.minAcceptableScore = minAcceptableScore; }
}
