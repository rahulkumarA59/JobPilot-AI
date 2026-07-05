import { motion } from 'framer-motion';
import { useBrowserAutomationStore } from '../store/browserAutomationStore';
import { Play, Pause, Square, RotateCcw, StepForward } from 'lucide-react';
import { toast } from 'sonner';

export function AutomationControls() {
  const {
    automationStatus,
    startAutomation,
    pauseAutomation,
    resumeAutomation,
    stopAutomation,
    retryFailed,
    queue,
  } = useBrowserAutomationStore();

  const hasFailures = queue.some((q) => q.status === 'failed');
  const isIdle = automationStatus === 'idle';
  const isRunning = automationStatus === 'running';
  const isPaused = automationStatus === 'paused';
  const isCompleted = automationStatus === 'completed';

  const handleStart = () => {
    toast.promise(startAutomation(), {
      loading: 'Initializing browser automation...',
      success: 'Automation started!',
      error: 'Failed to start automation.',
    });
  };

  const handlePause = () => {
    pauseAutomation();
    toast.info('Automation paused');
  };

  const handleResume = () => {
    toast.promise(resumeAutomation(), {
      loading: 'Resuming automation...',
      success: 'Automation resumed!',
      error: 'Failed to resume.',
    });
  };

  const handleStop = () => {
    stopAutomation();
    toast.warning('Automation stopped');
  };

  const handleRetry = () => {
    toast.promise(retryFailed(), {
      loading: 'Retrying failed applications...',
      success: 'Retry started!',
      error: 'Failed to retry.',
    });
  };

  const controls = [
    {
      id: 'start',
      label: 'Start',
      icon: Play,
      onClick: handleStart,
      disabled: isRunning || isPaused,
      visible: isIdle || isCompleted,
      style: 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20',
    },
    {
      id: 'pause',
      label: 'Pause',
      icon: Pause,
      onClick: handlePause,
      disabled: !isRunning,
      visible: isRunning,
      style: 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-500/20',
    },
    {
      id: 'resume',
      label: 'Resume',
      icon: StepForward,
      onClick: handleResume,
      disabled: !isPaused,
      visible: isPaused,
      style: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20',
    },
    {
      id: 'stop',
      label: 'Stop',
      icon: Square,
      onClick: handleStop,
      disabled: isIdle || isCompleted,
      visible: true,
      style: 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/20',
    },
    {
      id: 'retry',
      label: 'Retry Failed',
      icon: RotateCcw,
      onClick: handleRetry,
      disabled: !hasFailures,
      visible: true,
      style: 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/20',
    },
  ];

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="text-base">🎮</span> Automation Controls
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {controls.map((ctrl) => {
          if (!ctrl.visible) return null;
          const Icon = ctrl.icon;
          return (
            <motion.button
              key={ctrl.id}
              id={`automation-ctrl-${ctrl.id}`}
              whileHover={{ scale: ctrl.disabled ? 1 : 1.03 }}
              whileTap={{ scale: ctrl.disabled ? 1 : 0.97 }}
              onClick={ctrl.onClick}
              disabled={ctrl.disabled}
              className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl text-xs font-bold transition-all ${
                ctrl.disabled
                  ? 'opacity-40 cursor-not-allowed bg-white/3 border border-white/5 text-muted-foreground'
                  : `${ctrl.style} cursor-pointer`
              }`}
            >
              <Icon className={`h-5 w-5 ${ctrl.id === 'resume' && isPaused ? 'text-white' : ''}`} />
              {ctrl.label}
            </motion.button>
          );
        })}
      </div>

      {/* Status indicator */}
      <div className="mt-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${
            isRunning ? 'bg-emerald-500 animate-pulse' :
            isPaused ? 'bg-amber-500' :
            isCompleted ? 'bg-blue-500' :
            automationStatus === 'failed' ? 'bg-rose-500' :
            'bg-slate-500'
          }`} />
          <span className="text-[11px] font-bold text-foreground capitalize">{automationStatus}</span>
        </div>
        {hasFailures && (
          <span className="text-[10px] text-rose-400 font-bold">
            {queue.filter((q) => q.status === 'failed').length} failed
          </span>
        )}
      </div>
    </div>
  );
}
