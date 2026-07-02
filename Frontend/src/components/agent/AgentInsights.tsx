import React from "react";
import { Card } from "@/components/ui/card";
import {
  TrendingUp, Award, Clock, Lightbulb, CheckCircle2, ChevronRight,
  Sparkles, Flame
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  AreaChart, Area, BarChart, Bar, Legend
} from "recharts";

const timelineData = [
  { day: "Mon", Applications: 3, Intersect: 92 },
  { day: "Tue", Applications: 5, Intersect: 94 },
  { day: "Wed", Applications: 4, Intersect: 93 },
  { day: "Thu", Applications: 6, Intersect: 96 },
  { day: "Fri", Applications: 5, Intersect: 95 },
  { day: "Sat", Applications: 2, Intersect: 94 },
  { day: "Sun", Applications: 3, Intersect: 95 }
];

const categoryData = [
  { name: "React/Next.js", Count: 14 },
  { name: "TypeScript", Count: 12 },
  { name: "Tailwind CSS", Count: 10 },
  { name: "Zustand/State", Count: 8 },
  { name: "Unit Testing", Count: 4 }
];

export default function AgentInsights() {
  return (
    <div className="space-y-6">
      {/* Top Widget Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <Card className="p-5 bg-card border-border/80 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Average Match Rank</span>
            <h4 className="text-2xl font-extrabold text-foreground tracking-tight mt-0.5">94.2%</h4>
          </div>
        </Card>

        {/* Card 2 */}
        <Card className="p-5 bg-card border-border/80 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Stripe / Vercel Velocity</span>
            <h4 className="text-2xl font-extrabold text-foreground tracking-tight mt-0.5">High</h4>
          </div>
        </Card>

        {/* Card 3 */}
        <Card className="p-5 bg-card border-border/80 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-semibold">ATS Approval Rate</span>
            <h4 className="text-2xl font-extrabold text-foreground tracking-tight mt-0.5">92.4%</h4>
          </div>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart: Applications per day */}
        <Card className="p-6 bg-card/60 border-border/80 lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-foreground">Applications Filed Trend</h3>
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" /> Weekly growth +15%
            </span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: "11px" }}
                  itemStyle={{ color: "#c084fc", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="Applications" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.15} fill="url(#colorApps)" />
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar Chart: Skill matching hits */}
        <Card className="p-6 bg-card/60 border-border/80 lg:col-span-4 space-y-4">
          <h3 className="text-base font-bold text-foreground">Matched Skills Hits</h3>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <XAxis type="number" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e1b4b", border: "none", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "11px", color: "#c084fc" }}
                />
                <Bar dataKey="Count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* AI Recommendation Alert Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">Actionable AI Insights</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <Card className="p-5 bg-card border-border/80 flex flex-col justify-between space-y-3 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-amber-500" />
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-xs">Resume keyword alignment gap</h4>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Stripe and Vercel listings list <b>Jest & Cypress</b>. Add testing achievements to bump match rates from 95% to 98%.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline self-end">
              Edit Resume <ChevronRight className="h-3 w-3" />
            </button>
          </Card>

          {/* Card 2 */}
          <Card className="p-5 bg-card border-border/80 flex flex-col justify-between space-y-3 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-violet-500" />
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500 shrink-0">
                <Flame className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-xs">High Hiring Momentum Alert</h4>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Supabase and Expo are actively hiring Senior UI engineers with NextJS capability. Fast-track queue priority enabled.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline self-end">
              View Discovered Roles <ChevronRight className="h-3 w-3" />
            </button>
          </Card>

          {/* Card 3 */}
          <Card className="p-5 bg-card border-border/80 flex flex-col justify-between space-y-3 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-green-500" />
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500 shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-xs">Hiring window optimizer</h4>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Submission data shows response rates peak for applications filed between 9:00 AM and 11:00 AM EST. Agent scheduling automated.
                </p>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold self-end flex items-center gap-1">
              ✓ Active Optimizer
            </span>
          </Card>
        </div>
      </div>
    </div>
  );
}
