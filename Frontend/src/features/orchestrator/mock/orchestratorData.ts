import type {
  WorkflowStage,
  OrchestratorTask,
  Worker,
  AgentMessage,
  ExecutionLog,
  TimelineEvent,
  PerformanceMetrics,
  DAGNode,
  DAGEdge,
} from '../types';

// ─── Workflow Stages ──────────────────────────────────────────────────────────
export const mockStages: WorkflowStage[] = [
  {
    id: 'resume-upload',
    label: 'Resume Uploaded',
    description: 'User resume received and queued for processing',
    icon: '📄',
    status: 'completed',
    agentName: 'Resume Agent',
    startedAt: '10:44:00',
    completedAt: '10:44:01',
    durationMs: 820,
    dependsOn: [],
    outputSummary: 'Resume v3 parsed — 6 years experience, React/TypeScript stack',
  },
  {
    id: 'parse-resume',
    label: 'Parse Resume',
    description: 'Extract skills, experience, education, and keywords from resume',
    icon: '🔍',
    status: 'completed',
    agentName: 'Resume Agent',
    startedAt: '10:44:01',
    completedAt: '10:44:03',
    durationMs: 2100,
    dependsOn: ['resume-upload'],
    outputSummary: '42 skills extracted, 3 experience blocks, ATS score: 78',
  },
  {
    id: 'search-jobs',
    label: 'Search Jobs',
    description: 'Discover relevant job postings across configured sources',
    icon: '🌐',
    status: 'completed',
    agentName: 'Job Discovery Agent',
    startedAt: '10:44:03',
    completedAt: '10:44:06',
    durationMs: 3200,
    dependsOn: ['parse-resume'],
    outputSummary: '247 jobs found across LinkedIn, Indeed, Glassdoor',
  },
  {
    id: 'dedup',
    label: 'Remove Duplicates',
    description: 'Deduplicate job listings by title, company, and JD similarity',
    icon: '🧹',
    status: 'completed',
    agentName: 'Job Discovery Agent',
    startedAt: '10:44:06',
    completedAt: '10:44:07',
    durationMs: 950,
    dependsOn: ['search-jobs'],
    outputSummary: '189 unique jobs after deduplication (58 removed)',
  },
  {
    id: 'calculate-match',
    label: 'Calculate Match',
    description: 'Score each job against resume using semantic matching',
    icon: '🎯',
    status: 'running',
    agentName: 'Matching Agent',
    startedAt: '10:44:07',
    dependsOn: ['dedup'],
    outputSummary: undefined,
  },
  {
    id: 'select-jobs',
    label: 'Select Best Jobs',
    description: 'Filter top candidates above match threshold (≥80%)',
    icon: '⭐',
    status: 'waiting',
    agentName: 'Matching Agent',
    dependsOn: ['calculate-match'],
  },
  {
    id: 'optimize-resume',
    label: 'Optimize Resume',
    description: 'Tailor resume content for each selected job',
    icon: '✏️',
    status: 'waiting',
    agentName: 'Resume Agent',
    dependsOn: ['select-jobs'],
  },
  {
    id: 'gen-cover-letter',
    label: 'Generate Cover Letter',
    description: 'Create personalized cover letter for each application',
    icon: '✉️',
    status: 'waiting',
    agentName: 'Cover Letter Agent',
    dependsOn: ['optimize-resume'],
  },
  {
    id: 'prepare-app',
    label: 'Prepare Application',
    description: 'Bundle resume, cover letter, and metadata for submission',
    icon: '📦',
    status: 'waiting',
    agentName: 'Orchestrator',
    dependsOn: ['gen-cover-letter'],
  },
  {
    id: 'browser-submit',
    label: 'Send to Browser',
    description: 'Hand off application package to Browser Automation Agent',
    icon: '🤖',
    status: 'waiting',
    agentName: 'Browser Agent',
    dependsOn: ['prepare-app'],
  },
  {
    id: 'wait-result',
    label: 'Wait For Result',
    description: 'Monitor browser submission and capture confirmation',
    icon: '⏳',
    status: 'waiting',
    agentName: 'Browser Agent',
    dependsOn: ['browser-submit'],
  },
  {
    id: 'update-dashboard',
    label: 'Update Dashboard',
    description: 'Record result, update application tracker, notify user',
    icon: '📊',
    status: 'waiting',
    agentName: 'Orchestrator',
    dependsOn: ['wait-result'],
  },
];

