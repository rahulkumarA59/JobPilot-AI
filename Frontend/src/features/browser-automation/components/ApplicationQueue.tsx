import { motion } from 'framer-motion';
import { useBrowserAutomationStore } from '../store/browserAutomationStore';
import { Loader2, CheckCircle2, XCircle, Clock, RotateCcw, ChevronRight } from 'lucide-react';
import type { QueueStatus } from '../types';

const queueStatusConfig: Record<QueueStatus, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  waiting: {
    icon: <Clock className="h-3.5 w-3.5" />,
    label: 'Waiting',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/20',
  },
  running: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    label: 'Running',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15 border-blue-500/30',
  },
  completed: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: 'Completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  failed: {
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: 'Failed',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
  retry: {
    icon: <RotateCcw className="h-3.5 w-3.5 animate-spin" />,
    label: 'Retry',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
};

const statusOrder: QueueStatus[] = ['running', 'retry', 'waiting', 'completed', 'failed'];

export function ApplicationQueue() {
  const { queue, updateQueueItem } = useBrowserAutomationStore();

  const counts = queue.reduce(
    (acc, q) => { acc[q.status] = (acc[q.status] || 0) + 1; return acc; },
    {} as Record<QueueStatus, number>
  );

  const sorted = [...queue].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="text-base">📦</span> Application Queue
        </h3>
        <span className="text-[10px] text-muted-foreground font-mono">{queue.length} total</span>
      </div>

      {/* Status tabs */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {(Object.entries(queueStatusConfig) as [QueueStatus, typeof queueStatusConfig[QueueStatus]][]).map(([status, cfg]) => (
          <div
            key={status}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border ${cfg.bg}`}
          >
            <span className={cfg.color}>{cfg.icon}</span>
            <span className={`text-[9px] font-black ${cfg.color}`}>{counts[status] ?? 0}</span>
            <span className="text-[8px] text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Queue items */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {sorted.map((item, index) => {
          const cfg = queueStatusConfig[item.status];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${cfg.bg} group cursor-pointer hover:scale-[1.01]`}
            >
              {/* Logo */}
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-base shrink-0">
                {item.logo}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{item.company}</p>
                <p className="text-[10px] text-muted-foreground truncate">{item.role}</p>
              </div>

              {/* Match */}
              <div className="text-right shrink-0">
                <p className={`text-xs font-black ${cfg.color}`}>{item.matchPercent}%</p>
                <p className="text-[9px] text-muted-foreground">match</p>
              </div>

              {/* Status */}
              <div className={`flex items-center gap-1 shrink-0 ${cfg.color}`}>
                {cfg.icon}
              </div>

              {/* Retry count badge */}
              {item.retryCount > 0 && (
                <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded shrink-0">
                  ×{item.retryCount}
                </span>
              )}

              <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
