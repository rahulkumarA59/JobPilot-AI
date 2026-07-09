package com.jobpilotai.backend.job.service;

import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.dto.CompanyResponse;
import com.jobpilotai.backend.job.mapper.JobMapper;
import com.jobpilotai.backend.job.repository.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * CRUD service for Company entities.
 * Handles company deduplication by name (case-insensitive).
 */
@Service
public class CompanyService {

    private static final Logger log = LoggerFactory.getLogger(CompanyService.class);

    private final CompanyRepository companyRepository;
    private final JobMapper jobMapper;

    public CompanyService(CompanyRepository companyRepository, JobMapper jobMapper) {
        this.companyRepository = companyRepository;
        this.jobMapper = jobMapper;
    }

    /**
     * Get or create a company. Ensures the same company is not duplicated.
     */
    @Transactional
    public Company getOrCreate(String name, String website, String logoUrl,
                                String industry, String headquarters, String size, String description) {
        // Try to find by name (case-insensitive)
        Optional<Company> existing = companyRepository.findByNameIgnoreCase(name);
        if (existing.isPresent()) {
            log.debug("Company already exists: {}", name);
            return existing.get();
        }

        // Create new company
        Company company = new Company();
        company.setName(name);
        company.setWebsite(website);
        company.setLogoUrl(logoUrl);
        company.setIndustry(industry);
        company.setHeadquarters(headquarters);
        company.setSize(size);
        company.setDescription(description);

        company = companyRepository.save(company);
        log.info("Company Created: {} (publicId={})", company.getName(), company.getPublicId());

        return company;
    }

    /**
     * Find company by public ID.
     */
    @Transactional(readOnly = true)
    public CompanyResponse findByPublicId(UUID publicId) {
        Company company = companyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found: " + publicId));
        return jobMapper.toCompanyResponse(company);
    }

    /**
     * List all companies (paginated).
     */
    @Transactional(readOnly = true)
    public Page<CompanyResponse> findAll(Pageable pageable) {
        return companyRepository.findAll(pageable)
                .map(jobMapper::toCompanyResponse);
    }

    /**
     * Update company details.
     */
    @Transactional
    public CompanyResponse update(UUID publicId, String website, String logoUrl,
                                   String industry, String headquarters, String size, String description) {
        Company company = companyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found: " + publicId));

        if (website != null) company.setWebsite(website);
        if (logoUrl != null) company.setLogoUrl(logoUrl);
        if (industry != null) company.setIndustry(industry);
        if (headquarters != null) company.setHeadquarters(headquarters);
        if (size != null) company.setSize(size);
        if (description != null) company.setDescription(description);

        company = companyRepository.save(company);
        log.info("Company updated: {} (publicId={})", company.getName(), company.getPublicId());

        return jobMapper.toCompanyResponse(company);
    }

    /**
     * Delete company by public ID.
     */
    @Transactional
    public void delete(UUID publicId) {
        Company company = companyRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Company not found: " + publicId));
        companyRepository.delete(company);
        log.info("Company deleted: {} (publicId={})", company.getName(), publicId);
    }
}
