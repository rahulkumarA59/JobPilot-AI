import { useMemo } from 'react';
import { useOrchestratorStore } from '../store/orchestratorStore';
import type { ExecutionLog, LogLevel } from '../types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Terminal, X } from 'lucide-react';

const levelCfg: Record<LogLevel | 'all', { cls: string; label: string }> = {
  all: { cls: 'border-white/10 bg-white/5 text-muted-foreground', label: 'All' },
  info: { cls: 'border-blue-500/25 bg-blue-500/10 text-blue-200', label: 'Info' },
  success: { cls: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200', label: 'Success' },
  warn: { cls: 'border-amber-500/25 bg-amber-500/10 text-amber-200', label: 'Warn' },
  error: { cls: 'border-rose-500/25 bg-rose-500/10 text-rose-200', label: 'Error' },
  debug: { cls: 'border-slate-500/25 bg-slate-500/10 text-slate-200', label: 'Debug' },
  system: { cls: 'border-violet-500/25 bg-violet-500/10 text-violet-200', label: 'System' },
};

function formatLogLine(log: ExecutionLog) {
  return `[${log.timestamp}] ${log.source}: ${log.message}${log.details ? ` — ${log.details}` : ''}`;
}

export function ExecutionLogsPanel() {
  const {
    logs,
    logFilter,
    logSearch,
    setLogFilter,
    setLogSearch,
    clearLogs,
    addLog,
  } = useOrchestratorStore();

  const filtered = useMemo(() => {
    const q = logSearch.trim().toLowerCase();
    return logs.filter((l) => {
      const byLevel = logFilter === 'all' ? true : l.level === logFilter;
      const bySearch = !q ? true : formatLogLine(l).toLowerCase().includes(q);
      return byLevel && bySearch;
    });
  }, [logs, logFilter, logSearch]);

  const filterOptions: Array<LogLevel | 'all'> = ['all', 'system', 'info', 'success', 'warn', 'error', 'debug'];

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="text-base">⌨️</span> Execution Logs
          </h3>
          <p className="text-[12px] text-muted-foreground">Terminal-style, color coded logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => clearLogs()}>
            <X className="h-4 w-4 mr-2" /> Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center mb-3">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setLogFilter(opt)}
            className={
              opt === logFilter
                ? `px-3 py-1.5 rounded-full border font-bold text-[11px] ${levelCfg[opt].cls}`
                : `px-3 py-1.5 rounded-full border font-bold text-[11px] border-white/10 bg-white/5 text-muted-foreground hover:bg-accent`
            }
          >
            {levelCfg[opt].label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
          <Input
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            placeholder="Search logs..."
            className="pl-9 rounded-xl bg-white/5 border-white/10"
          />
        </div>
        <Badge variant="outline" className="border-white/10 bg-white/5 text-muted-foreground">
          {filtered.length} lines
        </Badge>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-bold">
            <Terminal className="h-4 w-4" /> Terminal
          </div>
          <div className="text-[11px] text-muted-foreground font-mono">Filter: {logFilter}</div>
        </div>
        <div className="max-h-[360px] overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">No logs match current filter.</p>
          ) : (
            filtered.map((l) => {
              const cfg = levelCfg[l.level];
              return (
                <div key={l.id} className={`font-mono text-[11px] px-2 py-1 rounded-lg border ${cfg.cls}`}> {formatLogLine(l)}</div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

