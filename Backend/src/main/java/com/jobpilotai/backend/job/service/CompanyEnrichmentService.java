package com.jobpilotai.backend.job.service;

import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.dto.NormalizedJob;
import com.jobpilotai.backend.job.repository.CompanyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service for company data enrichment and normalization.
 * Ensures consistent company records across all connector sources.
 */
@Service
public class CompanyEnrichmentService {

    private static final Logger log = LoggerFactory.getLogger(CompanyEnrichmentService.class);

    private final CompanyRepository companyRepository;

    public CompanyEnrichmentService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    /**
     * Enrich and normalize company data from a normalized job.
     * Returns an existing company if found, or creates a new one.
     */
    @Transactional
    public Company enrichAndResolve(NormalizedJob job) {
        String normalizedName = normalizeCompanyName(job.getCompanyName());

        // Try to find existing company by name
        Optional<Company> existing = companyRepository.findByNameIgnoreCase(normalizedName);
        if (existing.isPresent()) {
            Company company = existing.get();
            // Enrich missing fields from the job data
            enrichExistingCompany(company, job);
            return companyRepository.save(company);
        }

        // Create new company
        Company company = new Company();
        company.setName(normalizedName);
        company.setWebsite(normalizeUrl(job.getCompanyWebsite()));
        company.setLogoUrl(job.getCompanyLogoUrl());
        company.setIndustry(job.getCompanyIndustry());
        company.setHeadquarters(job.getCompanyHeadquarters());
        company.setSize(job.getCompanySize());
        company.setDescription(job.getCompanyDescription());

        company = companyRepository.save(company);
        log.info("Company Created: {} (publicId={})", company.getName(), company.getPublicId());

        return company;
    }

    /**
     * Normalize company name — trim, collapse spaces, standardise suffixes.
     */
    public String normalizeCompanyName(String name) {
        if (name == null || name.isBlank()) return name;
        String cleaned = name.strip().replaceAll("\\s+", " ");
        cleaned = cleaned.replaceAll("(?i)\\bInc\\.?$", "Inc")
                         .replaceAll("(?i)\\bCorp\\.?$", "Corp")
                         .replaceAll("(?i)\\bLtd\\.?$", "Ltd")
                         .replaceAll("(?i)\\bLLC\\.?$", "LLC");
        return cleaned;
    }

    // ── Private helpers ──────────────────────────────────────

    private void enrichExistingCompany(Company company, NormalizedJob job) {
        boolean updated = false;
        if (company.getWebsite() == null && job.getCompanyWebsite() != null) {
            company.setWebsite(normalizeUrl(job.getCompanyWebsite()));
            updated = true;
        }
        if (company.getLogoUrl() == null && job.getCompanyLogoUrl() != null) {
            company.setLogoUrl(job.getCompanyLogoUrl());
            updated = true;
        }
        if (company.getIndustry() == null && job.getCompanyIndustry() != null) {
            company.setIndustry(job.getCompanyIndustry());
            updated = true;
        }
        if (company.getHeadquarters() == null && job.getCompanyHeadquarters() != null) {
            company.setHeadquarters(job.getCompanyHeadquarters());
            updated = true;
        }
        if (company.getSize() == null && job.getCompanySize() != null) {
            company.setSize(job.getCompanySize());
            updated = true;
        }
        if (company.getDescription() == null && job.getCompanyDescription() != null) {
            company.setDescription(job.getCompanyDescription());
            updated = true;
        }
        if (updated) {
            log.debug("Company enriched with new data: {}", company.getName());
        }
    }

    private String normalizeUrl(String url) {
        if (url == null || url.isBlank()) return url;
        return url.strip();
    }
}
