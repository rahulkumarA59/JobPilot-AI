import { useState } from "react";
import { Card } from "@/components/ui/card";
import { mockCareerPath } from "../mock/careerCoachData";
import { Brain, Target, Flame, Lightbulb, Zap, ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SkillGapAnalysis() {
  const [selectedSkill, setSelectedSkill] = useState<number | null>(0);

  const missingSkills = [
    { name: "Distributed Systems", priority: "High", difficulty: "Advanced", time: "4 Weeks", aiExplain: "Crucial for passing the System Design round at your target companies." },
    { name: "Advanced React Patterns", priority: "High", difficulty: "Intermediate", time: "2 Weeks", aiExplain: "Needed to demonstrate Senior-level frontend competency in tech interviews." },
    { name: "GraphQL & Apollo", priority: "Medium", difficulty: "Intermediate", time: "1.5 Weeks", aiExplain: "Commonly used in modern backend pipelines; good to have for Full Stack roles." },
    { name: "Redis Caching", priority: "Medium", difficulty: "Beginner", time: "1 Week", aiExplain: "Fundamental for reducing database load in high-traffic applications." },
    { name: "Kafka Event Streaming", priority: "Low", difficulty: "Advanced", time: "3 Weeks", aiExplain: "Excellent bonus skill, but rarely an absolute requirement for SDE-2 unless specialized." },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Skill Gap Analysis
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Identifying knowledge gaps between your current skill set and the requirements for {mockCareerPath.role} ({mockCareerPath.nextLevel}).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Current vs Target */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Current Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "Express", "TypeScript", "PostgreSQL", "REST APIs"].map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Target Requirements
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockCareerPath.requiredSkills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Missing Skills */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-rose-500" />
            Missing Skills & Priorities
          </h3>
          
          <div className="space-y-3">
            {missingSkills.map((skill, idx) => (
              <Card 
                key={idx} 
                className={`p-4 border-border transition-all cursor-pointer ${selectedSkill === idx ? 'bg-primary/5 border-primary/30' : 'bg-card/40 hover:bg-card/80'}`}
                onClick={() => setSelectedSkill(idx === selectedSkill ? null : idx)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      {skill.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        skill.priority === "High" ? "bg-rose-500/10 text-rose-500" :
                        skill.priority === "Medium" ? "bg-amber-500/10 text-amber-500" :
                        "bg-blue-500/10 text-blue-500"
                      }`}>
                        {skill.priority} Priority
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {skill.difficulty}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {skill.time}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 hidden sm:block text-muted-foreground">
                    <ArrowRight className={`h-4 w-4 transition-transform ${selectedSkill === idx ? "rotate-90 text-primary" : ""}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {selectedSkill === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex gap-3">
                        <Lightbulb className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">AI Explanation</h5>
                          <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                            {skill.aiExplain}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
