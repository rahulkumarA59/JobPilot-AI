import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrchestratorStore } from '@/features/orchestrator/store/orchestratorStore';
import { WorkflowPipeline } from '@/features/orchestrator/components/WorkflowPipeline';
import { WorkflowDAG } from '@/features/orchestrator/components/WorkflowDAG';
import { TaskQueuePanel } from '@/features/orchestrator/components/TaskQueuePanel';
import { AgentCommunicationPanel } from '@/features/orchestrator/components/AgentCommunicationPanel';
import { ExecutionTimelinePanel } from '@/features/orchestrator/components/ExecutionTimelinePanel';
import { WorkerPoolPanel } from '@/features/orchestrator/components/WorkerPoolPanel';
import { RetryCenterPanel } from '@/features/orchestrator/components/RetryCenterPanel';
import { ExecutionLogsPanel } from '@/features/orchestrator/components/ExecutionLogsPanel';
import { PerformanceMetricsPanel } from '@/features/orchestrator/components/PerformanceMetricsPanel';
import { OrchestratorControls } from '@/features/orchestrator/components/OrchestratorControls';

import { cn } from '@/utils';
import { Bot, Network, ListChecks, MessageSquare, Timer, Users, RotateCcw, Terminal, BarChart } from 'lucide-react';

const tabs = [
  { key: 'pipeline', label: 'Pipeline', icon: Bot },
  { key: 'dag', label: 'DAG', icon: Network },
  { key: 'tasks', label: 'Tasks', icon: ListChecks },
  { key: 'agents', label: 'Agents', icon: MessageSquare },
  { key: 'timeline', label: 'Timeline', icon: Timer },
  { key: 'workers', label: 'Workers', icon: Users },
  { key: 'retry', label: 'Retry Center', icon: RotateCcw },
  { key: 'logs', label: 'Logs', icon: Terminal },
  { key: 'metrics', label: 'Metrics', icon: BarChart },
] as const;

export default function AIOrchestratorDashboard() {
  const { activeTab, setActiveTab } = useOrchestratorStore();

  const Active = useMemo(() => {
    switch (activeTab) {
      case 'pipeline':
        return <WorkflowPipeline />;
      case 'dag':
        return <WorkflowDAG />;
      case 'tasks':
        return <TaskQueuePanel />;
      case 'agents':
        return <AgentCommunicationPanel />;
      case 'timeline':
        return <ExecutionTimelinePanel />;
      case 'workers':
        return <WorkerPoolPanel />;
      case 'retry':
        return <RetryCenterPanel />;
      case 'logs':
        return <ExecutionLogsPanel />;
      case 'metrics':
        return <PerformanceMetricsPanel />;
      default:
        return <WorkflowPipeline />;
    }
  }, [activeTab]);

  return (
    <div className="space-y-4">

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glassmorphism rounded-2xl border border-white/10 p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-foreground">AI Orchestrator Dashboard</h2>
            <p className="text-[12px] text-muted-foreground">
              Orchestrates Resume Studio → Job Discovery → Matching → Tailoring → Cover Letters → Browser Automation.
            </p>
          </div>
          <div className="min-w-[220px]">
            <OrchestratorControls />
          </div>
        </div>
      </motion.div>

      <div className="glassmorphism rounded-2xl border border-white/10 p-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={cn(
                'rounded-xl border px-3 py-2 text-[12px] font-bold flex items-center',
                activeTab === t.key
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white border-white/10'
                  : 'bg-white/5 text-muted-foreground hover:bg-accent'
              )}
            >
              <t.icon className="h-4 w-4 mr-2" />
              {t.label}
            </button>
          ))}
        </div>
      </div>


      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {Active}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

