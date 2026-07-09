package com.jobpilotai.backend.application.service;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationHistory;
import com.jobpilotai.backend.application.domain.ApplicationNote;
import com.jobpilotai.backend.application.domain.ApplicationStage;
import com.jobpilotai.backend.application.repository.ApplicationHistoryRepository;
import com.jobpilotai.backend.application.repository.ApplicationNoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationTrackerService {

    private final ApplicationHistoryRepository historyRepository;
    private final ApplicationNoteRepository noteRepository;

    @Transactional
    public void recordTransition(Application application, ApplicationStage fromStage, ApplicationStage toStage, String reason, String actor) {
        ApplicationHistory history = new ApplicationHistory();
        history.setApplication(application);
        history.setFromStage(fromStage);
        history.setToStage(toStage);
        history.setReason(reason);
        history.setCreatedBy(actor);
        historyRepository.save(history);
        
        log.info("Application {} transitioned from {} to {}. Reason: {}", application.getPublicId(), fromStage, toStage, reason);
    }

    @Transactional
    public void addNote(Application application, String text, String type, String actor) {
        ApplicationNote note = new ApplicationNote();
        note.setApplication(application);
        note.setNoteText(text);
        note.setNoteType(type != null ? type : "SYSTEM");
        note.setCreatedBy(actor);
        noteRepository.save(note);
    }
}
