package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SkillGap {
    private List<String> missingSkills;
    private List<String> weakSkills;
    private List<String> strongSkills;
    private List<String> recommendedSkills;
    private int priorityScore; // 0-100 indicating urgency of upskilling
    private String learningDifficulty; // "Easy", "Medium", "Hard"
    private int estimatedLearningTimeWeeks;
}
