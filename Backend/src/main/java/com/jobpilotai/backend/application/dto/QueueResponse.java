package com.jobpilotai.backend.application.dto;

import lombok.Data;

import java.util.List;

@Data
public class QueueResponse {
    private int totalQueued;
    private int critical;
    private int high;
    private int medium;
    private int low;
    private List<ApplicationResponse> nextApplications;
}
