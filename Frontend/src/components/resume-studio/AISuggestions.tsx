import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Sparkles, FileText, Briefcase, FolderOpen, Code2, Award,
  BookOpen, Eye, CheckCircle2, Wand2, RotateCcw, X
} from "lucide-react";
import { toast } from "sonner";

interface Suggestion {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  borderColor: string;
  currentText: string;
  improvedText: string;
  impact: string;
}

const suggestions: Suggestion[] = [
  {
    id: "s1",
    title: "Improve Professional Summary",
    category: "Summary",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    borderColor: "border-blue-500",
    currentText: "Passionate Senior Frontend Engineer with 5+ years of experience building high-performance web applications.",
    improvedText: "Results-driven Senior Frontend Engineer with 5+ years architecting high-performance web applications at scale. Expert in React ecosystem and modern TypeScript, with a proven track record of reducing load times by 35% and building design systems adopted by 60+ engineers across 4 product teams.",
    impact: "+12% ATS improvement",
  },
  {
    id: "s2",
    title: "Strengthen Experience Bullets",
    category: "Experience",
    icon: Briefcase,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    borderColor: "border-violet-500",
    currentText: "Led migration of legacy codebase to React Server Components",
    improvedText: "Spearheaded migration of 120K-line legacy codebase to React Server Components, improving SEO scores by 40% across 12 product pages and reducing Time-to-Interactive by 2.3 seconds on average",
    impact: "+8% keyword density",
  },
  {
    id: "s3",
    title: "Enhance Project Descriptions",
    category: "Projects",
    icon: FolderOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    borderColor: "border-emerald-500",
    currentText: "Enterprise job automation platform with AI-powered resume optimization",
    improvedText: "Full-stack enterprise SaaS platform automating job applications using browser sandboxing, real-time ATS scoring engine, and AI-powered resume optimization. Handles 10K+ automated applications monthly with 94% success rate.",
    impact: "+6% specificity score",
  },
  {
    id: "s4",
    title: "Optimize Skills Section",
    category: "Skills",
    icon: Code2,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    borderColor: "border-amber-500",
    currentText: "Current skills listed without context or proficiency indicators",
    improvedText: "Add skill categories (Frontend, Backend, DevOps, Tools) with proficiency bars. Include emerging skills like AI/ML APIs, WebAssembly, and Edge Computing to match trending job requirements.",
    impact: "+10% relevance match",
  },
  {
    id: "s5",
    title: "Add Achievement Metrics",
    category: "Achievements",
    icon: Award,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    borderColor: "border-rose-500",
    currentText: "Speaker — React Summit 2022",
    improvedText: "Delivered keynote 'Beyond Server Components: The Future of React Architecture' at React Summit 2022, reaching 3,000+ live attendees and generating 45K+ video views post-event",
    impact: "+5% credibility score",
  },
  {
    id: "s6",
    title: "Boost ATS Compatibility",
    category: "ATS",
    icon: Eye,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    borderColor: "border-cyan-500",
    currentText: "Resume uses some formatting that may not parse correctly in ATS systems",
    improvedText: "Restructure section headers to use standard ATS-recognized titles (e.g., 'Work Experience' instead of 'Professional Journey'). Remove special characters from bullet points. Ensure consistent date formatting (MMM YYYY).",
    impact: "+15% ATS parse rate",
  },
  {
    id: "s7",
    title: "Improve Readability Score",
    category: "Readability",
    icon: BookOpen,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    borderColor: "border-indigo-500",
    currentText: "Some bullets exceed recommended 2-line length and use passive voice",
    improvedText: "Shorten bullet points to 1-2 lines max. Replace passive constructions ('was responsible for') with active verbs ('architected', 'spearheaded', 'delivered'). Break complex achievements into separate, scannable points.",
    impact: "+18% readability",
  },
];

