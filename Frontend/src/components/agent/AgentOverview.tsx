import React from "react";
import { useAgentStore } from "@/store/agentStore";
import {
  Play, Pause, RotateCcw, ShieldAlert, CheckCircle2,
  Bot, Clock, Compass, Target, TrendingUp, Cpu
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AgentOverview() {
  const {
    status,
    currentTask,
    activeBrowserUrl,
    applicationsCompleted,
    successRate,
    estimatedTimeRemaining,
    timelineLogs,
    startAgent,
    pauseAgent,
    resetQueue,
    emergencyStop
  } = useAgentStore();

  const getStatusColor = () => {
    switch (status) {
      case "running":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "paused":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "error":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "stopped":
        return "text-slate-500 bg-slate-500/10 border-slate-500/20";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getStatusPulse = () => {
    if (status === "running") return "bg-green-500 animate-ping";
    if (status === "paused") return "bg-amber-500 animate-pulse";
    if (status === "error") return "bg-red-500 animate-pulse";
    return "bg-blue-500";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      <Card className="p-6 relative overflow-hidden glass-card dark:bg-card/50 border-border/80">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-purple-500/5 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/30 flex items-center justify-center shadow-glow">
              <Bot className="h-7 w-7 text-primary animate-bounce-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">AutoHire Recruiter Agent</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor()}`}>
                  <span className={`h-2 w-2 rounded-full ${getStatusPulse()}`} />
                  {status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl font-medium">
                {currentTask}
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {status !== "running" ? (
              <button
                onClick={startAgent}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow text-sm"
              >
                <Play className="h-4 w-4 fill-current" />
                Start Agent
              </button>
            ) : (
              <button
                onClick={pauseAgent}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md text-sm"
              >
                <Pause className="h-4 w-4" />
                Pause Agent
              </button>
            )}

            <button
              onClick={resetQueue}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/80 hover:scale-[1.02] active:scale-[0.98] transition-all border border-border text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Agent
            </button>

            <button
              onClick={emergencyStop}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive font-semibold hover:bg-destructive hover:text-white transition-all border border-destructive/20 text-sm"
            >
              <ShieldAlert className="h-4 w-4" />
              Kill Sandbox
            </button>
          </div>
        </div>
      </Card>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="p-5 bg-card/60 border-border/80 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start text-muted-foreground">
            <span className="text-sm font-semibold">Applications Filed</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{applicationsCompleted}</h3>
            <p className="text-xs text-green-500 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +3 completed today
            </p>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-5 bg-card/60 border-border/80 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start text-muted-foreground">
            <span className="text-sm font-semibold">AI Interview Match Rate</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{successRate}%</h3>
            <p className="text-xs text-violet-500 font-semibold flex items-center gap-1 mt-1">
              Optimized for 18 skills
            </p>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="p-5 bg-card/60 border-border/80 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start text-muted-foreground">
            <span className="text-sm font-semibold">Active Browser Sandbox</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-foreground truncate mt-2">
              {activeBrowserUrl === "about:blank" ? "Standby URL" : activeBrowserUrl.replace("https://", "")}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Browser isolation: secure docker sandbox
            </p>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="p-5 bg-card/60 border-border/80 flex flex-col justify-between h-36">
          <div className="flex justify-between items-start text-muted-foreground">
            <span className="text-sm font-semibold">Time Remaining</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{estimatedTimeRemaining}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Dynamic queue processing time
            </p>
          </div>
        </Card>
      </div>

      {/* Row 2: Today's Goal and Running Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Goals */}
        <Card className="p-6 bg-card/60 border-border/80 lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-foreground">Today's Goals</h3>
            <span className="text-xs font-semibold text-muted-foreground">4 / 5 Roles</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Form filling & Submission progress</span>
                <span className="text-primary font-bold">80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-xs text-foreground font-semibold">Applied to Vercel (Frontend Engineer)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-xs text-foreground font-semibold">Applied to Stripe (Software Engineer)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span className="text-xs text-foreground font-semibold">Applied to Linear (Product Engineer)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-primary/40 animate-pulse shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">Auto-applying to Airbnb...</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Live Logs Quick Snapshot */}
        <Card className="p-6 bg-card/60 border-border/80 lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-foreground">Live Recruiter Feed</h3>
          <div className="space-y-3 font-mono text-xs overflow-y-auto max-h-48 pr-2">
            {timelineLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No events logged yet.</p>
            ) : (
              timelineLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-2 rounded bg-black/5 dark:bg-black/20 border border-border/40">
                  <span className="text-muted-foreground font-semibold shrink-0">{log.time}</span>
                  <span className={`shrink-0 font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    log.type === "success" ? "bg-green-500/10 text-green-500" :
                    log.type === "error" ? "bg-red-500/10 text-red-500" :
                    log.type === "warning" ? "bg-amber-500/10 text-amber-500" :
                    log.type === "thinking" ? "bg-purple-500/10 text-purple-500" :
                    "bg-blue-500/10 text-blue-500"
                  }`}>
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-foreground/90 font-medium break-all">{log.text}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