// ─── Task Queue ───────────────────────────────────────────────────────────────
export const mockTasks: OrchestratorTask[] = [
  {
    id: 'task-1', label: 'Parse Resume v3', description: 'NLP extraction pipeline', priority: 'critical',
    status: 'completed', agentId: 'resume-agent', stageId: 'parse-resume',
    createdAt: '10:44:00', startedAt: '10:44:01', completedAt: '10:44:03',
    durationMs: 2100, retryCount: 0, maxRetries: 3,
  },
  {
    id: 'task-2', label: 'LinkedIn Job Crawl', description: 'Scraping 150 job postings', priority: 'high',
    status: 'completed', agentId: 'discovery-agent', stageId: 'search-jobs',
    createdAt: '10:44:02', startedAt: '10:44:03', completedAt: '10:44:05',
    durationMs: 2300, retryCount: 0, maxRetries: 3,
  },
  {
    id: 'task-3', label: 'Indeed Job Crawl', description: 'Scraping 97 job postings', priority: 'high',
    status: 'completed', agentId: 'discovery-agent', stageId: 'search-jobs',
    createdAt: '10:44:02', startedAt: '10:44:03', completedAt: '10:44:06',
    durationMs: 3200, retryCount: 0, maxRetries: 3,
  },
  {
    id: 'task-4', label: 'Semantic Deduplication', description: 'Vector similarity comparison', priority: 'medium',
    status: 'completed', agentId: 'discovery-agent', stageId: 'dedup',
    createdAt: '10:44:06', startedAt: '10:44:06', completedAt: '10:44:07',
    durationMs: 950, retryCount: 0, maxRetries: 2,
  },
  {
    id: 'task-5', label: 'Match Score Batch 1/4', description: 'Scoring jobs 1–50 of 189', priority: 'critical',
    status: 'running', agentId: 'matching-agent', stageId: 'calculate-match',
    createdAt: '10:44:07', startedAt: '10:44:07',
    retryCount: 0, maxRetries: 3,
  },
  {
    id: 'task-6', label: 'Match Score Batch 2/4', description: 'Scoring jobs 51–100 of 189', priority: 'critical',
    status: 'queued', agentId: 'matching-agent', stageId: 'calculate-match',
    createdAt: '10:44:07', retryCount: 0, maxRetries: 3,
  },
  {
    id: 'task-7', label: 'Match Score Batch 3/4', description: 'Scoring jobs 101–150 of 189', priority: 'high',
    status: 'queued', agentId: 'matching-agent', stageId: 'calculate-match',
    createdAt: '10:44:07', retryCount: 0, maxRetries: 3,
  },
  {
    id: 'task-8', label: 'Match Score Batch 4/4', description: 'Scoring jobs 151–189 of 189', priority: 'high',
    status: 'queued', agentId: 'matching-agent', stageId: 'calculate-match',
    createdAt: '10:44:07', retryCount: 0, maxRetries: 3,
  },
  {
    id: 'task-9', label: 'Cover Letter – Linear', description: 'Generate for Linear Frontend role', priority: 'medium',
    status: 'failed', agentId: 'cover-letter-agent', stageId: 'gen-cover-letter',
    createdAt: '10:43:00', startedAt: '10:43:05', completedAt: '10:43:08',
    durationMs: 3100, retryCount: 1, maxRetries: 3, error: 'Context window exceeded. Retry with compressed JD.',
  },
];

