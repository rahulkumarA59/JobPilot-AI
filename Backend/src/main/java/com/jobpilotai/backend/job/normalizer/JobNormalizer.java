package com.jobpilotai.backend.job.normalizer;

import com.jobpilotai.backend.job.dto.NormalizedJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Normalization engine for job data.
 * Standardises titles, companies, locations, salaries, and other fields
 * across all connectors into a consistent format.
 */
@Component
public class JobNormalizer {

    private static final Logger log = LoggerFactory.getLogger(JobNormalizer.class);

    /**
     * Normalize a list of jobs.
     */
    public List<NormalizedJob> normalizeAll(List<NormalizedJob> jobs) {
        log.info("Jobs Normalized: normalizing {} jobs", jobs.size());
        return jobs.stream()
                .map(this::normalize)
                .collect(Collectors.toList());
    }

    /**
     * Normalize a single job — cleans and standardises all fields.
     */
    public NormalizedJob normalize(NormalizedJob job) {
        job.setTitle(normalizeTitle(job.getTitle()));
        job.setCompanyName(normalizeCompanyName(job.getCompanyName()));
        job.setLocation(normalizeLocation(job.getLocation()));
        job.setRemoteType(normalizeRemoteType(job.getRemoteType()));
        job.setEmploymentType(normalizeEmploymentType(job.getEmploymentType()));
        job.setExperienceLevel(normalizeExperienceLevel(job.getExperienceLevel()));
        job.setDescription(normalizeDescription(job.getDescription()));
        job.setApplyUrl(normalizeUrl(job.getApplyUrl()));
        job.setJobUrl(normalizeUrl(job.getJobUrl()));
        normalizeSalary(job);
        normalizeSkills(job);
        normalizeBenefits(job);
        return job;
    }

    // ── Field normalizers ────────────────────────────────────

    private String normalizeTitle(String title) {
        if (title == null || title.isBlank()) return title;
        // Trim whitespace and collapse multiple spaces
        return title.strip().replaceAll("\\s+", " ");
    }

    private String normalizeCompanyName(String name) {
        if (name == null || name.isBlank()) return name;
        // Trim and normalise common suffixes
        String cleaned = name.strip().replaceAll("\\s+", " ");
        // Standardise common abbreviations
        cleaned = cleaned.replaceAll("(?i)\\bInc\\.?$", "Inc")
                         .replaceAll("(?i)\\bCorp\\.?$", "Corp")
                         .replaceAll("(?i)\\bLtd\\.?$", "Ltd")
                         .replaceAll("(?i)\\bLLC\\.?$", "LLC");
        return cleaned;
    }

    private String normalizeLocation(String location) {
        if (location == null || location.isBlank()) return location;
        String cleaned = location.strip().replaceAll("\\s+", " ");
        // Standardise "Remote" variants
        if (cleaned.equalsIgnoreCase("remote") || cleaned.equalsIgnoreCase("anywhere")) {
            return "Remote";
        }
        return cleaned;
    }

    private String normalizeRemoteType(String remoteType) {
        if (remoteType == null || remoteType.isBlank()) return null;
        String upper = remoteType.strip().toUpperCase();
        return switch (upper) {
            case "REMOTE", "FULLY_REMOTE", "FULL_REMOTE", "100_REMOTE" -> "REMOTE";
            case "HYBRID", "PARTIALLY_REMOTE", "FLEXIBLE" -> "HYBRID";
            case "ONSITE", "ON_SITE", "IN_OFFICE", "OFFICE" -> "ONSITE";
            default -> upper;
        };
    }

    private String normalizeEmploymentType(String type) {
        if (type == null || type.isBlank()) return null;
        String upper = type.strip().toUpperCase().replace("-", "_").replace(" ", "_");
        return switch (upper) {
            case "FULL_TIME", "FULLTIME", "FT" -> "FULL_TIME";
            case "PART_TIME", "PARTTIME", "PT" -> "PART_TIME";
            case "INTERNSHIP", "INTERN" -> "INTERNSHIP";
            case "CONTRACT", "CONTRACTOR", "TEMP" -> "CONTRACT";
            case "FREELANCE", "FREELANCER", "GIG" -> "FREELANCE";
            default -> upper;
        };
    }

    private String normalizeExperienceLevel(String level) {
        if (level == null || level.isBlank()) return level;
        String lower = level.strip().toLowerCase();
        return switch (lower) {
            case "entry", "entry-level", "entry level", "junior", "associate" -> "Entry-level";
            case "mid", "mid-level", "mid level", "intermediate" -> "Mid-level";
            case "senior", "sr", "sr.", "lead" -> "Senior";
            case "principal", "staff", "distinguished" -> "Principal";
            case "executive", "director", "vp", "c-level" -> "Executive";
            default -> level.strip();
        };
    }

    private String normalizeDescription(String description) {
        if (description == null || description.isBlank()) return description;
        // Trim and normalise whitespace
        return description.strip().replaceAll("\\r\\n", "\n").replaceAll("\\n{3,}", "\n\n");
    }

    private String normalizeUrl(String url) {
        if (url == null || url.isBlank()) return url;
        return url.strip();
    }

    private void normalizeSalary(NormalizedJob job) {
        // Ensure min <= max
        if (job.getSalaryMin() != null && job.getSalaryMax() != null) {
            if (job.getSalaryMin() > job.getSalaryMax()) {
                Long temp = job.getSalaryMin();
                job.setSalaryMin(job.getSalaryMax());
                job.setSalaryMax(temp);
            }
        }
        // Default currency
        if ((job.getSalaryMin() != null || job.getSalaryMax() != null) && job.getCurrency() == null) {
            job.setCurrency("USD");
        }
    }

    private void normalizeSkills(NormalizedJob job) {
        if (job.getSkills() != null) {
            job.setSkills(job.getSkills().stream()
                    .map(String::strip)
                    .filter(s -> !s.isBlank())
                    .distinct()
                    .collect(Collectors.toList()));
        }
    }

    private void normalizeBenefits(NormalizedJob job) {
        if (job.getBenefits() != null) {
            job.setBenefits(job.getBenefits().stream()
                    .map(String::strip)
                    .filter(s -> !s.isBlank())
                    .distinct()
                    .collect(Collectors.toList()));
        }
    }
}
