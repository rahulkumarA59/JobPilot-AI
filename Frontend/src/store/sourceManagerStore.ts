import { create } from 'zustand';

export interface JobSource {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'Active' | 'Disabled' | 'Maintenance';
  jobsFoundToday: number;
  averageMatchPercent: number;
  lastScanTime: string;
  health: 'Good' | 'Fair' | 'Poor';
  responseTime: string; // e.g. "1.2s"
  scanFrequency: string; // e.g. "Every 1 hour"
  priority: 'High' | 'Medium' | 'Low';
  retryAttempts: number;
  requestDelay: number; // in ms
}

interface SourceManagerState {
  sources: JobSource[];
  statusFilter: 'All' | 'Active' | 'Disabled' | 'Maintenance';
  sortBy: 'Jobs Found' | 'Health' | 'Match Rate' | 'Last Scan';
  searchQuery: string;
  selectedSource: JobSource | null;
  isConfigDrawerOpen: boolean;
  isLoading: boolean;
  
  // Actions
  setSources: (sources: JobSource[]) => void;
  setStatusFilter: (filter: 'All' | 'Active' | 'Disabled' | 'Maintenance') => void;
  setSortBy: (sortBy: 'Jobs Found' | 'Health' | 'Match Rate' | 'Last Scan') => void;
  setSearchQuery: (query: string) => void;
  setSelectedSource: (source: JobSource | null) => void;
  setConfigDrawerOpen: (isOpen: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Simulated operations
  toggleSourceStatus: (id: string) => void;
  scanSource: (id: string) => Promise<void>;
  updateSourceConfig: (id: string, updates: Partial<JobSource>) => void;
}

const initialSources: JobSource[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'World\'s largest professional network. Excellent for executive and tech positions.',
    logo: 'linkedin',
    status: 'Active',
    jobsFoundToday: 145,
    averageMatchPercent: 78,
    lastScanTime: '5 mins ago',
    health: 'Good',
    responseTime: '0.8s',
    scanFrequency: 'Every 30 mins',
    priority: 'High',
    retryAttempts: 3,
    requestDelay: 1000,
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    description: 'Enterprise Applicant Tracking System. High-quality structured postings.',
    logo: 'greenhouse',
    status: 'Active',
    jobsFoundToday: 92,
    averageMatchPercent: 82,
    lastScanTime: '12 mins ago',
    health: 'Good',
    responseTime: '0.5s',
    scanFrequency: 'Every 1 hour',
    priority: 'High',
    retryAttempts: 5,
    requestDelay: 500,
  },
  {
    id: 'lever',
    name: 'Lever',
    description: 'Modern recruitment platform. Focuses on startups and scale-ups.',
    logo: 'lever',
    status: 'Active',
    jobsFoundToday: 54,
    averageMatchPercent: 74,
    lastScanTime: '24 mins ago',
    health: 'Good',
    responseTime: '0.6s',
    scanFrequency: 'Every 1 hour',
    priority: 'Medium',
    retryAttempts: 3,
    requestDelay: 500,
  },
  {
    id: 'ashby',
    name: 'Ashby',
    description: 'All-in-one recruiting tool. Extremely fast APIs for high growth startups.',
    logo: 'ashby',
    status: 'Active',
    jobsFoundToday: 38,
    averageMatchPercent: 85,
    lastScanTime: '45 mins ago',
    health: 'Good',
    responseTime: '0.4s',
    scanFrequency: 'Every 2 hours',
    priority: 'Medium',
    retryAttempts: 3,
    requestDelay: 300,
  },
  {
    id: 'workday',
    name: 'Workday',
    description: 'Global enterprise cloud suite. Massive company career portal indexer.',
    logo: 'workday',
    status: 'Maintenance',
    jobsFoundToday: 0,
    averageMatchPercent: 0,
    lastScanTime: '6 hours ago',
    health: 'Poor',
    responseTime: '3.4s',
    scanFrequency: 'Every 12 hours',
    priority: 'Medium',
    retryAttempts: 2,
    requestDelay: 2000,
  },
  {
    id: 'wellfound',
    name: 'Wellfound',
    description: 'Formerly AngelList Talent. The premier platform for startup hiring.',
    logo: 'wellfound',
    status: 'Active',
    jobsFoundToday: 29,
    averageMatchPercent: 80,
    lastScanTime: '18 mins ago',
    health: 'Good',
    responseTime: '0.9s',
    scanFrequency: 'Every 1 hour',
    priority: 'High',
    retryAttempts: 4,
    requestDelay: 1000,
  },
  {
    id: 'remoteok',
    name: 'RemoteOK',
    description: 'Top job board for global remote work. Indexes decentralized jobs.',
    logo: 'remoteok',
    status: 'Active',
    jobsFoundToday: 41,
    averageMatchPercent: 76,
    lastScanTime: '1 hour ago',
    health: 'Good',
    responseTime: '1.2s',
    scanFrequency: 'Every 4 hours',
    priority: 'Low',
    retryAttempts: 3,
    requestDelay: 1500,
  },
  {
    id: 'company-pages',
    name: 'Company Career Pages',
    description: 'Custom AI crawling of direct company recruitment portals.',
    logo: 'company-pages',
    status: 'Active',
    jobsFoundToday: 112,
    averageMatchPercent: 84,
    lastScanTime: '2 mins ago',
    health: 'Good',
    responseTime: '1.5s',
    scanFrequency: 'Every 30 mins',
    priority: 'High',
    retryAttempts: 3,
    requestDelay: 1000,
  },
  {
    id: 'internshala',
    name: 'Internshala',
    description: 'Leading platform for internships and entry-level positions in South Asia.',
    logo: 'internshala',
    status: 'Disabled',
    jobsFoundToday: 0,
    averageMatchPercent: 0,
    lastScanTime: '3 days ago',
    health: 'Fair',
    responseTime: '1.1s',
    scanFrequency: 'Every 6 hours',
    priority: 'Low',
    retryAttempts: 3,
    requestDelay: 800,
  },
  {
    id: 'foundit',
    name: 'Foundit',
    description: 'Leading employment portal in APAC/India. Formerly Monster.',
    logo: 'foundit',
    status: 'Active',
    jobsFoundToday: 23,
    averageMatchPercent: 68,
    lastScanTime: '3 hours ago',
    health: 'Fair',
    responseTime: '1.4s',
    scanFrequency: 'Every 6 hours',
    priority: 'Low',
    retryAttempts: 3,
    requestDelay: 1200,
  },
];

