package com.jobpilotai.backend.application.dto;

import com.jobpilotai.backend.application.domain.ApplicationStage;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class ApplicationTimeline {
    private ApplicationResponse application;
    private List<HistoryEntry> history;
    private List<NoteEntry> notes;

    @Data
    public static class HistoryEntry {
        private ApplicationStage fromStage;
        private ApplicationStage toStage;
        private String reason;
        private Instant timestamp;
        private String createdBy;
    }

    @Data
    public static class NoteEntry {
        private String text;
        private String type;
        private Instant timestamp;
        private String createdBy;
    }
}
