import { Card } from "@/components/ui/card";
import { useCareerCoachStore } from "../store/careerCoachStore";
import { mockCareerPath, mockDailyMission, mockCompanyReadiness } from "../mock/careerCoachData";
import {
  TrendingUp, Target, Award, BrainCircuit, Activity,
  CalendarDays, Zap, ArrowUpRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from "recharts";
import { Progress } from "@/components/ui/progress";

export function CareerDashboard() {
  const { setActiveTab, xp } = useCareerCoachStore();

  const chartData = [
    { day: "Mon", hours: 2, xp: 120 },
    { day: "Tue", hours: 4, xp: 250 },
    { day: "Wed", hours: 3, xp: 180 },
    { day: "Thu", hours: 5, xp: 300 },
    { day: "Fri", hours: 2, xp: 100 },
    { day: "Sat", hours: 8, xp: 500 },
    { day: "Sun", hours: 6, xp: 400 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Profile Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Career Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tracking your trajectory towards {mockCareerPath.role} ({mockCareerPath.nextLevel}).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total XP</p>
            <p className="text-lg font-black text-amber-500">{xp.toLocaleString()}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500/20" />
          </div>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Award className="h-4 w-4 text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Current Level</span>
          </div>
          <h4 className="text-2xl font-black text-foreground">{mockCareerPath.currentLevel}</h4>
          <p className="text-xs text-muted-foreground mt-1">Target: <span className="font-bold text-blue-500">{mockCareerPath.nextLevel}</span></p>
        </Card>

        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Target Salary</span>
          </div>
          <h4 className="text-2xl font-black text-foreground">{mockCareerPath.expectedSalary.split(" - ")[0]}<span className="text-sm font-semibold text-muted-foreground">+</span></h4>
          <p className="text-xs text-muted-foreground mt-1">Expected upon promotion</p>
        </Card>

        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Career Score</span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-black text-foreground">78</h4>
            <span className="text-sm font-bold text-muted-foreground mb-1">/ 100</span>
          </div>
          <div className="mt-3">
            <Progress value={78} className="h-1.5" />
          </div>
        </Card>

        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <BrainCircuit className="h-4 w-4 text-violet-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Interview Readiness</span>
          </div>
          <h4 className="text-2xl font-black text-foreground">65%</h4>
          <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" />
            +5% this week
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Mission */}
        <Card className="p-6 border-border bg-gradient-to-br from-indigo-500/5 via-card to-card backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-5 w-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-foreground">Today's Mission</h3>
            </div>
            <p className="text-base font-medium text-foreground/90 leading-relaxed">
              {mockDailyMission.todayGoal}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">{mockDailyMission.completionPercent}%</span>
              </div>
              <Progress value={mockDailyMission.completionPercent} className="h-2" />
            </div>
          </div>
          <button
            onClick={() => setActiveTab("planner")}
            className="mt-6 w-full py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-colors"
          >
            View Weekly Planner
          </button>
        </Card>

        {/* Weekly Progress Chart */}
        <Card className="lg:col-span-2 p-6 border-border bg-card/60 backdrop-blur-sm h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-foreground">Learning Velocity (This Week)</h3>
            <span className="text-xs font-bold text-muted-foreground">30 Hrs Total</span>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.4} vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}
                  formatter={(value: any, name: any) => [
                    name === "hours" ? `${value} hrs` : `${value} XP`, 
                    name === "hours" ? "Learning" : "Experience"
                  ]}
                />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Target Companies Overview */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground">Target Company Readiness</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockCompanyReadiness.map((company) => (
            <Card key={company.companyName} className="p-4 border-border bg-card/60 backdrop-blur-sm group hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setActiveTab("company-prep")}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-white p-1 border border-border">
                    <img src={company.logo} alt={company.companyName} className="h-full w-full object-contain" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{company.companyName}</h4>
                </div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black ${
                  company.overallScore >= 80 ? "bg-emerald-500/10 text-emerald-500" :
                  company.overallScore >= 70 ? "bg-amber-500/10 text-amber-500" :
                  "bg-rose-500/10 text-rose-500"
                }`}>
                  {company.overallScore}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                  <span>DSA Readiness</span>
                  <span className={company.dsaReadiness > 80 ? "text-emerald-500" : "text-amber-500"}>{company.dsaReadiness}%</span>
                </div>
                <Progress value={company.dsaReadiness} className="h-1" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
