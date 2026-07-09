package com.jobpilotai.backend.job.mapper;

import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.domain.JobBenefit;
import com.jobpilotai.backend.job.domain.JobSkill;
import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.enums.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

/**
 * MapStruct mapper for converting NormalizedJob DTOs to Job entities.
 */
@Mapper(componentModel = "spring")
public interface JobNormalizerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "benefits", ignore = true)
    @Mapping(target = "checksum", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "source", source = "source", qualifiedByName = "stringToJobSource")
    @Mapping(target = "remoteType", source = "remoteType", qualifiedByName = "stringToRemoteType")
    @Mapping(target = "employmentType", source = "employmentType", qualifiedByName = "stringToEmploymentType")
    Job toJobEntity(NormalizedJob normalizedJob);

    // ── Enum converters ──────────────────────────────────────

    @Named("stringToJobSource")
    default JobSource stringToJobSource(String source) {
        if (source == null) return null;
        try { return JobSource.valueOf(source); }
        catch (IllegalArgumentException e) { return null; }
    }

    @Named("stringToRemoteType")
    default RemoteType stringToRemoteType(String type) {
        if (type == null) return null;
        try { return RemoteType.valueOf(type); }
        catch (IllegalArgumentException e) { return null; }
    }

    @Named("stringToEmploymentType")
    default EmploymentType stringToEmploymentType(String type) {
        if (type == null) return null;
        try { return EmploymentType.valueOf(type); }
        catch (IllegalArgumentException e) { return null; }
    }
}
