import { motion } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Sparkles, Target, BookOpen, ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Tooltip
} from "recharts";

const radarData = [
  { subject: "Frontend", You: 98, Industry: 75 },
  { subject: "Backend", You: 72, Industry: 70 },
  { subject: "DevOps", You: 55, Industry: 60 },
  { subject: "Design", You: 85, Industry: 50 },
  { subject: "Testing", You: 65, Industry: 65 },
  { subject: "AI/ML", You: 60, Industry: 55 },
  { subject: "Leadership", You: 70, Industry: 68 },
];

const trendingSkills = [
  { name: "Rust", growth: "+340%", demand: "High", category: "Systems" },
  { name: "AI Agents", growth: "+280%", demand: "Very High", category: "AI" },
  { name: "WebAssembly", growth: "+190%", demand: "Medium", category: "Frontend" },
  { name: "Edge Computing", growth: "+165%", demand: "High", category: "Infrastructure" },
  { name: "RAG Systems", growth: "+420%", demand: "Very High", category: "AI" },
];

const recommendedSkills = [
  { name: "GraphQL Federation", reason: "Required by 72% of target roles", priority: "high" as const, estimatedTime: "2 weeks" },
  { name: "Kubernetes", reason: "Senior-level DevOps requirement growing 45% YoY", priority: "high" as const, estimatedTime: "4 weeks" },
  { name: "LangChain / AI SDKs", reason: "AI integration expected in 80% of product engineer roles", priority: "medium" as const, estimatedTime: "3 weeks" },
  { name: "Playwright E2E", reason: "Testing framework adoption up 200% in frontend roles", priority: "medium" as const, estimatedTime: "1 week" },
  { name: "Terraform", reason: "Infrastructure-as-code increasingly expected at staff level", priority: "low" as const, estimatedTime: "3 weeks" },
];

export default function SkillIntelligence() {
  const { resume } = useResumeStudioStore();

  const categories = Array.from(new Set(resume.skills.map((s) => s.category)));
  const avgLevel = Math.round(resume.skills.reduce((sum, s) => sum + s.level, 0) / resume.skills.length);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Skill Intelligence</h2>
        <p className="text-sm text-muted-foreground mt-1">AI-powered skill analysis with industry benchmarks and learning recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <Card className="p-6 lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              Skill Distribution vs Industry
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> You</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-400" /> Industry Avg</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} stroke="hsl(var(--border))" />
                <Radar name="You" dataKey="You" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Industry" dataKey="Industry" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.15} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "11px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6 lg:col-span-5">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            Category Breakdown
          </h3>
          <div className="space-y-4">
            {categories.map((cat) => {
              const catSkills = resume.skills.filter((s) => s.category === cat);
              const catAvg = Math.round(catSkills.reduce((sum, s) => sum + s.level, 0) / catSkills.length);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-foreground">{cat}</span>
                    <span className="text-xs font-extrabold text-primary">{catAvg}%</span>
                  </div>
                  <Progress value={catAvg} className="h-2" />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {catSkills.map((s) => (
                      <span key={s.id} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">{s.name}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">Overall Skill Level</span>
              <span className="text-lg font-extrabold text-foreground">{avgLevel}%</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Skills */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <h3 className="text-sm font-bold text-foreground">Trending Skills in 2025</h3>
          </div>
          <div className="space-y-3">
            {trendingSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground">{skill.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-bold">{skill.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-green-500 flex items-center gap-0.5">
                    <ArrowUpRight className="h-3 w-3" />
                    {skill.growth}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold border ${
                    skill.demand === "Very High" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }`}>
                    {skill.demand}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recommended Learning */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="h-4 w-4 text-violet-500" />
            <h3 className="text-sm font-bold text-foreground">Recommended Learning Path</h3>
          </div>
          <div className="space-y-3">
            {recommendedSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-3 rounded-xl border border-border hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-foreground">{skill.name}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold border ${
                    skill.priority === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    skill.priority === "medium" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                    "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }`}>
                    {skill.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{skill.reason}</p>
                <p className="text-[10px] text-primary font-bold mt-1">Est. learning time: {skill.estimatedTime}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
