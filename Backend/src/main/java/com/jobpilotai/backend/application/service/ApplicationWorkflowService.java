package com.jobpilotai.backend.application.service;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationStage;
import java.lang.IllegalArgumentException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationWorkflowService {

    private final ApplicationTrackerService trackerService;

    @Transactional
    public void transitionTo(Application application, ApplicationStage targetStage, String reason, String actor) {
        ApplicationStage currentStage = application.getStage();
        
        if (!isValidTransition(currentStage, targetStage)) {
            throw new IllegalArgumentException("Invalid workflow transition from " + currentStage + " to " + targetStage);
        }

        application.setStage(targetStage);
        trackerService.recordTransition(application, currentStage, targetStage, reason, actor);
    }

    private boolean isValidTransition(ApplicationStage current, ApplicationStage target) {
        if (current == target) return false;
        if (current.isTerminal() && target != ApplicationStage.QUEUED) {
            return false;
        }

        return switch (target) {
            case QUEUED -> current == ApplicationStage.FAILED; // Retry
            case READY -> current == ApplicationStage.QUEUED;
            case PREPARING -> current == ApplicationStage.QUEUED || current == ApplicationStage.READY;
            case READY_TO_APPLY -> current == ApplicationStage.PREPARING;
            case APPLYING -> current == ApplicationStage.READY_TO_APPLY;
            case APPLIED -> current == ApplicationStage.APPLYING;
            case APPLICATION_CONFIRMED -> current == ApplicationStage.APPLIED;
            case ASSESSMENT -> current == ApplicationStage.APPLICATION_CONFIRMED || current == ApplicationStage.APPLIED;
            case INTERVIEW -> current == ApplicationStage.ASSESSMENT || current == ApplicationStage.APPLICATION_CONFIRMED;
            case OFFER -> current == ApplicationStage.INTERVIEW;
            case HIRED -> current == ApplicationStage.OFFER;
            case FAILED -> !current.isTerminal();
            case REJECTED -> !current.isTerminal();
            case WITHDRAWN -> !current.isTerminal();
        };
    }
}
