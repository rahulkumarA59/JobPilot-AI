import { motion, AnimatePresence } from 'framer-motion';
import { useOrchestratorStore } from '../store/orchestratorStore';
import type { StageStatus } from '../types';
import { CheckCircle2, Loader2, Circle, XCircle, Clock, ChevronRight } from 'lucide-react';

const statusConfig: Record<StageStatus, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  idle:      { icon: <Circle className="h-4 w-4" />,                         color: 'text-slate-400',   bg: 'bg-slate-500/5',   border: 'border-slate-500/15' },
  waiting:   { icon: <Clock className="h-4 w-4" />,                          color: 'text-slate-400',   bg: 'bg-slate-500/5',   border: 'border-slate-500/15' },
  running:   { icon: <Loader2 className="h-4 w-4 animate-spin" />,           color: 'text-blue-400',    bg: 'bg-blue-500/10',   border: 'border-blue-500/30' },
  completed: { icon: <CheckCircle2 className="h-4 w-4" />,                   color: 'text-emerald-400', bg: 'bg-emerald-500/8', border: 'border-emerald-500/20' },
  failed:    { icon: <XCircle className="h-4 w-4" />,                        color: 'text-rose-400',    bg: 'bg-rose-500/10',   border: 'border-rose-500/25' },
  skipped:   { icon: <ChevronRight className="h-4 w-4" />,                   color: 'text-slate-500',   bg: 'bg-slate-500/5',   border: 'border-slate-500/10' },
};

export function WorkflowPipeline() {
  const { stages, currentStageId, workflowStatus } = useOrchestratorStore();

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="text-base">🔄</span> Workflow Pipeline
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          {(['completed','running','waiting','failed'] as StageStatus[]).map((s) => (
            <span key={s} className={`px-2 py-1 rounded-full border ${statusConfig[s].bg} ${statusConfig[s].border} ${statusConfig[s].color}`}>
              {stages.filter((st) => st.status === s).length} {s}
            </span>
          ))}
        </div>
      </div>

      {/* Pipeline flow */}
      <div className="space-y-1 relative">
        {/* Vertical connector */}
        <div className="absolute left-[22px] top-6 bottom-6 w-px bg-white/5 z-0" />

        {stages.map((stage, index) => {
          const cfg = statusConfig[stage.status];
          const isActive = stage.id === currentStageId;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.035 }}
              className={`relative flex items-start gap-3 p-3 rounded-xl border transition-all z-10 ${cfg.bg} ${cfg.border} ${
                isActive ? 'shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20' : ''
              }`}
            >
              {/* Icon circle */}
              <div className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full border ${cfg.border} bg-background/60 z-10 ${cfg.color}`}>
                {cfg.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <span className="mr-1.5">{stage.icon}</span>{stage.label}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    {stage.durationMs && (
                      <span className="text-[9px] font-mono text-muted-foreground">
                        {(stage.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                      {stage.agentName}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{stage.description}</p>
                {stage.outputSummary && stage.status === 'completed' && (
                  <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">↳ {stage.outputSummary}</p>
                )}
              </div>

              {/* Active pulse */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.3, 0.8] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0 mt-2"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