export default function AISuggestions() {
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleApply = (sug: Suggestion) => {
    setApplied((prev) => new Set(prev).add(sug.id));
    setDismissed((prev) => {
      const next = new Set(prev);
      next.delete(sug.id);
      return next;
    });
    toast.success(`Applied: ${sug.title}`, {
      description: sug.impact,
    });
  };

  const handleDismiss = (sug: Suggestion) => {
    setDismissed((prev) => new Set(prev).add(sug.id));
    toast(`Dismissed: ${sug.title}`, {
      action: {
        label: "Undo",
        onClick: () => handleUndoDismiss(sug.id),
      },
    });
  };

  const handleUndoDismiss = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleUndoApply = (id: string) => {
    setApplied((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const activeSuggestions = suggestions.filter((s) => !dismissed.has(s.id));
  const appliedCount = applied.size;
  const dismissedCount = dismissed.size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">AI Suggestions</h2>
          <p className="text-sm text-muted-foreground mt-1">Smart recommendations powered by GPT-4 analysis of your resume.</p>
        </div>
        <div className="flex items-center gap-3">
          {appliedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs font-bold text-green-600 dark:text-green-400">{appliedCount} applied</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20">
            <Wand2 className="h-4 w-4 text-violet-500" />
            <span className="text-xs font-bold text-foreground">{activeSuggestions.length} suggestions</span>
          </div>
        </div>
      </div>

      {/* Applied Summary Bar */}
      {appliedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-3 p-3 rounded-xl bg-green-500/[0.06] border border-green-500/20"
        >
          <Sparkles className="h-4 w-4 text-green-500 shrink-0" />
          <p className="text-xs font-medium text-foreground/80 flex-1">
            <span className="font-bold text-green-600 dark:text-green-400">{appliedCount} suggestion{appliedCount > 1 ? "s" : ""} applied</span>
            {" — "}Estimated ATS improvement: <span className="font-bold text-green-600 dark:text-green-400">
              +{suggestions.filter((s) => applied.has(s.id)).reduce((sum, s) => {
                const match = s.impact.match(/\+(\d+)/);
                return sum + (match ? parseInt(match[1]) : 0);
              }, 0)}% combined
            </span>
          </p>
        </motion.div>
      )}

      {/* Dismissed count with restore all */}
      {dismissedCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border"
        >
          <p className="text-xs text-muted-foreground font-medium">
            {dismissedCount} suggestion{dismissedCount > 1 ? "s" : ""} dismissed
          </p>
          <button
            onClick={() => setDismissed(new Set())}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Restore All
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {activeSuggestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="p-4 rounded-2xl bg-green-500/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">All Suggestions Handled!</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              You've reviewed all AI suggestions. Your resume is in great shape.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {activeSuggestions.map((sug, i) => {
              const isApplied = applied.has(sug.id);
              return (
                <motion.div
                  key={sug.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.25 } }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                >
                  <Card className={`p-6 overflow-hidden relative transition-all border-l-2 ${isApplied ? "border-green-500 bg-green-500/[0.02]" : sug.borderColor} hover:shadow-md`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl ${isApplied ? "bg-green-500/10" : sug.bg} shrink-0 transition-colors`}>
                        {isApplied ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <sug.icon className={`h-5 w-5 ${sug.color}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-foreground text-sm">{sug.title}</h3>
                            <span className="text-[10px] text-muted-foreground font-semibold">{sug.category}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border shrink-0 ${
                            isApplied
                              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                              : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                          }`}>
                            {sug.impact}
                          </span>
                        </div>

                        {/* Before / After */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 transition-opacity ${isApplied ? "opacity-60" : ""}`}>
                          <div className="p-3 rounded-xl bg-red-500/[0.04] border border-red-500/10">
                            <span className="text-[9px] font-extrabold text-red-500 uppercase tracking-wider">Current</span>
                            <p className="text-xs text-foreground/70 mt-1.5 leading-relaxed line-through decoration-red-300/40">{sug.currentText}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-green-500/[0.04] border border-green-500/10">
                            <span className="text-[9px] font-extrabold text-green-500 uppercase tracking-wider">Suggested</span>
                            <p className="text-xs text-foreground/90 mt-1.5 leading-relaxed font-medium">{sug.improvedText}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isApplied ? (
                            <>
                              <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold border border-green-500/20">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Applied
                              </span>
                              <button
                                onClick={() => handleUndoApply(sug.id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Undo
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApply(sug)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Apply Suggestion
                              </button>
                              <button
                                onClick={() => handleDismiss(sug)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                                Dismiss
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
