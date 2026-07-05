import type {
  AutomationStep,
  QueueItem,
  AutomationNotification,
  SystemStatus,
  BrowserTab,
  CurrentApplication,
  TimelineEntry,
} from '../types';

export const mockSteps: AutomationStep[] = [
  { id: 'open', label: 'Opening Website', status: 'completed', duration: 1200, icon: '🌐', startedAt: '10:31:00', completedAt: '10:31:01' },
  { id: 'login', label: 'Logging In', status: 'completed', duration: 2300, icon: '🔐', startedAt: '10:31:01', completedAt: '10:31:03' },
  { id: 'search', label: 'Searching Jobs', status: 'completed', duration: 1800, icon: '🔍', startedAt: '10:31:03', completedAt: '10:31:05' },
  { id: 'open_job', label: 'Opening Job Posting', status: 'running', duration: undefined, icon: '📄', startedAt: '10:31:05' },
  { id: 'upload_resume', label: 'Uploading Resume', status: 'pending', icon: '📎' },
  { id: 'upload_cl', label: 'Uploading Cover Letter', status: 'pending', icon: '✉️' },
  { id: 'fill_form', label: 'Filling Application Form', status: 'pending', icon: '📝' },
  { id: 'submit', label: 'Submitting Application', status: 'pending', icon: '🚀' },
  { id: 'completed', label: 'Application Completed', status: 'pending', icon: '✅' },
];

export const mockBrowserTabs: BrowserTab[] = [
  { id: 't1', title: 'LinkedIn – Jobs', url: 'https://www.linkedin.com/jobs/search', favicon: '🔵', active: true },
  { id: 't2', title: 'Glassdoor', url: 'https://www.glassdoor.com', favicon: '🟢', active: false },
  { id: 't3', title: 'Indeed', url: 'https://www.indeed.com', favicon: '🟡', active: false },
];

export const mockTimeline: TimelineEntry[] = [
  { id: 'tl1', timestamp: '10:31:00', action: 'Browser session started', duration: '0.2s', status: 'completed' },
  { id: 'tl2', timestamp: '10:31:01', action: 'Navigated to linkedin.com/jobs', duration: '1.2s', status: 'completed' },
  { id: 'tl3', timestamp: '10:31:02', action: 'Entered login credentials', duration: '0.8s', status: 'completed' },
  { id: 'tl4', timestamp: '10:31:03', action: 'Authentication successful', duration: '0.5s', status: 'completed' },
  { id: 'tl5', timestamp: '10:31:04', action: 'Executed job search: "Senior React Developer"', duration: '1.8s', status: 'completed' },
  { id: 'tl6', timestamp: '10:31:05', action: 'Opening job posting at Linear', duration: '—', status: 'running' },
];

export const mockCurrentApplication: CurrentApplication = {
  company: 'Linear',
  role: 'Senior Frontend Engineer',
  matchPercent: 94,
  resumeVersion: 'v3 – React Focused',
  coverLetterVersion: 'v2 – Linear Culture',
  applicationStatus: 'In Progress',
  logo: 'https://linear.app/favicon.ico',
  url: 'https://linear.app/careers',
};

export const mockQueue: QueueItem[] = [
  {
    id: 'q1', company: 'Linear', role: 'Senior Frontend Engineer', matchPercent: 94,
    status: 'running', resumeVersion: 'v3', coverLetterVersion: 'v2',
    applicationStatus: 'In Progress', logo: '🔵', addedAt: '10:30:00',
    startedAt: '10:31:00', retryCount: 0,
  },
  {
    id: 'q2', company: 'Vercel', role: 'Staff React Engineer', matchPercent: 91,
    status: 'waiting', resumeVersion: 'v3', coverLetterVersion: 'v1',
    applicationStatus: 'Waiting', logo: '⚫', addedAt: '10:29:45', retryCount: 0,
  },
  {
    id: 'q3', company: 'Figma', role: 'Frontend Infrastructure Lead', matchPercent: 88,
    status: 'waiting', resumeVersion: 'v2', coverLetterVersion: 'v3',
    applicationStatus: 'Waiting', logo: '🟣', addedAt: '10:29:30', retryCount: 0,
  },
  {
    id: 'q4', company: 'Stripe', role: 'Product Engineer – Dashboard', matchPercent: 86,
    status: 'completed', resumeVersion: 'v3', coverLetterVersion: 'v2',
    applicationStatus: 'Submitted', logo: '🟤', addedAt: '10:25:00',
    startedAt: '10:26:00', completedAt: '10:28:30', retryCount: 0,
  },
  {
    id: 'q5', company: 'Notion', role: 'Senior Software Engineer', matchPercent: 82,
    status: 'failed', resumeVersion: 'v2', coverLetterVersion: 'v1',
    applicationStatus: 'Failed – CAPTCHA', logo: '⬜', addedAt: '10:20:00',
    startedAt: '10:21:00', completedAt: '10:22:45', retryCount: 1,
  },
  {
    id: 'q6', company: 'Loom', role: 'Frontend Engineer II', matchPercent: 80,
    status: 'retry', resumeVersion: 'v3', coverLetterVersion: 'v2',
    applicationStatus: 'Retrying...', logo: '🔴', addedAt: '10:15:00',
    startedAt: '10:16:00', retryCount: 2,
  },
];

export const mockNotifications: AutomationNotification[] = [
  {
    id: 'n1', type: 'submitted', title: 'Application Submitted',
    message: 'Successfully applied to Stripe – Product Engineer',
    timestamp: '10:28:30', read: false, company: 'Stripe',
  },
  {
    id: 'n2', type: 'resume_uploaded', title: 'Resume Uploaded',
    message: 'Resume v3 uploaded to Stripe application portal',
    timestamp: '10:27:15', read: false, company: 'Stripe',
  },
  {
    id: 'n3', type: 'cover_letter_uploaded', title: 'Cover Letter Uploaded',
    message: 'Cover Letter v2 uploaded to Stripe application portal',
    timestamp: '10:27:45', read: true, company: 'Stripe',
  },
  {
    id: 'n4', type: 'failed', title: 'Application Failed',
    message: 'Notion application failed: CAPTCHA detected on form page',
    timestamp: '10:22:45', read: true, company: 'Notion',
  },
  {
    id: 'n5', type: 'retry', title: 'Retry Started',
    message: 'Retrying Loom application – attempt 2 of 3',
    timestamp: '10:16:00', read: true, company: 'Loom',
  },
];

export const mockSystemStatus: SystemStatus = {
  workers: 3,
  activeWorkers: 1,
  queueSize: 6,
  successRate: 78,
  averageTime: '2m 34s',
  totalProcessed: 47,
};
