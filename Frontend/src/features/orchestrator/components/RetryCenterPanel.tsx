import { useMemo } from 'react';
import { useOrchestratorStore } from '../store/orchestratorStore';
import type { TaskStatus } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Ban, AlertTriangle } from 'lucide-react';

const statusCfg: Record<TaskStatus, string> = {
  queued: 'bg-slate-500/10 text-slate-200 border-slate-500/20',
  running: 'bg-blue-500/10 text-blue-200 border-blue-500/30',
  completed: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25',
  failed: 'bg-rose-500/10 text-rose-200 border-rose-500/25',
  retrying: 'bg-amber-500/10 text-amber-200 border-amber-500/25',
  cancelled: 'bg-slate-500/10 text-slate-200 border-slate-500/20',
};

export function RetryCenterPanel() {
  const { tasks, retryAllFailed, retryTask, ignoreTask, workflowStatus } = useOrchestratorStore();

  const failed = useMemo(() => tasks.filter((t) => t.status === 'failed'), [tasks]);

  const canRetryAll = failed.length > 0 && workflowStatus !== 'running';

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="text-base">♻️</span> Retry Center
          </h3>
          <p className="text-[12px] text-muted-foreground">Failed tasks with one-click retry.</p>
        </div>
        <Badge className={`border ${failed.length ? statusCfg.failed : 'bg-slate-500/10 text-slate-200 border-slate-500/20'}`}>
          <AlertTriangle className="h-3.5 w-3.5 mr-1" /> {failed.length} failed
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="secondary" disabled={!canRetryAll} onClick={() => retryAllFailed()}>
          <RotateCcw className="h-4 w-4 mr-2" /> Retry All Failed
        </Button>
        <Button variant="outline" disabled={failed.length === 0} onClick={() => {
          for (const t of failed) ignoreTask(t.id);
        }}>
          <Ban className="h-4 w-4 mr-2" /> Ignore Failed
        </Button>
      </div>

      <div className="space-y-2">
        {failed.length === 0 ? (
          <p className="text-[12px] text-muted-foreground">No failed tasks right now.</p>
        ) : (
          failed.map((t) => (
            <div key={t.id} className="p-3 rounded-xl border border-white/10 bg-background/40 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-bold truncate">{t.label}</p>
                <p className="text-[11px] text-muted-foreground truncate font-mono">{t.id}</p>
                {t.error && <p className="text-[11px] text-rose-200 mt-1">{t.error}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={`border ${statusCfg[t.status]}`}>{t.status}</Badge>
                <Button variant="secondary" className="rounded-xl" disabled={t.retryCount >= t.maxRetries} onClick={() => retryTask(t.id)}>
                  Retry
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

