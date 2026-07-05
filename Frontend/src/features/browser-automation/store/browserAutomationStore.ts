import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AutomationStatus,
  AutomationStep,
  QueueItem,
  AutomationNotification,
  SystemStatus,
  CurrentApplication,
  TimelineEntry,
  BrowserTab,
  StepStatus,
} from '../types';
import {
  mockSteps,
  mockQueue,
  mockNotifications,
  mockSystemStatus,
  mockCurrentApplication,
  mockTimeline,
  mockBrowserTabs,
} from '../mock/automationData';

interface BrowserAutomationStore {
  // Core state
  automationStatus: AutomationStatus;
  currentStep: string | null;
  currentUrl: string;
  currentWebsite: string;
  currentPage: string;
  isLoading: boolean;

  // Steps
  steps: AutomationStep[];
  updateStepStatus: (id: string, status: StepStatus) => void;

  // Browser tabs
  tabs: BrowserTab[];
  activeTabId: string;
  setActiveTab: (id: string) => void;

  // Timeline
  timeline: TimelineEntry[];
  addTimelineEntry: (entry: TimelineEntry) => void;

  // Queue
  queue: QueueItem[];
  addToQueue: (item: QueueItem) => void;
  removeFromQueue: (id: string) => void;
  updateQueueItem: (id: string, updates: Partial<QueueItem>) => void;

  // Current application
  currentApplication: CurrentApplication | null;

  // Notifications
  notifications: AutomationNotification[];
  addNotification: (n: AutomationNotification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // System status
  systemStatus: SystemStatus;

  // Automation controls
  startAutomation: () => Promise<void>;
  pauseAutomation: () => Promise<void>;
  resumeAutomation: () => Promise<void>;
  stopAutomation: () => Promise<void>;
  retryFailed: () => Promise<void>;

  // Mouse simulation
  mousePosition: { x: number; y: number };
  isClicking: boolean;
  isTyping: boolean;
  isScrolling: boolean;
  setMousePosition: (pos: { x: number; y: number }) => void;
  triggerClick: () => void;
  triggerTyping: () => void;
  triggerScrolling: () => void;
}

let stepInterval: ReturnType<typeof setInterval> | null = null;

export const useBrowserAutomationStore = create<BrowserAutomationStore>()(
  persist(
    (set, get) => ({
      automationStatus: 'idle',
      currentStep: null,
      currentUrl: 'https://www.linkedin.com/jobs/search',
      currentWebsite: 'LinkedIn',
      currentPage: 'Job Search Results',
      isLoading: false,

      steps: mockSteps,
      updateStepStatus: (id, status) =>
        set((s) => ({
          steps: s.steps.map((step) =>
            step.id === id ? { ...step, status } : step
          ),
        })),

      tabs: mockBrowserTabs,
      activeTabId: 't1',
      setActiveTab: (id) =>
        set((s) => ({
          activeTabId: id,
          tabs: s.tabs.map((t) => ({ ...t, active: t.id === id })),
        })),

      timeline: mockTimeline,
      addTimelineEntry: (entry) =>
        set((s) => ({ timeline: [entry, ...s.timeline].slice(0, 50) })),

      queue: mockQueue,
      addToQueue: (item) =>
        set((s) => ({ queue: [...s.queue, item] })),
      removeFromQueue: (id) =>
        set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),
      updateQueueItem: (id, updates) =>
        set((s) => ({
          queue: s.queue.map((q) => (q.id === id ? { ...q, ...updates } : q)),
        })),

      currentApplication: mockCurrentApplication,

      notifications: mockNotifications,
      addNotification: (n) =>
        set((s) => ({ notifications: [n, ...s.notifications].slice(0, 20) })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),

      systemStatus: mockSystemStatus,

      mousePosition: { x: 50, y: 50 },
      isClicking: false,
      isTyping: false,
      isScrolling: false,
      setMousePosition: (pos) => set({ mousePosition: pos }),
      triggerClick: () => {
        set({ isClicking: true });
        setTimeout(() => set({ isClicking: false }), 400);
      },
      triggerTyping: () => {
        set({ isTyping: true });
        setTimeout(() => set({ isTyping: false }), 1500);
      },
      triggerScrolling: () => {
        set({ isScrolling: true });
        setTimeout(() => set({ isScrolling: false }), 800);
      },

      startAutomation: async () => {
        set({
          automationStatus: 'running',
          isLoading: true,
          steps: mockSteps.map((s) => ({ ...s, status: 'pending' as StepStatus })),
        });
        await new Promise((r) => setTimeout(r, 600));
        set({ isLoading: false });

        const { steps } = get();
        let currentIdx = 0;

        const advance = () => {
          const fresh = get();
          if (
            fresh.automationStatus !== 'running' ||
            currentIdx >= steps.length
          ) {
            if (currentIdx >= steps.length) {
              set({ automationStatus: 'completed', currentStep: null });
            }
            return;
          }

          const step = steps[currentIdx];
          set((s) => ({
            currentStep: step.id,
            steps: s.steps.map((st, i) =>
              i === currentIdx
                ? { ...st, status: 'running' }
                : i < currentIdx
                ? { ...st, status: 'completed' }
                : st
            ),
          }));

          get().triggerClick();
          setTimeout(() => get().triggerTyping(), 500);

          const duration = step.duration ?? 2000;
          setTimeout(() => {
            set((s) => ({
              steps: s.steps.map((st, i) =>
                i === currentIdx ? { ...st, status: 'completed' } : st
              ),
            }));
            currentIdx++;
            if (currentIdx < steps.length) advance();
            else set({ automationStatus: 'completed', currentStep: null });
          }, duration);
        };

        advance();
      },

      pauseAutomation: async () => {
        set({ automationStatus: 'paused' });
        if (stepInterval) { clearInterval(stepInterval); stepInterval = null; }
      },

      resumeAutomation: async () => {
        set({ automationStatus: 'running' });
        const { startAutomation } = get();
        startAutomation();
      },

      stopAutomation: async () => {
        if (stepInterval) { clearInterval(stepInterval); stepInterval = null; }
        set({
          automationStatus: 'idle',
          currentStep: null,
          steps: mockSteps,
        });
      },

      retryFailed: async () => {
        set((s) => ({
          queue: s.queue.map((q) =>
            q.status === 'failed' ? { ...q, status: 'retry', retryCount: q.retryCount + 1 } : q
          ),
        }));
        await new Promise((r) => setTimeout(r, 500));
        const { startAutomation } = get();
        startAutomation();
      },
    }),
    {
      name: 'autohire-browser-automation',
      partialize: (s) => ({
        automationStatus: s.automationStatus,
        queue: s.queue,
        notifications: s.notifications,
        systemStatus: s.systemStatus,
      }),
    }
  )
);
