package com.jobpilotai.backend.ai.ranking;

import com.jobpilotai.backend.ai.dto.MatchResult;
import com.jobpilotai.backend.ai.dto.RankedJob;
import com.jobpilotai.backend.ai.matching.ATSMatchingService;
import com.jobpilotai.backend.candidateprofile.domain.CandidateProfile;
import com.jobpilotai.backend.job.domain.Company;
import com.jobpilotai.backend.job.domain.Job;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobRankingServiceTest {

    @Mock private ATSMatchingService matchingService;
    @InjectMocks private JobRankingService rankingService;

    @Test
    void rankJobs_sortsByScore() {
        CandidateProfile candidate = new CandidateProfile();

        Job j1 = new Job();
        j1.setId(1L);
        j1.setTitle("J1");
        Company c1 = new Company(); c1.setName("C1"); j1.setCompany(c1);
        
        Job j2 = new Job();
        j2.setId(2L);
        j2.setTitle("J2");
        Company c2 = new Company(); c2.setName("C2"); j2.setCompany(c2);

        MatchResult mr1 = MatchResult.builder().jobId(1L).overallScore(50).build();
        MatchResult mr2 = MatchResult.builder().jobId(2L).overallScore(90).build();

        when(matchingService.calculateMatch(eq(candidate), eq(j1))).thenReturn(mr1);
        when(matchingService.calculateMatch(eq(candidate), eq(j2))).thenReturn(mr2);

        List<RankedJob> ranked = rankingService.rankJobs(candidate, List.of(j1, j2));

        assertEquals(2, ranked.size());
        assertEquals(2L, ranked.get(0).getJobId()); // J2 should be first
        assertEquals(1, ranked.get(0).getRank());
        assertEquals(90, ranked.get(0).getMatchScore());
        assertEquals(1L, ranked.get(1).getJobId());
        assertEquals(2, ranked.get(1).getRank());
        assertEquals(50, ranked.get(1).getMatchScore());
    }
}
