export type AutomationStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export type QueueStatus = 'waiting' | 'running' | 'completed' | 'failed' | 'retry';

export type NotificationType =
  | 'submitted'
  | 'resume_uploaded'
  | 'cover_letter_uploaded'
  | 'failed'
  | 'retry';

export interface AutomationStep {
  id: string;
  label: string;
  status: StepStatus;
  duration?: number; // ms
  startedAt?: string;
  completedAt?: string;
  icon: string;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  action: string;
  duration: string;
  status: StepStatus;
}

export interface QueueItem {
  id: string;
  company: string;
  role: string;
  matchPercent: number;
  status: QueueStatus;
  resumeVersion: string;
  coverLetterVersion: string;
  applicationStatus: string;
  logo: string;
  addedAt: string;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
}

export interface AutomationNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  company?: string;
}

export interface SystemStatus {
  workers: number;
  activeWorkers: number;
  queueSize: number;
  successRate: number;
  averageTime: string;
  totalProcessed: number;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  active: boolean;
}

export interface CurrentApplication {
  company: string;
  role: string;
  matchPercent: number;
  resumeVersion: string;
  coverLetterVersion: string;
  applicationStatus: string;
  logo: string;
  url: string;
}
