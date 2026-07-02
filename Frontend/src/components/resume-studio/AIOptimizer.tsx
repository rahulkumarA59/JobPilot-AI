import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, CheckCircle2, XCircle, AlertTriangle, Target, Brain,
  ArrowRight, TrendingUp, FileText, Clipboard, Zap
} from "lucide-react";

const mockAnalysis = {
  matchPercentage: 87,
  atsScore: 92,
  matchedSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST APIs", "Git", "Agile", "CI/CD"],
  missingSkills: ["GraphQL", "Kubernetes", "Terraform", "Go"],
  strongKeywords: ["frontend", "performance", "scalable", "TypeScript", "React", "components", "design system", "testing"],
  weakKeywords: ["leadership", "mentoring", "cross-functional", "stakeholder"],
  recommendations: [
    { title: "Add GraphQL experience", description: "The job requires GraphQL API integration. Highlight any REST-to-GraphQL migration experience you have.", priority: "high" as const },
    { title: "Emphasize leadership skills", description: "The role involves leading a team of 4-6 engineers. Add specific mentorship and team-leading examples.", priority: "high" as const },
    { title: "Include Kubernetes keywords", description: "Container orchestration is mentioned. Reference any Docker/K8s deployment experience in your projects.", priority: "medium" as const },
    { title: "Quantify more achievements", description: "Add specific metrics like '40% performance improvement' or 'served 2M+ users' to strengthen impact.", priority: "medium" as const },
    { title: "Add stakeholder communication", description: "Mention experience presenting to non-technical stakeholders or writing technical documentation.", priority: "low" as const },
  ],
};

export default function AIOptimizer() {
  const { jobDescription, setJobDescription } = useResumeStudioStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const getPriorityColor = (p: string) => {
    if (p === "high") return "bg-red-500/10 text-red-500 border-red-500/20";
    if (p === "medium") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">AI Resume Optimizer</h2>
        <p className="text-sm text-muted-foreground mt-1">Paste a job description and let AI analyze your resume match.</p>
      </div>

      {/* Job Description Input */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clipboard className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Job Description</h3>
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here for AI analysis..."
          rows={6}
          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all placeholder:text-muted-foreground/60"
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            {jobDescription.length > 0 ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : "Paste a job posting to begin"}
          </p>
          <button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || isAnalyzing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow"
          >
            {isAnalyzing ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Analyze Match
              </>
            )}
          </button>
        </div>
      </Card>

      {/* Analysis Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.04] to-emerald-500/[0.04] pointer-events-none" />
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resume Match</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-foreground tracking-tight">{mockAnalysis.matchPercentage}%</span>
                  <span className="text-sm text-green-500 font-bold">Strong</span>
                </div>
                <Progress value={mockAnalysis.matchPercentage} className="h-2 mt-4" />
              </Card>
              <Card className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-violet-500/[0.04] pointer-events-none" />
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ATS Prediction</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-foreground tracking-tight">{mockAnalysis.atsScore}%</span>
                  <span className="text-sm text-blue-500 font-bold">Excellent</span>
                </div>
                <Progress value={mockAnalysis.atsScore} className="h-2 mt-4" />
              </Card>
            </div>

            {/* Skills Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <h3 className="text-sm font-bold text-foreground">Matched Skills ({mockAnalysis.matchedSkills.length})</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockAnalysis.matchedSkills.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                    >
                      ✓ {s}
                    </motion.span>
                  ))}
                </div>
              </Card>
              {/* Missing */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-bold text-foreground">Missing Skills ({mockAnalysis.missingSkills.length})</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockAnalysis.missingSkills.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                    >
                      ✗ {s}
                    </motion.span>
                  ))}
                </div>
              </Card>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-bold text-foreground">Strong Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockAnalysis.strongKeywords.map((k) => (
                    <span key={k} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">{k}</span>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-foreground">Weak Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mockAnalysis.weakKeywords.map((k) => (
                    <span key={k} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">{k}</span>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <h3 className="text-sm font-bold text-foreground">AI Recommendations</h3>
              </div>
              <div className="space-y-3">
                {mockAnalysis.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-border hover:bg-accent/30 transition-colors"
                  >
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border shrink-0 mt-0.5 ${getPriorityColor(rec.priority)}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 transition-colors shrink-0 flex items-center gap-1">
                      Apply <ArrowRight className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
