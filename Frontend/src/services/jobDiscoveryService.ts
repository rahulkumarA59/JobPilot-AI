import useJobDiscoveryStore from "@/store/jobDiscoveryStore";

interface JobDiscoveryStats {
  totalJobsFoundToday: number;
  newJobs: number;
  jobsReadyForMatching: number;
  duplicateJobsRemoved: number;
  sourcesActive: string;
  aiDiscoveryStatus: string;
}

interface JobSource {
  name: string;
  status: string;
  jobsFound: number;
  lastScan: string;
  health: string;
}

interface DiscoveryActivityItem {
  time: string;
  description: string;
}

// Mock API functions
const fetchJobDiscoveryStats = (): Promise<JobDiscoveryStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalJobsFoundToday: 1234,
        newJobs: 250,
        jobsReadyForMatching: 789,
        duplicateJobsRemoved: 150,
        sourcesActive: "6/8",
        aiDiscoveryStatus: "Active",
      });
    }, 500);
  });
};

const fetchRecentJobSources = (): Promise<JobSource[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "LinkedIn", status: "Active", jobsFound: 120, lastScan: "2 mins ago", health: "Good" },
        { name: "Greenhouse", status: "Active", jobsFound: 80, lastScan: "5 mins ago", health: "Good" },
        { name: "Lever", status: "Active", jobsFound: 50, lastScan: "10 mins ago", health: "Good" },
        { name: "Workday", status: "Inactive", jobsFound: 0, lastScan: "1 hour ago", health: "Poor" },
        { name: "Wellfound", status: "Active", jobsFound: 30, lastScan: "15 mins ago", health: "Good" },
        { name: "Company Career Pages", status: "Active", jobsFound: 100, lastScan: "3 mins ago", health: "Good" },
      ]);
    }, 700);
  });
};

const fetchDiscoveryActivity = (): Promise<DiscoveryActivityItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { time: "09:15", description: "Searching Greenhouse..." },
        { time: "09:16", description: "Found 23 Jobs" },
        { time: "09:17", description: "Removing Duplicates" },
        { time: "09:18", description: "Ready for Matching" },
      ]);
    }, 600);
  });
};

export const jobDiscoveryService = {
  fetchJobDiscoveryStats,
  fetchRecentJobSources,
  fetchDiscoveryActivity,
};