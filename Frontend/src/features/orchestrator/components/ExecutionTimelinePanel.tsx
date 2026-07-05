import { useOrchestratorStore } from '../store/orchestratorStore';
import { Clock3, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import type { TimelineEvent } from '../types';

function statusBadge(evt: TimelineEvent) {
  if (evt.status === 'success') {
    return { cls: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25', icon: <CheckCircle2 className="h-3.5 w-3.5" /> };
  }
  if (evt.status === 'failed') {
    return { cls: 'bg-rose-500/10 text-rose-200 border-rose-500/25', icon: <AlertTriangle className="h-3.5 w-3.5" /> };
  }
  if (evt.status === 'running') {
    return { cls: 'bg-blue-500/10 text-blue-200 border-blue-500/30', icon: <Play className="h-3.5 w-3.5 animate-pulse" /> };
  }
  return { cls: 'bg-slate-500/10 text-slate-200 border-slate-500/20', icon: <Clock3 className="h-3.5 w-3.5" /> };
}

export function ExecutionTimelinePanel() {
  const { timeline } = useOrchestratorStore();

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="text-base">🕒</span> Execution Timeline
          </h3>
          <p className="text-[12px] text-muted-foreground">Events, status transitions, and durations.</p>
        </div>
      </div>

      <div className="space-y-3">
        {timeline.slice().reverse().map((evt) => {
          const b = statusBadge(evt);
          return (
            <div key={evt.id} className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-background/40">
              <div className={`shrink-0 mt-0.5 px-2 py-1 rounded-full border ${b.cls}`}>{b.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[12px] font-bold truncate">{evt.eventType}: {evt.description}</p>
                  <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap">{evt.timestamp}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[11px] text-muted-foreground truncate">Agent: <span className="text-foreground/80 font-bold">{evt.agentName}</span></p>
                  {evt.durationMs && (
                    <p className="text-[11px] text-muted-foreground whitespace-nowrap">
                      Duration: <span className="font-bold text-foreground/80">{(evt.durationMs / 1000).toFixed(1)}s</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

