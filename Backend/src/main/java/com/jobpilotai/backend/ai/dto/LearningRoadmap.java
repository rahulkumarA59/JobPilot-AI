package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LearningRoadmap {
    private List<String> dailyTasks;
    private List<String> weeklyGoals;
    private List<String> monthlyGoals;
    private List<String> recommendedCourses;
    private List<String> practiceProblems;
    private List<String> certificationPath;
}
