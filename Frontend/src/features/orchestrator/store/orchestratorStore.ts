import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WorkflowStatus,
  WorkflowStage,
  OrchestratorTask,
  Worker,
  AgentMessage,
  ExecutionLog,
  TimelineEvent,
  PerformanceMetrics,
  StageStatus,
  TaskStatus,
  LogLevel,
} from '../types';
import {
  mockStages,
  mockTasks,
  mockWorkers,
  mockMessages,
  mockLogs,
  mockTimeline,
  mockMetrics,
} from '../mock/orchestratorData';

interface OrchestratorStore {
  // Workflow
  workflowStatus: WorkflowStatus;
  stages: WorkflowStage[];
  currentStageId: string | null;
  runId: string | null;

  // Tasks
  tasks: OrchestratorTask[];
  addTask: (task: OrchestratorTask) => void;
  updateTask: (id: string, updates: Partial<OrchestratorTask>) => void;
  retryTask: (id: string) => Promise<void>;
  retryAllFailed: () => Promise<void>;
  ignoreTask: (id: string) => void;

  // Workers
  workers: Worker[];
  updateWorker: (id: string, updates: Partial<Worker>) => void;

  // Agent messages
  messages: AgentMessage[];
  addMessage: (msg: AgentMessage) => void;

  // Execution logs
  logs: ExecutionLog[];
  addLog: (log: ExecutionLog) => void;
  clearLogs: () => void;
  logFilter: LogLevel | 'all';
  logSearch: string;
  setLogFilter: (f: LogLevel | 'all') => void;
  setLogSearch: (q: string) => void;

  // Timeline
  timeline: TimelineEvent[];
  addTimelineEvent: (evt: TimelineEvent) => void;

  // Metrics
  metrics: PerformanceMetrics;

  // Controls
  startWorkflow: () => Promise<void>;
  pauseWorkflow: () => Promise<void>;
  resumeWorkflow: () => Promise<void>;
  stopWorkflow: () => Promise<void>;
  emergencyStop: () => void;
  resetWorkflow: () => void;

  // Active tab
  activeTab: 'pipeline' | 'dag' | 'tasks' | 'agents' | 'timeline' | 'workers' | 'retry' | 'logs' | 'metrics';
  setActiveTab: (t: OrchestratorStore['activeTab']) => void;
}

let progressTimer: ReturnType<typeof setTimeout> | null = null;

function makeLog(level: LogLevel, message: string, source: string): ExecutionLog {
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    level,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    message,
    source,
  };
}

function advanceStages(set: (fn: (s: OrchestratorStore) => Partial<OrchestratorStore>) => void, get: () => OrchestratorStore) {
  const stages = get().stages;
  let idx = stages.findIndex((s) => s.status === 'running');
  if (idx === -1) idx = stages.findIndex((s) => s.status === 'waiting' || s.status === 'idle');
  if (idx === -1) return;

  const stage = stages[idx];
  const durationMs = stage.durationMs ?? Math.floor(Math.random() * 3000) + 1500;

  set((s) => ({
    ...s,
    currentStageId: stage.id,
    stages: s.stages.map((st, i) =>
      i === idx
        ? { ...st, status: 'running' as StageStatus, startedAt: new Date().toLocaleTimeString() }
        : i < idx
          ? { ...st, status: 'completed' as StageStatus }
          : st
    ),
    logs: [makeLog('info', `Stage started: ${stage.label}`, stage.agentName), ...s.logs].slice(0, 200),
  }));

  progressTimer = setTimeout(() => {
    const fresh = get();
    if (fresh.workflowStatus !== 'running') return;

    set((s) => ({
      ...s,
      stages: s.stages.map((st, i) =>
        i === idx ? { ...st, status: 'completed' as StageStatus, completedAt: new Date().toLocaleTimeString() } : st
      ),
      logs: [makeLog('success', `Stage completed: ${stage.label} (${(durationMs / 1000).toFixed(1)}s)`, stage.agentName), ...s.logs].slice(0, 200),
    }));

    const nextIdx = idx + 1;
    const nextStages = get().stages;

    if (nextIdx >= nextStages.length) {
      set((s) => ({ ...s, workflowStatus: 'completed', currentStageId: null }));
      set((s) => ({ ...s, logs: [makeLog('system', '══════ WORKFLOW COMPLETED ══════', 'Orchestrator'), ...s.logs] }));
    } else {
      advanceStages(set, get);
    }
  }, durationMs);
}

