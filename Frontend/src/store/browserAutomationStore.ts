import { create } from 'zustand';

export interface AutomationAction {
  timestamp: string;
  action: string;
  duration: string;
  status: 'success' | 'failed' | 'running' | 'pending';
}

export interface ApplicationQueueItem {
  id: string;
  company: string;
  role: string;
  matchPercent: number;
  resumeVersion: string;
  coverLetterVersion: string;
  status: 'Waiting' | 'Running' | 'Completed' | 'Failed' | 'Retry';
}

export interface AutomationNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: string;
}

interface BrowserAutomationState {
  // Browser Preview
  currentWebsite: string;
  currentPage: string;
  currentCompany: string;
  browserLoading: boolean;
  activeTab: number;
  tabs: { url: string; title: string; favicon: string }[];

  // Live Automation
  automationRunning: boolean;
  currentAutomationStep: string;
  mousePosition: { x: number; y: number };
  mouseClick: boolean;
  typingText: string;
  scrolling: boolean;

  // Automation Timeline
  timeline: AutomationAction[];

  // Current Application
  currentApplication: ApplicationQueueItem | null;

  // Queue
  applicationQueue: ApplicationQueueItem[];
  queueFilters: 'All' | 'Waiting' | 'Running' | 'Completed' | 'Failed' | 'Retry';

  // System Status
  workersActive: number;
  queueSize: number;
  successRate: number;
  averageTime: string;

  // Notifications
  notifications: AutomationNotification[];

  // Actions
  startAutomation: () => void;
  pauseAutomation: () => void;
  resumeAutomation: () => void;
  stopAutomation: () => void;
  retryFailedAutomation: () => void;
  updateBrowserState: (updates: Partial<BrowserAutomationState>) => void;
  addTimelineAction: (action: Omit<AutomationAction, 'timestamp'>) => void;
  addNotification: (notification: Omit<AutomationNotification, 'id' | 'timestamp'>) => void;
  updateQueueItemStatus: (id: string, status: ApplicationQueueItem['status']) => void;
  setCurrentApplication: (app: ApplicationQueueItem | null) => void;
  enqueueApplication: (app: ApplicationQueueItem) => void;
  setQueueFilters: (filter: BrowserAutomationState['queueFilters']) => void;
}

const initialQueue: ApplicationQueueItem[] = [
  { id: 'app1', company: 'Google', role: 'Software Engineer', matchPercent: 85, resumeVersion: 'v1', coverLetterVersion: 'v2', status: 'Waiting' },
  { id: 'app2', company: 'Meta', role: 'Frontend Developer', matchPercent: 78, resumeVersion: 'v3', coverLetterVersion: 'v1', status: 'Waiting' },
  { id: 'app3', company: 'Amazon', role: 'Backend Engineer', matchPercent: 92, resumeVersion: 'v2', coverLetterVersion: 'v3', status: 'Completed' },
  { id: 'app4', company: 'Microsoft', role: 'Cloud Engineer', matchPercent: 60, resumeVersion: 'v1', coverLetterVersion: 'v1', status: 'Failed' },
];

const automationSteps = [
  'Initializing browser...', 
  'Navigating to company career page...', 
  'Logging in (if required)...',
  'Searching for job position...', 
  'Opening job description...', 
  'Uploading resume...',
  'Uploading cover letter...', 
  'Filling application form...', 
  'Submitting application...', 
  'Application complete!'
];