export const useSourceManagerStore = create<SourceManagerState>((set, get) => ({
  sources: initialSources,
  statusFilter: 'All',
  sortBy: 'Jobs Found',
  searchQuery: '',
  selectedSource: null,
  isConfigDrawerOpen: false,
  isLoading: false,

  setSources: (sources) => set({ sources }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedSource: (selectedSource) => set({ selectedSource }),
  setConfigDrawerOpen: (isConfigDrawerOpen) => set({ isConfigDrawerOpen }),
  setLoading: (isLoading) => set({ isLoading }),

  toggleSourceStatus: (id) => {
    set((state) => ({
      sources: state.sources.map((source) =>
        source.id === id
          ? {
              ...source,
              status: source.status === 'Active' ? 'Disabled' : 'Active',
              jobsFoundToday: source.status === 'Active' ? 0 : Math.floor(Math.random() * 40) + 10,
              lastScanTime: source.status === 'Active' ? source.lastScanTime : 'Just now',
              health: source.status === 'Active' ? 'Poor' : 'Good',
            }
          : source
      ),
    }));
  },

  scanSource: async (id) => {
    set({ isLoading: true });
    // Simulate API network call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set((state) => ({
      isLoading: false,
      sources: state.sources.map((source) =>
        source.id === id
          ? {
              ...source,
              jobsFoundToday: source.jobsFoundToday + Math.floor(Math.random() * 15) + 2,
              lastScanTime: 'Just now',
              health: 'Good',
            }
          : source
      ),
    }));
  },

  updateSourceConfig: (id, updates) => {
    set((state) => {
      const updatedSources = state.sources.map((source) =>
        source.id === id ? { ...source, ...updates } : source
      );
      
      // Also update selected source if it's currently open
      const updatedSelected = state.selectedSource?.id === id 
        ? { ...state.selectedSource, ...updates } 
        : state.selectedSource;

      return {
        sources: updatedSources,
        selectedSource: updatedSelected,
      };
    });
  },
}));