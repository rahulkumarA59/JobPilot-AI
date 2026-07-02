import { useMemo } from "react";
import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import {
  TrendingUp, Activity, Clock, Briefcase, Zap, CheckCircle2, Sparkles
} from "lucide-react";

export default function HiringIntelligence() {
  const { selectedCompanyId } = useCompanyIntelligenceStore();

  const company = useMemo(() => {
    return mockCompanies.find((c) => c.id === selectedCompanyId) || mockCompanies[0];
  }, [selectedCompanyId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Hiring Intelligence</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analyze hiring velocity, recent openings, and AI-predicted trends for {company.name}.
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="h-16 w-16 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold uppercase">Hiring Velocity</span>
          </div>
          <p className="text-3xl font-black text-foreground">{company.hiringVelocity}<span className="text-lg text-muted-foreground font-semibold">/100</span></p>
        </Card>

        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold uppercase">Avg Time to Hire</span>
          </div>
          <p className="text-3xl font-black text-foreground">{company.averageHiringTime}</p>
        </Card>

        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Briefcase className="h-4 w-4 text-green-500" />
            <span className="text-xs font-bold uppercase">Response Rate</span>
          </div>
          <p className="text-3xl font-black text-foreground">{company.responseRate}%</p>
        </Card>

        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <CheckCircle2 className="h-4 w-4 text-violet-500" />
            <span className="text-xs font-bold uppercase">Offer Acceptance</span>
          </div>
          <p className="text-3xl font-black text-foreground">{company.acceptanceRate}%</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Trend Line Chart */}
        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm flex flex-col h-[400px]">
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              12-Month Hiring Trend
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Number of open roles tracked over the past year.</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={company.hiringTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "var(--background)" }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.4} vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}
                  itemStyle={{ color: "var(--foreground)" }}
                  cursor={{ stroke: "#64748b", strokeWidth: 1, strokeDasharray: "3 3" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Departments Bar Chart */}
        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm flex flex-col h-[400px]">
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-bold text-foreground">Hiring by Department</h3>
            <p className="text-xs text-muted-foreground mt-1">Volume of open positions across key business units.</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={company.departmentsHiring} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.4} horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <RechartsTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {company.departmentsHiring.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#8b5cf6" : index === 1 ? "#3b82f6" : index === 2 ? "#10b981" : index === 3 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* AI Prediction & Recent Openings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Prediction Card */}
        <Card className="p-6 border-border bg-gradient-to-br from-primary/10 via-card to-card backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">AI Hiring Prediction</h3>
          </div>
          <p className="text-sm text-foreground/90 font-medium leading-relaxed italic">
            "{company.hiringPrediction}"
          </p>
          <div className="mt-6">
            <span className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-wider mb-2 block">Current Status</span>
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${
              company.hiringStatus === "Accelerated" ? "bg-green-500/10 text-green-500 border-green-500/20" :
              company.hiringStatus === "Active" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
              company.hiringStatus === "Selective" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
              "bg-slate-500/10 text-slate-500 border-slate-500/20"
            }`}>
              {company.hiringStatus.toUpperCase()}
            </div>
          </div>
        </Card>

        {/* Recent Openings List */}
        <Card className="lg:col-span-2 p-6 border-border bg-card/60 backdrop-blur-sm flex flex-col">
          <h3 className="text-sm font-bold text-foreground mb-4">Recent Open Roles</h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {company.recentOpenings.map((job) => (
              <div key={job.id} className="p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{job.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.department}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Just now</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-green-500/10 text-green-500 font-bold text-[10px] mb-1">
                    {job.salaryRange}
                  </span>
                  <p className="text-xs text-muted-foreground font-medium">{job.location}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
