import { useState, useMemo } from "react";
import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import {
  Compass, ChevronDown, BookOpen, Clock, AlertTriangle, Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewIntelligence() {
  const { selectedCompanyId } = useCompanyIntelligenceStore();

  const company = useMemo(() => {
    return mockCompanies.find((c) => c.id === selectedCompanyId) || mockCompanies[0];
  }, [selectedCompanyId]);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Interview Intelligence</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Master the hiring loop at {company.name} with stage breakdowns, FAQs, and AI prep tips.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stages & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                Interview Pipeline Stages
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase text-muted-foreground">Difficulty:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  company.interviewDifficulty === "Very Hard" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                  company.interviewDifficulty === "Hard" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                  "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                }`}>
                  {company.interviewDifficulty}
                </span>
              </div>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-border">
              {company.interviewStages.map((stage, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[30px] top-1 h-[14px] w-[14px] rounded-full bg-primary ring-4 ring-card flex items-center justify-center shadow-glow">
                    <div className="h-1.5 w-1.5 bg-background rounded-full" />
                  </div>
                  <div className="p-4 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-foreground">{stage.name}</h4>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-card px-2 py-1 rounded border border-border">
                        <Clock className="h-3 w-3" /> {stage.duration}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/70 leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {company.interviewFAQs.map((faq, idx) => (
                <div key={idx} className="border border-border/60 rounded-xl overflow-hidden bg-muted/20">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
                  >
                    <span className="text-sm font-bold text-foreground pr-4">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${expandedFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Tips & Timeline */}
        <div className="space-y-6">
          <Card className="p-6 border-border bg-gradient-to-br from-indigo-500/10 via-card to-card backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-foreground">AI Prep Tips</h3>
            </div>
            <ul className="space-y-3">
              {company.prepTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span className="text-xs text-foreground/80 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">Candidate Timeline</h3>
            </div>
            <div className="space-y-3">
              {company.experienceTimeline.map((phase, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-xs font-semibold text-foreground/80">{phase.phase}</span>
                  <span className="text-[10px] font-extrabold text-primary">{phase.duration}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-600/90 font-medium leading-relaxed">
                Timelines are estimated and can vary significantly during holidays or internal re-orgs.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
