package com.jobpilotai.backend.orchestrator.controller;

import com.jobpilotai.backend.orchestrator.domain.OrchestratorWorkflow;
import com.jobpilotai.backend.orchestrator.service.AutonomousPipelineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/pipeline")
@RequiredArgsConstructor
public class AutonomousPipelineController {

    private final AutonomousPipelineService pipelineService;

    @PostMapping("/start")
    public ResponseEntity<?> startPipeline(
            @RequestParam("userId") Long userId,
            @RequestParam("file") MultipartFile file) {
        
        try {
            log.info("Received request to start autonomous pipeline for user: {}", userId);
            
            // Run the pipeline asynchronously in a real application.
            // For now, we block to show the logs sequentially.
            OrchestratorWorkflow workflow = pipelineService.startFullPipeline(userId, file);
            
            return ResponseEntity.ok(Map.of(
                    "status", "COMPLETED",
                    "workflowId", workflow.getPublicId(),
                    "message", "Autonomous pipeline executed successfully."
            ));
            
        } catch (Exception e) {
            log.error("Pipeline execution failed", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "FAILED",
                    "error", e.getMessage()
            ));
        }
    }
}