export const useBrowserAutomationStore = create<BrowserAutomationState>((set, get) => ({
  currentWebsite: 'about:blank',
  currentPage: 'New Tab',
  currentCompany: 'N/A',
  browserLoading: false,
  activeTab: 0,
  tabs: [],

  automationRunning: false,
  currentAutomationStep: 'Idle',
  mousePosition: { x: 0, y: 0 },
  mouseClick: false,
  typingText: '',
  scrolling: false,

  timeline: [],
  currentApplication: null,
  applicationQueue: initialQueue,
  queueFilters: 'All',

  workersActive: 2,
  queueSize: initialQueue.length,
  successRate: 85,
  averageTime: '3 min 15s',
  notifications: [],

  updateBrowserState: (updates) => set((state) => ({ ...state, ...updates })),
  addTimelineAction: (action) => set((state) => ({
    timeline: [...state.timeline, { ...action, timestamp: new Date().toLocaleTimeString() }]
  })),
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: `notif_${Date.now()}`, timestamp: new Date().toLocaleTimeString() }]
  })),
  updateQueueItemStatus: (id, status) => set((state) => ({
    applicationQueue: state.applicationQueue.map(item => 
      item.id === id ? { ...item, status } : item
    )
  })),
  setCurrentApplication: (app) => set({ currentApplication: app }),
  enqueueApplication: (app) => set((state) => ({ applicationQueue: [...state.applicationQueue, app], queueSize: state.queueSize + 1 })),
  setQueueFilters: (filter) => set({ queueFilters: filter }),

  startAutomation: async () => {
    set({ automationRunning: true, timeline: [], notifications: [] });
    const queue = get().applicationQueue.filter(app => app.status === 'Waiting' || app.status === 'Retry');
    if (queue.length === 0) {
      get().addNotification({ type: 'info', message: 'No applications in queue to start automation.' });
      set({ automationRunning: false });
      return;
    }

    let appToRun = queue[0];
    set({ currentApplication: appToRun, currentCompany: appToRun.company, browserLoading: true });
    get().updateQueueItemStatus(appToRun.id, 'Running');
    get().addNotification({ type: 'info', message: `Starting automation for ${appToRun.company} - ${appToRun.role}` });

    for (let i = 0; i < automationSteps.length; i++) {
      const step = automationSteps[i];
      set({ currentAutomationStep: step, browserLoading: true });
      get().addTimelineAction({ action: step, duration: '...', status: 'running' });
      
      // Simulate browser actions
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

      if (step.includes('website')) {
        set({ currentWebsite: `https://careers.${appToRun.company.toLowerCase()}.com`, currentPage: 'Career Page' });
      } else if (step.includes('resume')) {
        get().addNotification({ type: 'info', message: 'Resume uploaded: ' + appToRun.resumeVersion });
      } else if (step.includes('cover letter')) {
        get().addNotification({ type: 'info', message: 'Cover Letter uploaded: ' + appToRun.coverLetterVersion });
      }

      get().addTimelineAction({ action: step, duration: `${(Math.random() * 2 + 1).toFixed(1)}s`, status: 'success' });
    }

    set({ browserLoading: false, currentAutomationStep: 'Idle' });
    get().updateQueueItemStatus(appToRun.id, 'Completed');
    get().addNotification({ type: 'success', message: `Application for ${appToRun.company} submitted successfully!` });
    set((state) => ({
      applicationQueue: state.applicationQueue.filter(item => item.id !== appToRun.id),
      queueSize: state.queueSize - 1,
      currentApplication: null,
    }));
  },

  pauseAutomation: () => set({ automationRunning: false, currentAutomationStep: 'Paused', browserLoading: false }),
  resumeAutomation: () => set(state => {
    if (state.currentApplication) {
      get().addNotification({ type: 'info', message: `Resuming automation for ${state.currentApplication.company}` });
      state.startAutomation(); // Re-triggering for simplicity, real would resume from step
    }
    return { automationRunning: true };
  }),
  stopAutomation: () => set({ automationRunning: false, currentAutomationStep: 'Stopped', browserLoading: false, currentApplication: null, notifications: [], timeline: [] }),
  retryFailedAutomation: () => set(state => {
    const failedApp = state.applicationQueue.find(app => app.status === 'Failed');
    if (failedApp) {
      get().updateQueueItemStatus(failedApp.id, 'Retry');
      get().addNotification({ type: 'info', message: `Retrying application for ${failedApp.company}` });
      state.startAutomation();
    } else {
      get().addNotification({ type: 'info', message: 'No failed applications to retry.' });
    }
    return {};
  }),
}));