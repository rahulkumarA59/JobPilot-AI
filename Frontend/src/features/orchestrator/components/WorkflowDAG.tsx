import { useMemo } from 'react';
import { useOrchestratorStore } from '../store/orchestratorStore';
import type { DAGNode, DAGEdge, StageStatus } from '../types';
import { mockDAGNodes, mockDAGEdges } from '../mock/orchestratorData';

function statusClass(status: StageStatus) {
  switch (status) {
    case 'running':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-200';
    case 'completed':
      return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200';
    case 'failed':
      return 'border-rose-500/25 bg-rose-500/10 text-rose-200';
    case 'waiting':
      return 'border-slate-500/20 bg-slate-500/10 text-slate-200';
    default:
      return 'border-white/10 bg-white/5 text-muted-foreground';
  }
}

function pickStatusForNode(nodes: DAGNode[], stagesById: Map<string, StageStatus>) {
  return nodes.map((n) => ({
    ...n,
    status: stagesById.get(n.id) ?? n.status,
  }));
}

export function WorkflowDAG() {
  const { stages } = useOrchestratorStore();

  const renderedNodes = useMemo(() => {
    const stagesById = new Map(stages.map((s) => [s.id, s.status] as const));
    return pickStatusForNode(mockDAGNodes, stagesById);
  }, [stages]);

  const edges: DAGEdge[] = useMemo(() => mockDAGEdges, []);

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="text-base">🧠</span> Workflow Engine (DAG)
          </h3>
          <p className="text-[12px] text-muted-foreground">Node-based flow with animated connections (mock).</p>
        </div>
      </div>

      <div className="h-[520px] rounded-xl border border-white/10 bg-background/40 overflow-hidden relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1400 520" preserveAspectRatio="none">
          <defs>
            <marker id="arrowHead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.35)" />
            </marker>
          </defs>
          {edges.map((e) => {
            const from = renderedNodes.find((n) => n.id === e.from);
            const to = renderedNodes.find((n) => n.id === e.to);
            if (!from || !to) return null;

            // Map node coordinates (mock) into this SVG.
            // mock uses x=100 for all; we spread vertically.
            const x1 = 240;
            const x2 = 240;
            const y1 = 40 + (from.y - 40);
            const y2 = 40 + (to.y - 40);

            const path = `M ${x1} ${y1} C ${x1 + 60} ${y1} ${x2 + 60} ${y2} ${x2} ${y2}`;
            return (
              <path
                key={e.id}
                d={path}
                fill="none"
                stroke={e.animated ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.25)'}
                strokeWidth={e.animated ? 2.2 : 1.6}
                strokeDasharray={e.animated ? '6 6' : '0'}
                markerEnd="url(#arrowHead)"
              >
                {e.animated && (
                  <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
                )}
              </path>
            );
          })}
        </svg>

        <div className="relative z-10 p-6">
          <div className="space-y-3">
            {renderedNodes.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl border bg-background/20 backdrop-blur px-4 py-3 flex items-center justify-between gap-3 ${statusClass(n.status)}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg border bg-white/5 flex items-center justify-center shrink-0">
                    <span className="text-lg">{n.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold truncate">{n.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">Agent: {n.agentName}</p>
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold opacity-90">{n.id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-[12px] text-muted-foreground">
        Current status is derived from the orchestrator stages (mock DAG).
      </div>
    </div>
  );
}

