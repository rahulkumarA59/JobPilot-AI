import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useOrchestratorStore } from '../store/orchestratorStore';
import { Play, Pause, RotateCcw, Square, Settings, ShieldAlert } from 'lucide-react';

const actionDisabled = (workflowStatus: string, action: 'start' | 'pause' | 'resume' | 'stop' | 'emergency' | 'reset') => {
  if (action === 'start') return workflowStatus === 'running';
  if (action === 'pause') return workflowStatus !== 'running';
  if (action === 'resume') return workflowStatus !== 'paused' && workflowStatus !== 'failed';

  if (action === 'stop') return workflowStatus === 'idle';
  if (action === 'emergency') return workflowStatus === 'idle' || workflowStatus === 'failed';
  if (action === 'reset') return false;


  return false;
};

export function OrchestratorControls() {
  const {
    workflowStatus,
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    stopWorkflow,
    emergencyStop,
    resetWorkflow,
  } = useOrchestratorStore();

  const statusBadge = useMemo(() => {
    const base = 'text-[11px] font-bold px-2 py-1 rounded-full border';
    switch (workflowStatus) {
      case 'running':
        return { className: `${base} text-blue-400 border-blue-500/30 bg-blue-500/10`, label: 'Running' };
      case 'paused':
        return { className: `${base} text-amber-300 border-amber-500/30 bg-amber-500/10`, label: 'Paused' };
      case 'completed':
        return { className: `${base} text-emerald-400 border-emerald-500/25 bg-emerald-500/8`, label: 'Completed' };
      case 'failed':
      case 'stopping':
        return { className: `${base} text-rose-400 border-rose-500/25 bg-rose-500/10`, label: 'Failed' };
      default:
        return { className: `${base} text-slate-300 border-white/10 bg-white/5`, label: 'Idle' };
    }
  }, [workflowStatus]);

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Controls</h3>
          <p className="text-[12px] text-muted-foreground">Start, pause, retry, and emergency-stop orchestration.</p>
        </div>
        <span className={statusBadge.className}>{statusBadge.label}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <Button
          variant="default"
          disabled={actionDisabled(workflowStatus, 'start')}
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90"
          onClick={() => startWorkflow()}
        >
          <Play className="h-4 w-4 mr-2" /> Start
        </Button>

        <Button
          variant="secondary"
          disabled={actionDisabled(workflowStatus, 'pause')}
          onClick={() => pauseWorkflow()}
        >
          <Pause className="h-4 w-4 mr-2" /> Pause
        </Button>

        <Button
          variant="secondary"
          disabled={actionDisabled(workflowStatus, 'resume')}
          onClick={() => resumeWorkflow()}
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Resume
        </Button>

        <Button variant="secondary" disabled={actionDisabled(workflowStatus, 'stop')} onClick={() => stopWorkflow()}>
          <Square className="h-4 w-4 mr-2" /> Stop
        </Button>

        <Button
          variant="destructive"
          disabled={actionDisabled(workflowStatus, 'emergency')}
          onClick={() => emergencyStop()}
        >
          <ShieldAlert className="h-4 w-4 mr-2" /> Emergency
        </Button>

        <Button variant="outline" disabled={actionDisabled(workflowStatus, 'reset')} onClick={() => resetWorkflow()}>
          <Settings className="h-4 w-4 mr-2" /> Reset
        </Button>
      </div>
    </div>
  );
}