// ─── Workers ──────────────────────────────────────────────────────────────────
export const mockWorkers: Worker[] = [
  {
    id: 'resume-agent', name: 'Resume Agent', agentType: 'NLP/Parser',
    status: 'idle', completedCount: 12, failedCount: 0,
    avgDurationMs: 1850, cpuUsage: 12, memUsage: 234,
  },
  {
    id: 'discovery-agent', name: 'Job Discovery Agent', agentType: 'Web Crawler',
    status: 'idle', completedCount: 8, failedCount: 1,
    avgDurationMs: 2800, cpuUsage: 8, memUsage: 180,
  },
  {
    id: 'matching-agent-1', name: 'Matching Agent #1', agentType: 'Semantic Scorer',
    status: 'busy', currentTaskId: 'task-5', currentTaskLabel: 'Match Score Batch 1/4',
    completedCount: 24, failedCount: 0, avgDurationMs: 1200, cpuUsage: 67, memUsage: 512,
  },
  {
    id: 'matching-agent-2', name: 'Matching Agent #2', agentType: 'Semantic Scorer',
    status: 'idle', completedCount: 19, failedCount: 2,
    avgDurationMs: 1350, cpuUsage: 5, memUsage: 290,
  },
  {
    id: 'cover-letter-agent', name: 'Cover Letter Agent', agentType: 'LLM/Generator',
    status: 'failed', completedCount: 7, failedCount: 1,
    avgDurationMs: 4200, cpuUsage: 0, memUsage: 128,
  },
  {
    id: 'browser-agent', name: 'Browser Agent', agentType: 'Automation',
    status: 'idle', completedCount: 5, failedCount: 0,
    avgDurationMs: 18000, cpuUsage: 3, memUsage: 95,
  },
];

// ─── Agent Messages ───────────────────────────────────────────────────────────
export const mockMessages: AgentMessage[] = [
  {
    id: 'm1', fromAgent: 'Orchestrator', toAgent: 'Resume Agent', type: 'info',
    content: 'Start resume parsing pipeline for user_123. Resume v3 attached.',
    timestamp: '10:44:00',
  },
  {
    id: 'm2', fromAgent: 'Resume Agent', toAgent: 'Orchestrator', type: 'success',
    content: 'Parse complete. Extracted 42 skills, 6 years XP, 3 projects. ATS baseline: 78.',
    timestamp: '10:44:03',
  },
  {
    id: 'm3', fromAgent: 'Orchestrator', toAgent: 'Job Discovery Agent', type: 'info',
    content: 'Initiate job search. Skills: [React, TypeScript, Node.js]. Location: Remote. Salary: $130k+',
    timestamp: '10:44:03',
  },
  {
    id: 'm4', fromAgent: 'Job Discovery Agent', toAgent: 'Orchestrator', type: 'data',
    content: 'Job search complete. 247 raw listings. 58 duplicates removed. 189 unique jobs ready for scoring.',
    timestamp: '10:44:07',
  },
  {
    id: 'm5', fromAgent: 'Orchestrator', toAgent: 'Matching Agent', type: 'info',
    content: 'Begin semantic scoring on 189 jobs. Batch size: 50. Threshold: 80%. Resume embedding attached.',
    timestamp: '10:44:07',
  },
  {
    id: 'm6', fromAgent: 'Matching Agent', toAgent: 'Orchestrator', type: 'info',
    content: 'Processing batch 1/4 (jobs 1–50). Estimated completion: 12 seconds.',
    timestamp: '10:44:08',
  },
  {
    id: 'm7', fromAgent: 'Cover Letter Agent', toAgent: 'Orchestrator', type: 'error',
    content: 'ERROR: Context window exceeded on task task-9 (Linear). Retry with compressed JD. Awaiting instructions.',
    timestamp: '10:43:08',
  },
  {
    id: 'm8', fromAgent: 'Orchestrator', toAgent: 'Cover Letter Agent', type: 'warning',
    content: 'Retry task-9 with JD truncated to 800 tokens. Priority: HIGH. Attempt 2/3.',
    timestamp: '10:43:10',
  },
];

