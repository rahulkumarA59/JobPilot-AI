package com.jobpilotai.backend.job.mapper;

import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.domain.Job;
import com.jobpilotai.backend.job.domain.JobBenefit;
import com.jobpilotai.backend.job.domain.JobSkill;
import com.jobpilotai.backend.job.dto.CompanyResponse;
import com.jobpilotai.backend.job.dto.JobResponse;
import com.jobpilotai.backend.job.dto.JobSkillResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

/**
 * MapStruct mapper for Job Intelligence domain entities to DTOs.
 */
@Mapper(componentModel = "spring")
public interface JobMapper {

    // ── Company ──────────────────────────────────────────────

    CompanyResponse toCompanyResponse(Company company);

    List<CompanyResponse> toCompanyResponseList(List<Company> companies);

    // ── JobSkill ─────────────────────────────────────────────

    JobSkillResponse toJobSkillResponse(JobSkill skill);

    List<JobSkillResponse> toJobSkillResponseList(List<JobSkill> skills);

    // ── Job ──────────────────────────────────────────────────

    @Mapping(target = "source", expression = "java(job.getSource().name())")
    @Mapping(target = "remoteType", expression = "java(job.getRemoteType() != null ? job.getRemoteType().name() : null)")
    @Mapping(target = "employmentType", expression = "java(job.getEmploymentType() != null ? job.getEmploymentType().name() : null)")
    @Mapping(target = "status", expression = "java(job.getStatus().name())")
    @Mapping(target = "company", source = "company")
    @Mapping(target = "skills", source = "skills")
    @Mapping(target = "benefits", source = "benefits", qualifiedByName = "benefitsToBenefitStrings")
    JobResponse toJobResponse(Job job);

    List<JobResponse> toJobResponseList(List<Job> jobs);

    // ── Helpers ──────────────────────────────────────────────

    @Named("benefitsToBenefitStrings")
    default List<String> benefitsToBenefitStrings(List<JobBenefit> benefits) {
        if (benefits == null) {
            return List.of();
        }
        return benefits.stream()
                .map(JobBenefit::getBenefit)
                .collect(Collectors.toList());
    }
}
