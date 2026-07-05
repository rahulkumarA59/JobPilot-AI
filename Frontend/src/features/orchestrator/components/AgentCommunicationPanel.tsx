import { useOrchestratorStore } from '../store/orchestratorStore';
import type { AgentMessage } from '../types';
import { cn } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon, ArrowRightLeft } from 'lucide-react';

function typeCfg(type: AgentMessage['type']) {
  switch (type) {
    case 'success':
      return { cls: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200', icon: <CheckCircle2 className="h-4 w-4" /> };
    case 'warning':
      return { cls: 'border-amber-500/25 bg-amber-500/10 text-amber-200', icon: <AlertTriangle className="h-4 w-4" /> };
    case 'error':
      return { cls: 'border-rose-500/25 bg-rose-500/10 text-rose-200', icon: <AlertOctagon className="h-4 w-4" /> };
    case 'data':
      return { cls: 'border-blue-500/25 bg-blue-500/10 text-blue-200', icon: <ArrowRightLeft className="h-4 w-4" /> };
    default:
      return { cls: 'border-slate-500/25 bg-slate-500/10 text-slate-200', icon: <Info className="h-4 w-4" /> };
  }
}

export function AgentCommunicationPanel() {
  const { messages } = useOrchestratorStore();

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="text-base">💬</span> Agent Communication
          </h3>
          <p className="text-[12px] text-muted-foreground">Messages exchanged between agents during the workflow.</p>
        </div>
        <Badge variant="outline" className="border-white/10 bg-white/5 text-muted-foreground">{messages.length} messages</Badge>
      </div>

      <div className="space-y-3">
        {messages.slice().reverse().map((m) => {
          const cfg = typeCfg(m.type);
          return (
            <div key={m.id} className="p-3 rounded-xl border border-white/10 bg-background/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className={cn('px-2 py-1 rounded-full border', cfg.cls)}>{cfg.icon}</div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold truncate">
                      {m.fromAgent} → {m.toAgent}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">{m.timestamp}</p>
                  </div>
                </div>
                <Badge className={cn('border', cfg.cls)}>{m.type}</Badge>
              </div>
              <p className="mt-2 text-[12px] text-foreground/90 leading-relaxed">{m.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

