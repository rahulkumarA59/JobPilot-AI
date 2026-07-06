package com.jobpilotai.backend.resumeversion.repository;

import com.jobpilotai.backend.resume.domain.Resume;
import com.jobpilotai.backend.resumeversion.domain.ResumeVersion;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeVersionRepository extends JpaRepository<ResumeVersion, Long> {

    List<ResumeVersion> findByResumeOrderByVersionNumber(Resume resume);
}

