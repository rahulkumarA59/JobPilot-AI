import { useOrchestratorStore } from '../store/orchestratorStore';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gauge, TrendingUp, AlertTriangle, CheckCircle2, Layers } from 'lucide-react';

export function PerformanceMetricsPanel() {
  const { metrics } = useOrchestratorStore();

  const failurePercent = metrics.successRate === 0 ? metrics.failureRate : (metrics.failureRate);

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span className="text-base">📈</span> Performance Metrics
          </h3>
          <p className="text-[12px] text-muted-foreground">Throughput, success/failure, and queue size.</p>
        </div>
        <Badge variant="outline" className="border-white/10 bg-white/5 text-muted-foreground">
          <Gauge className="h-4 w-4 mr-2" /> {metrics.throughputPerHour}/hr
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <p className="text-[11px] text-muted-foreground">Jobs Processed</p>
          <p className="text-[18px] font-black">{metrics.jobsProcessed}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <p className="text-[11px] text-muted-foreground">Avg Processing Time</p>
          <p className="text-[18px] font-black">{(metrics.avgProcessingTimeMs / 1000).toFixed(1)}s</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <p className="text-[11px] text-muted-foreground">Success Rate</p>
          <p className="text-[18px] font-black">{metrics.successRate}%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <p className="text-[11px] text-muted-foreground">Failure Rate</p>
          <p className="text-[18px] font-black text-rose-200">{metrics.failureRate}%</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold">Success vs Failure</p>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Success
                </p>
                <p className="text-[11px] font-bold">{metrics.successRate}%</p>
              </div>
              <Progress value={metrics.successRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-300" /> Failure
                </p>
                <p className="text-[11px] font-bold">{metrics.failureRate}%</p>
              </div>
              <Progress value={metrics.failureRate} className="h-2" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold">Queue & Runtime</p>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">Queue Size</p>
              <p className="text-[12px] font-bold">{metrics.queueSize}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">Total Runtime</p>
              <p className="text-[12px] font-bold">{(metrics.totalRuntime / 1000).toFixed(0)}s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

