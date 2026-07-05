import { useMemo } from 'react';
import { useOrchestratorStore } from '../store/orchestratorStore';
import type { TaskStatus } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Repeat, AlertTriangle } from 'lucide-react';

const statusCfg: Record<TaskStatus, { cls: string; label: string }> = {
  queued: { cls: 'bg-slate-500/10 text-slate-200 border-slate-500/20', label: 'Queued' },
  running: { cls: 'bg-blue-500/10 text-blue-200 border-blue-500/30', label: 'Running' },
  completed: { cls: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25', label: 'Completed' },
  failed: { cls: 'bg-rose-500/10 text-rose-200 border-rose-500/25', label: 'Failed' },
  retrying: { cls: 'bg-amber-500/10 text-amber-200 border-amber-500/25', label: 'Retrying' },
  cancelled: { cls: 'bg-slate-500/10 text-slate-200 border-slate-500/20', label: 'Cancelled' },
};

function fmtMs(ms?: number) {
  if (!ms) return '—';
  const s = ms / 1000;
  return s < 10 ? `${s.toFixed(1)}s` : `${Math.round(s)}s`;
}

export function TaskQueuePanel() {
  const { tasks, retryTask, ignoreTask } = useOrchestratorStore();

  const failedCount = useMemo(() => tasks.filter((t) => t.status === 'failed').length, [tasks]);

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="text-base">🧾</span> Task Queue
          </h3>
          <p className="text-[12px] text-muted-foreground">Priorities, status, retries, and durations.</p>
        </div>
        <div className="flex items-center gap-2">
          {failedCount > 0 && (
            <Badge className="bg-rose-500/10 text-rose-200 border-rose-500/25 hover:bg-rose-500/10">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" /> {failedCount} failed
            </Badge>
          )}
          <Badge variant="outline" className="text-muted-foreground border-white/10 bg-white/5">
            <Clock className="h-3.5 w-3.5 mr-1" /> {tasks.length} tasks
          </Badge>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-background/40">
        <div className="grid grid-cols-12 gap-0 bg-white/5 px-3 py-2 text-[11px] font-bold text-muted-foreground">
          <div className="col-span-4">Task</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Retry</div>
          <div className="col-span-2">Duration</div>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {tasks.map((t) => {
            const cfg = statusCfg[t.status];
            const retryLabel = `${t.retryCount}/${t.maxRetries}`;
            return (
              <div key={t.id} className="grid grid-cols-12 px-3 py-3 border-t border-white/10 items-center">
                <div className="col-span-4 min-w-0">
                  <p className="text-[12px] font-bold truncate">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{t.description}</p>
                </div>
                <div className="col-span-2">
                  <Badge className={
                    t.priority === 'critical'
                      ? 'bg-rose-500/10 text-rose-200 border-rose-500/25'
                      : t.priority === 'high'
                        ? 'bg-amber-500/10 text-amber-200 border-amber-500/25'
                        : t.priority === 'medium'
                          ? 'bg-blue-500/10 text-blue-200 border-blue-500/25'
                          : 'bg-slate-500/10 text-slate-200 border-slate-500/25'
                  }>
                    {t.priority}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Badge className={`border ${cfg.cls}`}>{cfg.label}</Badge>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-foreground">{retryLabel}</span>
                    {t.status === 'failed' && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7 rounded-xl"
                          onClick={() => retryTask(t.id)}
                        >
                          <Repeat className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 rounded-xl"
                          onClick={() => ignoreTask(t.id)}
                        >
                          <span className="text-base leading-none">×</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-[12px] font-bold text-muted-foreground">{fmtMs(t.durationMs)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