export const useOrchestratorStore = create<OrchestratorStore>()(
  persist(
    (set, get) => ({
      workflowStatus: 'idle',
      stages: mockStages,
      currentStageId: 'calculate-match',
      runId: 'run_20260705_104400',

      tasks: mockTasks,
      addTask: (task) => set((s) => ({ ...s, tasks: [task, ...s.tasks] })),
      updateTask: (id, updates) => set((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })),
      retryTask: async (id) => {
        set((s) => ({
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: 'retrying' as TaskStatus, retryCount: t.retryCount + 1, error: undefined } : t
          ),
          logs: [makeLog('info', `Retrying task ${id}`, 'Orchestrator'), ...s.logs].slice(0, 200),
        }));
        await new Promise((r) => setTimeout(r, 1500));
        set((s) => ({
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: 'completed' as TaskStatus, completedAt: new Date().toLocaleTimeString(), durationMs: 2100 } : t
          ),
          logs: [makeLog('success', `Task ${id} retry succeeded`, 'Orchestrator'), ...s.logs].slice(0, 200),
        }));
      },
      retryAllFailed: async () => {
        const failed = get().tasks.filter((t) => t.status === 'failed');
        for (const t of failed) await get().retryTask(t.id);
      },
      ignoreTask: (id) => set((s) => ({
        ...s,
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, status: 'cancelled' as TaskStatus } : t)),
      })),

      workers: mockWorkers,
      updateWorker: (id, updates) => set((s) => ({
        ...s,
        workers: s.workers.map((w) => (w.id === id ? { ...w, ...updates } : w)),
      })),

      messages: mockMessages,
      addMessage: (msg) => set((s) => ({ ...s, messages: [msg, ...s.messages].slice(0, 50) })),

      logs: mockLogs,
      addLog: (log) => set((s) => ({ ...s, logs: [log, ...s.logs].slice(0, 200) })),
      clearLogs: () => set((s) => ({ ...s, logs: [] })),
      logFilter: 'all',
      logSearch: '',
      setLogFilter: (logFilter) => set((s) => ({ ...s, logFilter })),
      setLogSearch: (logSearch) => set((s) => ({ ...s, logSearch })),

      timeline: mockTimeline,
      addTimelineEvent: (evt) => set((s) => ({ ...s, timeline: [evt, ...s.timeline].slice(0, 100) })),

      metrics: mockMetrics,

      startWorkflow: async () => {
        if (progressTimer) {
          clearTimeout(progressTimer);
          progressTimer = null;
        }
        const runId = `run_${Date.now()}`;
        set((s) => ({
          ...s,
          workflowStatus: 'running',
          runId,
          currentStageId: null,
          stages: mockStages.map((st) => ({ ...st, status: 'waiting' as StageStatus })),
          logs: [makeLog('system', `══════ WORKFLOW STARTED — ${runId} ══════`, 'Orchestrator'), ...s.logs].slice(0, 200),
        }));
        await new Promise((r) => setTimeout(r, 400));
        advanceStages(set as any, get);
      },

      pauseWorkflow: async () => {
        if (progressTimer) {
          clearTimeout(progressTimer);
          progressTimer = null;
        }
        set((s) => ({
          ...s,
          workflowStatus: 'paused',
          stages: s.stages.map((st) => (st.status === 'running' ? { ...st, status: 'waiting' as StageStatus } : st)),
          logs: [makeLog('warn', 'Workflow paused by user', 'Orchestrator'), ...s.logs].slice(0, 200),
        }));
      },

      resumeWorkflow: async () => {
        set((s) => ({
          ...s,
          workflowStatus: 'running',
          logs: [makeLog('info', 'Workflow resumed by user', 'Orchestrator'), ...s.logs].slice(0, 200),
        }));
        advanceStages(set as any, get);
      },

      stopWorkflow: async () => {
        if (progressTimer) {
          clearTimeout(progressTimer);
          progressTimer = null;
        }
        set((s) => ({
          ...s,
          workflowStatus: 'idle',
          currentStageId: null,
          logs: [makeLog('warn', 'Workflow stopped by user', 'Orchestrator'), ...s.logs].slice(0, 200),
        }));
      },

      emergencyStop: () => {
        if (progressTimer) {
          clearTimeout(progressTimer);
          progressTimer = null;
        }
        set((s) => ({
          ...s,
          workflowStatus: 'failed',
          currentStageId: null,
          stages: s.stages.map((st) => (st.status === 'running' ? { ...st, status: 'failed' as StageStatus } : st)),
          workers: s.workers.map((w) => ({ ...w, status: 'offline' as Worker['status'] })),
          logs: [makeLog('error', '🚨 EMERGENCY STOP TRIGGERED — All workers halted', 'Orchestrator'), ...s.logs].slice(0, 200),
        }));
      },

      resetWorkflow: () => {
        if (progressTimer) {
          clearTimeout(progressTimer);
          progressTimer = null;
        }
        set((s) => ({
          ...s,
          workflowStatus: 'idle',
          stages: mockStages,
          tasks: mockTasks,
          workers: mockWorkers,
          messages: mockMessages,
          logs: mockLogs,
          timeline: mockTimeline,
          currentStageId: 'calculate-match',
          runId: null,
        }));
      },

      activeTab: 'pipeline',
      setActiveTab: (activeTab) => set((s) => ({ ...s, activeTab })),
    }),
    {
      name: 'autohire-orchestrator',
      partialize: (s) => ({
        workflowStatus: s.workflowStatus,
        activeTab: s.activeTab,
        logFilter: s.logFilter,
      }),
    }
  )
);

