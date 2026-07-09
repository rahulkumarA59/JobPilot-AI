package com.jobpilotai.backend.application.mapper;

import com.jobpilotai.backend.application.domain.Application;
import com.jobpilotai.backend.application.domain.ApplicationHistory;
import com.jobpilotai.backend.application.domain.ApplicationNote;
import com.jobpilotai.backend.application.dto.ApplicationResponse;
import com.jobpilotai.backend.application.dto.ApplicationTimeline;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ApplicationMapper {

    @Mapping(target = "candidateProfileId", source = "candidateProfile.id")
    @Mapping(target = "jobId", source = "job.id")
    @Mapping(target = "companyId", source = "company.id")
    ApplicationResponse toResponse(Application application);

    @Mapping(target = "timestamp", source = "createdAt")
    ApplicationTimeline.HistoryEntry toHistoryEntry(ApplicationHistory history);

    @Mapping(target = "text", source = "noteText")
    @Mapping(target = "type", source = "noteType")
    @Mapping(target = "timestamp", source = "createdAt")
    ApplicationTimeline.NoteEntry toNoteEntry(ApplicationNote note);
}