// ─── Execution Logs ──────────────────────────────────────────────────────────
export const mockLogs: ExecutionLog[] = [
  { id: 'l1', level: 'system', timestamp: '10:44:00.000', message: '══════ WORKFLOW STARTED ══════', source: 'Orchestrator', details: 'Run ID: run_20260705_104400' },
  { id: 'l2', level: 'info', timestamp: '10:44:00.120', message: 'Received resume: user_resume_v3.pdf (248 KB)', source: 'Resume Agent' },
  { id: 'l3', level: 'info', timestamp: '10:44:01.000', message: 'Starting NLP extraction pipeline', source: 'Resume Agent' },
  { id: 'l4', level: 'debug', timestamp: '10:44:01.450', message: 'Tokenizing document — 3,847 tokens', source: 'Resume Agent' },
  { id: 'l5', level: 'success', timestamp: '10:44:03.100', message: 'Resume parsed — 42 skills, 6 yrs experience, ATS: 78', source: 'Resume Agent' },
  { id: 'l6', level: 'info', timestamp: '10:44:03.200', message: 'Dispatching Job Discovery Agent', source: 'Orchestrator' },
  { id: 'l7', level: 'info', timestamp: '10:44:03.300', message: 'Crawling LinkedIn (/jobs/search?keywords=React+Developer)', source: 'Job Discovery Agent' },
  { id: 'l8', level: 'info', timestamp: '10:44:03.400', message: 'Crawling Indeed (/jobs?q=Senior+React+Engineer)', source: 'Job Discovery Agent' },
  { id: 'l9', level: 'success', timestamp: '10:44:06.100', message: '247 listings collected from 3 sources', source: 'Job Discovery Agent' },
  { id: 'l10', level: 'info', timestamp: '10:44:06.200', message: 'Running deduplication — cosine similarity threshold: 0.85', source: 'Job Discovery Agent' },
  { id: 'l11', level: 'success', timestamp: '10:44:07.150', message: '58 duplicates removed → 189 unique listings', source: 'Job Discovery Agent' },
  { id: 'l12', level: 'info', timestamp: '10:44:07.200', message: 'Dispatching Matching Agent — batch_size=50, threshold=80%', source: 'Orchestrator' },
  { id: 'l13', level: 'info', timestamp: '10:44:07.500', message: 'Processing batch 1/4 (jobs 1–50)', source: 'Matching Agent' },
  { id: 'l14', level: 'warn', timestamp: '10:43:08.000', message: 'Cover Letter Agent: context_window_exceeded on task task-9', source: 'Cover Letter Agent', details: 'Token count: 4,312 / 4,096 limit. JD compression required.' },
  { id: 'l15', level: 'error', timestamp: '10:43:08.100', message: 'Task task-9 FAILED — Cover Letter for Linear', source: 'Orchestrator', details: 'Queuing retry with compressed JD (800 token limit)' },
];

// ─── Timeline ─────────────────────────────────────────────────────────────────
export const mockTimeline: TimelineEvent[] = [
  { id: 'te1', timestamp: '10:44:00', eventType: 'WORKFLOW_START', description: 'Workflow engine initialized', agentName: 'Orchestrator', durationMs: 50, status: 'success' },
  { id: 'te2', timestamp: '10:44:00', eventType: 'STAGE_START', description: 'Stage: Resume Upload received', agentName: 'Resume Agent', durationMs: 820, status: 'success' },
  { id: 'te3', timestamp: '10:44:01', eventType: 'STAGE_START', description: 'Stage: Parse Resume', agentName: 'Resume Agent', durationMs: 2100, status: 'success' },
  { id: 'te4', timestamp: '10:44:03', eventType: 'STAGE_START', description: 'Stage: Search Jobs', agentName: 'Job Discovery Agent', durationMs: 3200, status: 'success' },
  { id: 'te5', timestamp: '10:44:06', eventType: 'STAGE_START', description: 'Stage: Remove Duplicates', agentName: 'Job Discovery Agent', durationMs: 950, status: 'success' },
  { id: 'te6', timestamp: '10:44:07', eventType: 'STAGE_START', description: 'Stage: Calculate Match — Batch 1/4', agentName: 'Matching Agent', status: 'running' },
  { id: 'te7', timestamp: '10:43:08', eventType: 'TASK_FAILED', description: 'Task task-9 failed: Cover Letter (Linear)', agentName: 'Cover Letter Agent', status: 'failed' },
];

