import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import { Flame, AlertTriangle, XCircle, Check, Plus } from "lucide-react";
import { toast } from "sonner";

const heatmapData = {
  strong: [
    { keyword: "React", count: 8, context: "Mentioned across experience, projects, and skills sections" },
    { keyword: "TypeScript", count: 6, context: "Core language in all recent positions and projects" },
    { keyword: "frontend", count: 5, context: "Primary role identifier throughout the resume" },
    { keyword: "performance", count: 4, context: "Quantified improvements in multiple bullet points" },
    { keyword: "design system", count: 3, context: "Built and maintained component libraries" },
    { keyword: "scalable", count: 3, context: "Architecture-level contributions at Vercel and Stripe" },
    { keyword: "Next.js", count: 4, context: "Framework expertise in experience and projects" },
    { keyword: "component", count: 5, context: "UI component development across all roles" },
  ],
  weak: [
    { keyword: "leadership", count: 1, context: "Only mentioned once in mentoring context" },
    { keyword: "agile", count: 0, context: "Not explicitly mentioned — add to methodology section" },
    { keyword: "testing", count: 1, context: "Jest listed in skills but no testing achievements" },
    { keyword: "cross-functional", count: 0, context: "Missing — important for senior roles" },
    { keyword: "stakeholder", count: 0, context: "No mention of stakeholder management" },
  ],
  missing: [
    { keyword: "GraphQL", context: "High-demand skill not present in resume", category: "Backend" },
    { keyword: "Kubernetes", context: "Container orchestration increasingly required for senior roles", category: "DevOps" },
    { keyword: "mentoring", context: "Leadership indicator missing despite senior title", category: "Soft Skills" },
    { keyword: "revenue impact", context: "Financial impact metrics strengthen business cases", category: "Soft Skills" },
    { keyword: "accessibility", context: "A11y compliance increasingly required in job descriptions", category: "Frontend" },
    { keyword: "CI/CD pipelines", context: "DevOps competency expected at senior level", category: "DevOps" },
  ],
};

export default function KeywordHeatmap() {
  const { addSkill, resume } = useResumeStudioStore();
  const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set());

  const handleAddKeyword = (keyword: string, category: string) => {
    const existingSkill = resume.skills.find(
      (s) => s.name.toLowerCase() === keyword.toLowerCase()
    );
    if (existingSkill) {
      toast.info(`"${keyword}" already exists in your skills.`);
      setAddedKeywords((prev) => new Set(prev).add(keyword));
      return;
    }

    addSkill({
      id: `skill-kw-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: keyword,
      level: 60,
      category,
    });
    setAddedKeywords((prev) => new Set(prev).add(keyword));
    toast.success(`Added "${keyword}" to your skills section.`, {
      description: `Category: ${category}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Keyword Heatmap</h2>
        <p className="text-sm text-muted-foreground mt-1">Visual analysis of keyword frequency and ATS impact across your resume.</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-bold">
          <div className="h-3 w-3 rounded-sm bg-green-500" />
          <span className="text-muted-foreground">Strong (3+ mentions)</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <div className="h-3 w-3 rounded-sm bg-amber-500" />
          <span className="text-muted-foreground">Weak (0-1 mentions)</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <div className="h-3 w-3 rounded-sm bg-red-500" />
          <span className="text-muted-foreground">Missing</span>
        </div>
      </div>

      {/* Added Keywords Summary */}
      <AnimatePresence>
        {addedKeywords.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/[0.06] border border-green-500/20">
              <Check className="h-4 w-4 text-green-500 shrink-0" />
              <p className="text-xs font-medium text-foreground/80">
                <span className="font-bold text-green-600 dark:text-green-400">{addedKeywords.size} keyword{addedKeywords.size > 1 ? "s" : ""} added</span>
                {" — "}Check the Resume Builder → Skills section to review and adjust proficiency levels.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strong Keywords */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Flame className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-bold text-foreground">Strong Keywords ({heatmapData.strong.length})</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {heatmapData.strong.map((kw, i) => {
            const intensity = Math.min(kw.count / 8, 1);
            return (
              <motion.div
                key={kw.keyword}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-green-500/15 hover:bg-green-500/[0.04] transition-colors"
              >
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                  style={{ backgroundColor: `rgba(34, 197, 94, ${0.3 + intensity * 0.7})` }}
                >
                  {kw.count}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">{kw.keyword}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{kw.context}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Weak Keywords */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold text-foreground">Weak Keywords ({heatmapData.weak.length})</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {heatmapData.weak.map((kw, i) => (
            <motion.div
              key={kw.keyword}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-amber-500/15 hover:bg-amber-500/[0.04] transition-colors"
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-extrabold shrink-0 bg-amber-500/60">
                {kw.count}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">{kw.keyword}</p>
                <p className="text-[10px] text-muted-foreground truncate">{kw.context}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Missing Keywords */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <XCircle className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-bold text-foreground">Missing Keywords ({heatmapData.missing.length})</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {heatmapData.missing.map((kw, i) => {
              const isAdded = addedKeywords.has(kw.keyword);
              return (
                <motion.div
                  key={kw.keyword}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    isAdded
                      ? "border-green-500/20 bg-green-500/[0.03]"
                      : "border-red-500/15 hover:bg-red-500/[0.04]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">{kw.keyword}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{kw.context}</p>
                  </div>
                  {isAdded ? (
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 shrink-0">
                      <Check className="h-3 w-3" />
                      Added
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddKeyword(kw.keyword, kw.category)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
