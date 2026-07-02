import { motion } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FileText, TrendingUp, Shield, Target, AlertTriangle,
  Download, Briefcase, Sparkles, ArrowUpRight, CheckCircle2,
  Clock, Eye, BarChart3, Zap
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function StudioDashboard() {
  const { resume, versions } = useResumeStudioStore();
  const activeVersion = versions.find((v) => v.isActive);
  const atsScore = activeVersion?.atsScore ?? 94;
  const skillCount = resume.skills.length;
  const expCount = resume.experience.length;

  const metrics = [
    {
      label: "ATS Score",
      value: `${atsScore}%`,
      change: "+8% this month",
      icon: Shield,
      color: "text-green-500",
      bg: "bg-green-500/10",
      progress: atsScore,
    },
    {
      label: "Profile Completion",
      value: "96%",
      change: "2 sections remaining",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      progress: 96,
    },
    {
      label: "Resume Strength",
      value: "A+",
      change: "Top 5% of applicants",
      icon: Zap,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      progress: 95,
    },
    {
      label: "Resume Health",
      value: "Excellent",
      change: "All checks passed",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      progress: 98,
    },
  ];

  const stats = [
    { label: "Version Count", value: versions.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Downloads", value: 142, icon: Download, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Applications Using Resume", value: 38, icon: Briefcase, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Profile Views", value: 1247, icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  const weaknesses = [
    { text: "Add 2 more quantified impact metrics to experience bullets", severity: "medium" as const },
    { text: "Include Docker and CI/CD keywords for DevOps-related roles", severity: "low" as const },
    { text: "Consider adding a personal portfolio link to projects", severity: "low" as const },
  ];

  const improvements = [
    { text: "Added AWS certification — ATS match improved by 6%", time: "2 days ago", positive: true },
    { text: "Optimized summary with action verbs — readability score +12%", time: "5 days ago", positive: true },
    { text: "Added Vercel experience — matched 14 new job listings", time: "1 week ago", positive: true },
    { text: "Updated skills section — now matches 94% of target roles", time: "2 weeks ago", positive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Resume Studio Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your resume health at a glance. Last updated {activeVersion ? new Date(activeVersion.updatedAt).toLocaleDateString() : "today"}.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-foreground">AI-Powered Analysis</span>
          </div>
        </div>
      </motion.div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Card className="p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-blue-500/[0.02] group-hover:to-violet-500/[0.02] transition-all" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  <p className="text-3xl font-extrabold text-foreground mt-1 tracking-tight">{m.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${m.bg}`}>
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                </div>
              </div>
              <Progress value={m.progress} className="h-1.5 mb-2" />
              <p className={`text-xs font-semibold ${m.color} flex items-center gap-1`}>
                <ArrowUpRight className="h-3 w-3" />
                {m.change}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
          >
            <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-2.5 rounded-xl ${s.bg} shrink-0`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">{s.value}</p>
                <p className="text-[11px] text-muted-foreground font-semibold">{s.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weaknesses */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <Card className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-foreground">Areas for Improvement</h3>
            </div>
            <div className="space-y-3">
              {weaknesses.map((w, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors hover:bg-accent/30 ${
                    w.severity === "medium"
                      ? "border-amber-500/20 bg-amber-500/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                    w.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <p className="text-xs font-medium text-foreground/90 leading-relaxed">{w.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Improvements */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <Card className="p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-bold text-foreground">Recent Improvements</h3>
            </div>
            <div className="space-y-3">
              {improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-green-500/10 bg-green-500/[0.03] hover:bg-green-500/[0.06] transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground/90 leading-relaxed">{imp.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {imp.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
