package com.jobpilotai.backend.ai.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ATSReport {
    private int atsScore;
    private int sectionScore;
    private int keywordScore;
    private int formattingScore;
    private int experienceScore;
    private int skillScore;
    private List<String> suggestions;
}
