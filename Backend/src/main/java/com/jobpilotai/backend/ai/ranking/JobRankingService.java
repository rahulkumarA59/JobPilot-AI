package com.jobpilotai.backend.ai.ranking;

import com.jobpilotai.backend.ai.dto.MatchResult;
import com.jobpilotai.backend.ai.dto.RankedJob;
import com.jobpilotai.backend.ai.matching.ATSMatchingService;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Job;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Ranks jobs for a candidate based on match score, salary, and company rating.
 */
@Service
public class JobRankingService {

    private final ATSMatchingService matchingService;

    public JobRankingService(ATSMatchingService matchingService) {
        this.matchingService = matchingService;
    }

    public List<RankedJob> rankJobs(CandidateProfile candidate, List<Job> jobs) {
        AtomicInteger rankCounter = new AtomicInteger(1);
        
        return jobs.stream()
                .map(job -> {
                    MatchResult result = matchingService.calculateMatch(candidate, job);
                    
                    // Base score = match score
                    double finalScore = result.getOverallScore();
                    
                    // V1 deterministic adjustments
                    double companyRating = 4.0; // Mock company rating
                    finalScore += companyRating * 2; // Rating gives slight bump

                    return new JobAndScore(job, result.getOverallScore(), finalScore, result.getRemoteScore() == 100);
                })
                .sorted(Comparator.comparingDouble(JobAndScore::getFinalScore).reversed())
                .map(js -> RankedJob.builder()
                        .jobId(js.job.getId())
                        .jobTitle(js.job.getTitle())
                        .companyName(js.job.getCompany().getName())
                        .rank(rankCounter.getAndIncrement())
                        .matchScore(js.matchScore)
                        .salary(js.job.getSalaryMax())
                        .companyRating(4.0)
                        .remoteMatch(js.remoteMatch)
                        .build())
                .collect(Collectors.toList());
    }

    private static class JobAndScore {
        Job job;
        int matchScore;
        double finalScore;
        boolean remoteMatch;

        JobAndScore(Job job, int matchScore, double finalScore, boolean remoteMatch) {
            this.job = job;
            this.matchScore = matchScore;
            this.finalScore = finalScore;
            this.remoteMatch = remoteMatch;
        }
        
        double getFinalScore() { return finalScore; }
    }
}
