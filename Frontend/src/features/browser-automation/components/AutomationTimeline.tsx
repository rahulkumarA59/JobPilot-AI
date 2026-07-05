import { motion } from 'framer-motion';
import { useBrowserAutomationStore } from '../store/browserAutomationStore';
import { CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react';
import type { StepStatus } from '../types';

const statusIcon: Record<StepStatus, React.ReactNode> = {
  pending: <Clock className="h-3 w-3 text-slate-500" />,
  running: <Loader2 className="h-3 w-3 text-blue-400 animate-spin" />,
  completed: <CheckCircle2 className="h-3 w-3 text-emerald-400" />,
  failed: <XCircle className="h-3 w-3 text-rose-400" />,
  skipped: <Clock className="h-3 w-3 text-slate-400" />,
};

const statusColor: Record<StepStatus, string> = {
  pending: 'text-slate-400',
  running: 'text-blue-400',
  completed: 'text-emerald-400',
  failed: 'text-rose-400',
  skipped: 'text-slate-400',
};

export function AutomationTimeline() {
  const { timeline } = useBrowserAutomationStore();

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="text-base">📋</span> Automation Timeline
        </h3>
        <span className="text-[10px] text-muted-foreground font-mono">{timeline.length} events</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/5">
        {/* Header */}
        <div className="grid grid-cols-[70px_1fr_60px_70px] gap-3 px-4 py-2 bg-white/3 border-b border-white/5">
          {['Time', 'Action', 'Duration', 'Status'].map((h) => (
            <span key={h} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {timeline.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`grid grid-cols-[70px_1fr_60px_70px] gap-3 px-4 py-2.5 border-b border-white/5 last:border-0 transition-colors hover:bg-white/3 ${
                entry.status === 'running' ? 'bg-blue-500/5' : ''
              }`}
            >
              <span className="text-[10px] font-mono text-slate-400">{entry.timestamp}</span>
              <span className="text-[10px] font-medium text-foreground truncate">{entry.action}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{entry.duration}</span>
              <div className="flex items-center gap-1">
                {statusIcon[entry.status]}
                <span className={`text-[9px] font-bold uppercase ${statusColor[entry.status]}`}>
                  {entry.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
