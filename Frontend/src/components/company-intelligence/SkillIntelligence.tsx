import { useMemo } from "react";
import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import {
  Code2, Flame, Brain, Target, AlertCircle, XCircle
} from "lucide-react";

export default function SkillIntelligence() {
  const { selectedCompanyId } = useCompanyIntelligenceStore();

  const company = useMemo(() => {
    return mockCompanies.find((c) => c.id === selectedCompanyId) || mockCompanies[0];
  }, [selectedCompanyId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Skill Intelligence</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analyze required tech stacks, identify personal skill gaps, and view AI learning recommendations for {company.name}.
        </p>
      </div>

      {/* Grid Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold text-foreground">Core Required Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {company.requiredSkills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                {skill}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            These represent the baseline technical capabilities expected across 80% of software engineering positions at the company.
          </p>
        </Card>

        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-4 w-4 text-orange-500" />
            <h3 className="text-sm font-bold text-foreground">Trending Technologies</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {company.trendingSkills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
                {skill}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Technologies seeing a rapid surge in job descriptions over the last 90 days. Mentioning these boosts ATS matching scores.
          </p>
        </Card>
      </div>

      {/* AI Recommendations Row */}
      <Card className="p-6 border-border bg-gradient-to-r from-primary/10 via-violet-900/10 to-card backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1.5">AI Skill Strategy</h3>
            <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-medium">
              {company.aiSkillRecommendation}
            </p>
          </div>
        </div>
      </Card>

      {/* Grid Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-foreground">Learning Priorities</h3>
          </div>
          <div className="space-y-3">
            {company.learningPriority.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/40">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${item.priority === "High" ? "bg-rose-500" : item.priority === "Medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{item.skill}</h4>
                    <span className="text-[10px] text-muted-foreground font-semibold">{item.priority} Priority</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded bg-card border border-border text-[10px] font-bold text-muted-foreground">
                  Est. {item.estTime}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-500" />
              <h3 className="text-sm font-bold text-foreground">Missing From Your Profile</h3>
            </div>
          </div>
          <div className="space-y-3">
            {company.missingSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-rose-500/10 bg-rose-500/[0.02]">
                <div className="flex items-center gap-2">
                  <XCircle className="h-3.5 w-3.5 text-rose-500/70" />
                  <span className="text-xs font-bold text-foreground">{skill}</span>
                </div>
                <button className="text-[10px] font-bold text-primary hover:underline">
                  + Add to Resume
                </button>
              </div>
            ))}
            {company.missingSkills.length === 0 && (
              <div className="text-center py-6">
                <p className="text-xs text-muted-foreground">Your profile covers all core requirements!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