// ─── Performance Metrics ──────────────────────────────────────────────────────
export const mockMetrics: PerformanceMetrics = {
  jobsProcessed: 44,
  avgProcessingTimeMs: 2340,
  successRate: 86,
  failureRate: 14,
  queueSize: 8,
  throughputPerHour: 52,
  totalRuntime: 428000,
};

// ─── DAG ──────────────────────────────────────────────────────────────────────
export const mockDAGNodes: DAGNode[] = [
  { id: 'resume-upload',    label: 'Resume Upload',    icon: '📄', x: 100,  y: 40,  status: 'completed', agentName: 'Resume Agent' },
  { id: 'parse-resume',     label: 'Parse Resume',     icon: '🔍', x: 100,  y: 130, status: 'completed', agentName: 'Resume Agent' },
  { id: 'search-jobs',      label: 'Search Jobs',      icon: '🌐', x: 100,  y: 220, status: 'completed', agentName: 'Job Discovery' },
  { id: 'dedup',            label: 'Dedup',            icon: '🧹', x: 100,  y: 310, status: 'completed', agentName: 'Job Discovery' },
  { id: 'calculate-match',  label: 'Match Score',      icon: '🎯', x: 100,  y: 400, status: 'running',   agentName: 'Matching Agent' },
  { id: 'select-jobs',      label: 'Select Jobs',      icon: '⭐', x: 100,  y: 490, status: 'waiting',   agentName: 'Matching Agent' },
  { id: 'optimize-resume',  label: 'Optimize Resume',  icon: '✏️', x: 100,  y: 580, status: 'waiting',   agentName: 'Resume Agent' },
  { id: 'gen-cover-letter', label: 'Cover Letter',     icon: '✉️', x: 100,  y: 670, status: 'waiting',   agentName: 'CL Agent' },
  { id: 'prepare-app',      label: 'Prepare App',      icon: '📦', x: 100,  y: 760, status: 'waiting',   agentName: 'Orchestrator' },
  { id: 'browser-submit',   label: 'Browser Submit',   icon: '🤖', x: 100,  y: 850, status: 'waiting',   agentName: 'Browser Agent' },
  { id: 'wait-result',      label: 'Wait Result',      icon: '⏳', x: 100,  y: 940, status: 'waiting',   agentName: 'Browser Agent' },
  { id: 'update-dashboard', label: 'Update Dashboard', icon: '📊', x: 100,  y: 1030, status: 'waiting',  agentName: 'Orchestrator' },
];

export const mockDAGEdges: DAGEdge[] = [
  { id: 'e1',  from: 'resume-upload',    to: 'parse-resume',     animated: false },
  { id: 'e2',  from: 'parse-resume',     to: 'search-jobs',      animated: false },
  { id: 'e3',  from: 'search-jobs',      to: 'dedup',            animated: false },
  { id: 'e4',  from: 'dedup',            to: 'calculate-match',  animated: true  },
  { id: 'e5',  from: 'calculate-match',  to: 'select-jobs',      animated: false },
  { id: 'e6',  from: 'select-jobs',      to: 'optimize-resume',  animated: false },
  { id: 'e7',  from: 'optimize-resume',  to: 'gen-cover-letter', animated: false },
  { id: 'e8',  from: 'gen-cover-letter', to: 'prepare-app',      animated: false },
  { id: 'e9',  from: 'prepare-app',      to: 'browser-submit',   animated: false },
  { id: 'e10', from: 'browser-submit',   to: 'wait-result',      animated: false },
  { id: 'e11', from: 'wait-result',      to: 'update-dashboard', animated: false },
];
