package com.jobpilotai.backend.ai.learning;

import com.jobpilotai.backend.ai.dto.LearningRoadmap;
import com.jobpilotai.backend.ai.dto.SkillGap;
import com.jobpilotai.backend.ai.matching.SkillGapAnalyzer;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Job;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Generates a deterministic learning roadmap based on skill gaps.
 */
@Service
public class LearningRoadmapService {

    private final SkillGapAnalyzer skillGapAnalyzer;

    public LearningRoadmapService(SkillGapAnalyzer skillGapAnalyzer) {
        this.skillGapAnalyzer = skillGapAnalyzer;
    }

    public LearningRoadmap generateRoadmap(CandidateProfile candidate, Job job) {
        SkillGap gap = skillGapAnalyzer.analyzeSkillGap(candidate, job);
        
        List<String> missing = gap.getMissingSkills();
        
        List<String> dailyTasks = new ArrayList<>();
        List<String> weeklyGoals = new ArrayList<>();
        List<String> monthlyGoals = new ArrayList<>();
        List<String> courses = new ArrayList<>();
        List<String> problems = new ArrayList<>();
        List<String> certs = new ArrayList<>();

        if (missing.isEmpty()) {
            dailyTasks.add("Review advanced concepts in your strong skills.");
            weeklyGoals.add("Prepare for behavioral interviews.");
            courses.add("Advanced System Design");
        } else {
            String primaryTarget = missing.get(0);
            dailyTasks.add("Spend 1 hour reading documentation for " + primaryTarget);
            dailyTasks.add("Complete 1 practice problem related to " + primaryTarget);
            
            weeklyGoals.add("Build a small proof-of-concept project using " + primaryTarget);
            
            if (missing.size() > 1) {
                monthlyGoals.add("Master " + primaryTarget + " and " + missing.get(1));
            } else {
                monthlyGoals.add("Master " + primaryTarget);
            }
            
            for (String skill : missing) {
                courses.add("The Complete " + skill + " Bootcamp (Udemy/Coursera)");
                problems.add(skill + " algorithmic challenges on LeetCode/HackerRank");
                if (skill.toLowerCase().contains("aws") || skill.toLowerCase().contains("cloud")) {
                    certs.add("AWS Certified Solutions Architect");
                }
            }
        }

        return LearningRoadmap.builder()
                .dailyTasks(dailyTasks)
                .weeklyGoals(weeklyGoals)
                .monthlyGoals(monthlyGoals)
                .recommendedCourses(courses)
                .practiceProblems(problems)
                .certificationPath(certs)
                .build();
    }
}
