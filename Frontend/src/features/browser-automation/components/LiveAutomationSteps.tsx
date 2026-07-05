import { motion, AnimatePresence } from 'framer-motion';
import { useBrowserAutomationStore } from '../store/browserAutomationStore';
import { CheckCircle2, Loader2, Circle, XCircle, SkipForward } from 'lucide-react';
import type { StepStatus } from '../types';

const statusConfig: Record<StepStatus, { icon: React.ReactNode; color: string; bg: string }> = {
  pending: {
    icon: <Circle className="h-4 w-4" />,
    color: 'text-slate-500',
    bg: 'bg-slate-500/10 border-slate-500/20',
  },
  running: {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15 border-blue-500/30',
  },
  completed: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  failed: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
  skipped: {
    icon: <SkipForward className="h-4 w-4" />,
    color: 'text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/20',
  },
};

export function LiveAutomationSteps() {
  const { steps, automationStatus } = useBrowserAutomationStore();

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="text-base">⚡</span> Live Automation
        </h3>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
          automationStatus === 'running' ? 'bg-blue-500/20 text-blue-400' :
          automationStatus === 'paused' ? 'bg-amber-500/20 text-amber-400' :
          automationStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
          automationStatus === 'failed' ? 'bg-rose-500/20 text-rose-400' :
          'bg-slate-500/20 text-slate-400'
        }`}>
          {automationStatus}
        </span>
      </div>

      <div className="space-y-2 relative">
        {/* Vertical connector line */}
        <div className="absolute left-[18px] top-5 bottom-5 w-px bg-white/5" />

        {steps.map((step, index) => {
          const cfg = statusConfig[step.status];
          const isActive = step.status === 'running';

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all ${cfg.bg} ${
                isActive ? 'shadow-lg shadow-blue-500/10' : ''
              }`}
            >
              {/* Status icon */}
              <div className={`shrink-0 ${cfg.color} z-10 bg-background rounded-full p-0.5`}>
                {cfg.icon}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <span className="mr-1">{step.icon}</span>
                  {step.label}
                </p>
                {step.duration && step.status === 'completed' && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Completed in {(step.duration / 1000).toFixed(1)}s
                  </p>
                )}
              </div>

              {/* Running pulse */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.4, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-blue-500 shrink-0"
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
