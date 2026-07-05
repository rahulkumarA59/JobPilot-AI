// ─── Workflow ───────────────────────────────────────────────────────────────
export type WorkflowStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'stopping';

export type StageStatus = 'idle' | 'waiting' | 'running' | 'completed' | 'failed' | 'skipped';

export interface WorkflowStage {
  id: string;
  label: string;
  description: string;
  icon: string;
  status: StageStatus;
  agentName: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  dependsOn: string[];
  outputSummary?: string;
}

// ─── Task Queue ──────────────────────────────────────────────────────────────
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'retrying' | 'cancelled';

export interface OrchestratorTask {
  id: string;
  label: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  agentId: string;
  stageId: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  retryCount: number;
  maxRetries: number;
  error?: string;
}

// ─── Workers ─────────────────────────────────────────────────────────────────
export type WorkerStatus = 'idle' | 'busy' | 'failed' | 'offline';

export interface Worker {
  id: string;
  name: string;
  agentType: string;
  status: WorkerStatus;
  currentTaskId?: string;
  currentTaskLabel?: string;
  completedCount: number;
  failedCount: number;
  avgDurationMs: number;
  cpuUsage: number;
  memUsage: number;
}

// ─── Agent Messages ──────────────────────────────────────────────────────────
export type AgentRole =
  | 'Resume Agent'
  | 'Job Discovery Agent'
  | 'Matching Agent'
  | 'Cover Letter Agent'
  | 'Browser Agent'
  | 'Orchestrator';

export interface AgentMessage {
  id: string;
  fromAgent: AgentRole;
  toAgent: AgentRole;
  content: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'data';
  payload?: Record<string, unknown>;
}

// ─── Execution Log ──────────────────────────────────────────────────────────
export type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug' | 'system';

export interface ExecutionLog {
  id: string;
  level: LogLevel;
  timestamp: string;
  message: string;
  source: string;
  details?: string;
}

// ─── Timeline ────────────────────────────────────────────────────────────────
export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  agentName: string;
  durationMs?: number;
  status: 'success' | 'running' | 'failed' | 'pending';
}

// ─── Performance Metrics ─────────────────────────────────────────────────────
export interface PerformanceMetrics {
  jobsProcessed: number;
  avgProcessingTimeMs: number;
  successRate: number;
  failureRate: number;
  queueSize: number;
  throughputPerHour: number;
  totalRuntime: number;
}

// ─── DAG Node ────────────────────────────────────────────────────────────────
export interface DAGNode {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  status: StageStatus;
  agentName: string;
}

export interface DAGEdge {
  id: string;
  from: string;
  to: string;
  animated: boolean;
}
