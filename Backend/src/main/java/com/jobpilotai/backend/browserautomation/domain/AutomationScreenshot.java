package com.jobpilotai.backend.browserautomation.domain;

import com.jobpilotai.backend.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "automation_screenshots")
@Getter
@Setter
public class AutomationScreenshot extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "execution_id", nullable = false)
    private AutomationExecution execution;

    @Enumerated(EnumType.STRING)
    @Column(name = "screenshot_type", nullable = false, length = 50)
    private ScreenshotType screenshotType;

    @Column(name = "file_path", nullable = false, length = 1024)
    private String filePath;
}
