import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Sparkles, CheckCircle2, AlertTriangle, HelpCircle,
  TrendingUp, RefreshCw, BarChart2
} from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from "recharts";

const skillsData = [
  { subject: "React / Next.js", Profile: 98, Market: 80 },
  { subject: "TypeScript", Profile: 95, Market: 75 },
  { subject: "State (Zustand/Redux)", Profile: 92, Market: 70 },
  { subject: "CSS / Tailwind", Profile: 96, Market: 85 },
  { subject: "Testing (Jest/Cypress)", Profile: 72, Market: 65 },
  { subject: "System Design", Profile: 85, Market: 78 },
  { subject: "AI APIs / Prompts", Profile: 88, Market: 55 }
];

const barData = [
  { name: "Frontend Eng.", Score: 98 },
  { name: "Product Eng.", Score: 92 },
  { name: "AI Web Eng.", Score: 96 },
  { name: "Staff UI Eng.", Score: 88 },
  { name: "Fullstack Eng.", Score: 78 }
];

export default function ResumeIntelligence() {
  return (
    <div className="space-y-6">
      {/* Top Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score health */}
        <Card className="p-6 bg-card/60 border-border/80 lg:col-span-1 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <FileText className="h-40 w-40" />
          </div>
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resume Health Score</span>
              <Sparkles className="h-4 w-4 text-violet-500" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-foreground tracking-tight">96</span>
              <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Profile completeness</span>
                <span className="text-green-500">Excellent</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 mt-4 text-xs text-muted-foreground space-y-2 relative z-10 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Resume matches 18 core competencies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Contact nodes & hyperlinks parsed</span>
            </div>
          </div>
        </Card>

        {/* ATS match predictions */}
        <Card className="p-6 bg-card/60 border-border/80 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-foreground">ATS Target Match Predictions</h3>
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" /> Matches optimized
            </span>
          </div>

          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: "11px" }}
                  itemStyle={{ color: "#c084fc", fontSize: "11px" }}
                />
                <Bar dataKey="Score" fill="url(#colorScore)" radius={[4, 4, 0, 0]}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 2: Radar Chart + Skills Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Map */}
        <Card className="p-6 bg-card/60 border-border/80 lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-foreground">Core Skills Distribution</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Profile</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-400" /> Market Avg</span>
            </div>
          </div>

          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} fontWeight="bold" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={9} />
                <Radar name="My Skills" dataKey="Profile" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                <Radar name="Market Average" dataKey="Market" stroke="#c084fc" fill="#c084fc" fillOpacity={0.15} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "11px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Skills Audit details */}
        <Card className="p-6 bg-card/60 border-border/80 lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground">ATS Skills Audit</h3>

            <div className="space-y-3.5">
              {/* Category 1: Strong */}
              <div className="space-y-2">
                <span className="text-[10px] text-green-500 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Strong Keywords Matches
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion"].map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/15">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category 2: Needs improvement */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" /> Moderate Keywords Matches
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["GraphQL", "Jest", "Cypress", "System Architecture"].map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category 3: Missing */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Missing Keywords / Gap
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Docker", "CI/CD Actions", "Kubernetes", "Rust (tooling)"].map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/15">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/20 text-primary font-bold text-xs hover:bg-primary/5 transition">
            <RefreshCw className="h-3.5 w-3.5" />
            Recalculate Resume Scores
          </button>
        </Card>
      </div>
    </div>
  );
}
