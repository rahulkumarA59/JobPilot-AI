package com.jobpilotai.backend.ai.context;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ContextBuilder {

    public String buildContext(String candidateProfile, String resume, String job, String company) {
        return buildContext(candidateProfile, resume, job, company, null, null);
    }

    public String buildContext(String candidateProfile, String resume, String job,
                               String company, String applicationContext, String workflowContext) {
        StringBuilder sb = new StringBuilder();

        if (candidateProfile != null && !candidateProfile.isBlank()) {
            sb.append("=== CANDIDATE PROFILE ===\n").append(candidateProfile).append("\n\n");
        }

        if (resume != null && !resume.isBlank()) {
            sb.append("=== RESUME ===\n").append(resume).append("\n\n");
        }

        if (job != null && !job.isBlank()) {
            sb.append("=== JOB LISTING ===\n").append(job).append("\n\n");
        }

        if (company != null && !company.isBlank()) {
            sb.append("=== COMPANY ===\n").append(company).append("\n\n");
        }

        if (applicationContext != null && !applicationContext.isBlank()) {
            sb.append("=== APPLICATION CONTEXT ===\n").append(applicationContext).append("\n\n");
        }

        if (workflowContext != null && !workflowContext.isBlank()) {
            sb.append("=== WORKFLOW CONTEXT ===\n").append(workflowContext).append("\n\n");
        }

        String context = sb.toString().trim();
        log.debug("Built context. Total length: {} characters", context.length());
        return context;
    }
}
