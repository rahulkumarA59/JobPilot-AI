import { create } from 'zustand';

interface JobDiscoveryState {
  totalJobsFoundToday: number;
  newJobs: number;
  jobsReadyForMatching: number;
  duplicateJobsRemoved: number;
  sourcesActive: string;
  aiDiscoveryStatus: string;
  recentJobSources: JobSource[];
  discoveryActivity: TimelineItem[];
}

interface JobSource {
  name: string;
  status: 'Active' | 'Inactive';
  jobsFound: number;
  lastScan: string;
  health: 'Good' | 'Poor';
}

interface TimelineItem {
  time: string;
  description: string;
}

const useJobDiscoveryStore = create<JobDiscoveryState>((set) => ({
  totalJobsFoundToday: 1234,
  newJobs: 250,
  jobsReadyForMatching: 789,
  duplicateJobsRemoved: 150,
  sourcesActive: '6/8',
  aiDiscoveryStatus: 'Active',
  recentJobSources: [
    { name: 'LinkedIn', status: 'Active', jobsFound: 120, lastScan: '2 mins ago', health: 'Good' },
    { name: 'Greenhouse', status: 'Active', jobsFound: 80, lastScan: '5 mins ago', health: 'Good' },
    { name: 'Lever', status: 'Active', jobsFound: 50, lastScan: '10 mins ago', health: 'Good' },
    { name: 'Workday', status: 'Inactive', jobsFound: 0, lastScan: '1 hour ago', health: 'Poor' },
    { name: 'Wellfound', status: 'Active', jobsFound: 30, lastScan: '15 mins ago', health: 'Good' },
    { name: 'Company Career Pages', status: 'Active', jobsFound: 100, lastScan: '3 mins ago', health: 'Good' },
  ],
  discoveryActivity: [
    { time: '09:15', description: 'Searching Greenhouse...' },
    { time: '09:16', description: 'Found 23 Jobs' },
    { time: '09:17', description: 'Removing Duplicates' },
    { time: '09:18', description: 'Ready for Matching' },
  ],
}));

export default useJobDiscoveryStore;