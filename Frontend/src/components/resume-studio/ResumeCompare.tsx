import { motion } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GitCompareArrows, ArrowLeftRight, CheckCircle2, XCircle, TrendingUp, Minus } from "lucide-react";

export default function ResumeCompare() {
  const { versions, compareVersions, setCompareVersions } = useResumeStudioStore();

  const versionA = versions.find((v) => v.id === compareVersions.a);
  const versionB = versions.find((v) => v.id === compareVersions.b);

  const differences = [
    { section: "Summary", status: "improved" as const, detail: "Added 3 action verbs and quantified impact metrics" },
    { section: "Experience — Vercel", status: "improved" as const, detail: "Added role at Vercel with 4 detailed bullet points" },
    { section: "Experience — Stripe", status: "modified" as const, detail: "Refined bullet points with specific revenue numbers" },
    { section: "Skills", status: "improved" as const, detail: "Added 4 new skills: Framer Motion, Zustand, Docker, CI/CD" },
    { section: "Certifications", status: "added" as const, detail: "Added AWS Solutions Architect and GCP certifications" },
    { section: "Projects", status: "improved" as const, detail: "Added AutoHire AI and DesignFlow Studio projects" },
    { section: "Languages", status: "unchanged" as const, detail: "No changes detected" },
    { section: "References", status: "modified" as const, detail: "Updated contact information for both references" },
  ];

  const getStatusIcon = (status: string) => {
    if (status === "improved") return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
    if (status === "added") return <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />;
    if (status === "modified") return <ArrowLeftRight className="h-3.5 w-3.5 text-amber-500" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "improved") return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    if (status === "added") return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    if (status === "modified") return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Resume Compare</h2>
        <p className="text-sm text-muted-foreground mt-1">Side-by-side comparison of resume versions with highlighted differences.</p>
      </div>

      {/* Version Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <Card className="p-4">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Version A</label>
          <select
            value={compareVersions.a}
            onChange={(e) => setCompareVersions(e.target.value, compareVersions.b)}
            className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          {versionA && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground font-semibold">ATS:</span>
              <Progress value={versionA.atsScore} className="h-1.5 flex-1" />
              <span className="text-xs font-extrabold text-foreground">{versionA.atsScore}%</span>
            </div>
          )}
        </Card>

        <div className="flex items-center justify-center">
          <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
            <GitCompareArrows className="h-5 w-5 text-primary" />
          </div>
        </div>

        <Card className="p-4">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Version B</label>
          <select
            value={compareVersions.b}
            onChange={(e) => setCompareVersions(compareVersions.a, e.target.value)}
            className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          {versionB && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground font-semibold">ATS:</span>
              <Progress value={versionB.atsScore} className="h-1.5 flex-1" />
              <span className="text-xs font-extrabold text-foreground">{versionB.atsScore}%</span>
            </div>
          )}
        </Card>
      </div>

      {/* Score Comparison */}
      {versionA && versionB && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="p-6">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Score Improvement
            </h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-extrabold text-foreground">{versionA.atsScore}%</p>
                <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Version A</p>
              </div>
              <div>
                <p className={`text-3xl font-extrabold ${versionB.atsScore > versionA.atsScore ? "text-green-500" : "text-amber-500"}`}>
                  {versionB.atsScore > versionA.atsScore ? "+" : ""}{versionB.atsScore - versionA.atsScore}%
                </p>
                <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Difference</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground">{versionB.atsScore}%</p>
                <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Version B</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Differences Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Section-by-Section Differences</h3>
        </div>
        <div className="divide-y divide-border">
          {differences.map((diff, i) => (
            <motion.div
              key={diff.section}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getStatusIcon(diff.status)}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{diff.section}</p>
                  <p className="text-xs text-muted-foreground truncate">{diff.detail}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border shrink-0 ${getStatusColor(diff.status)}`}>
                {diff.status.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
