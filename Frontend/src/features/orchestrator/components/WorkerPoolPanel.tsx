import { useOrchestratorStore } from '../store/orchestratorStore';
import type { WorkerStatus } from '../types';
import { Badge } from '@/components/ui/badge';

const statusCfg: Record<WorkerStatus, { cls: string; label: string }> = {
  idle: { cls: 'bg-slate-500/10 text-slate-200 border-slate-500/20', label: 'Idle' },
  busy: { cls: 'bg-blue-500/10 text-blue-200 border-blue-500/30', label: 'Busy' },
  failed: { cls: 'bg-rose-500/10 text-rose-200 border-rose-500/25', label: 'Failed' },
  offline: { cls: 'bg-slate-500/10 text-slate-200 border-slate-500/20', label: 'Offline' },
};

function fmtMs(ms: number) {
  const s = ms / 1000;
  return s < 10 ? `${s.toFixed(1)}s` : `${Math.round(s)}s`;
}

export function WorkerPoolPanel() {
  const { workers } = useOrchestratorStore();

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="text-base">👷</span> Worker Pool
          </h3>
          <p className="text-[12px] text-muted-foreground">Workers executing autonomous tasks.</p>
        </div>
        <Badge variant="outline" className="text-muted-foreground border-white/10 bg-white/5">
          {workers.length} workers
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {workers.map((w) => {
          const cfg = statusCfg[w.status];
          return (
            <div key={w.id} className="rounded-xl border border-white/10 bg-background/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-bold">{w.name}</p>
                  <p className="text-[11px] text-muted-foreground">{w.agentType}</p>
                </div>
                <Badge className={`border ${cfg.cls}`}>{cfg.label}</Badge>
              </div>

              {w.currentTaskId && (
                <div className="mt-3 p-3 rounded-lg border border-white/10 bg-white/5">
                  <p className="text-[11px] text-muted-foreground">Current Task</p>
                  <p className="text-[12px] font-bold truncate">{w.currentTaskLabel}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{w.currentTaskId}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <p className="text-[10px] text-muted-foreground">Done</p>
                  <p className="text-[12px] font-bold">{w.completedCount}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <p className="text-[10px] text-muted-foreground">Failed</p>
                  <p className="text-[12px] font-bold text-rose-200">{w.failedCount}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <p className="text-[10px] text-muted-foreground">Avg</p>
                  <p className="text-[12px] font-bold">{fmtMs(w.avgDurationMs)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <p className="text-[10px] text-muted-foreground">CPU</p>
                  <p className="text-[12px] font-bold">{w.cpuUsage}%</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <p className="text-[10px] text-muted-foreground">Memory</p>
                  <p className="text-[12px] font-bold">{w.memUsage}MB</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

