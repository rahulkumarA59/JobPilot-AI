import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import {
  LayoutDashboard, TrendingUp, DollarSign, Activity, Users, FileText
} from "lucide-react";

export default function CompanyDashboard() {
  const { bookmarkedCompanyIds } = useCompanyIntelligenceStore();
  
  // Fake some aggregated data for a global overview dashboard
  const aggregateMetrics = {
    totalTracked: mockCompanies.length,
    activeHiring: mockCompanies.filter(c => c.hiringStatus === "Active" || c.hiringStatus === "Accelerated").length,
    avgSalary: Math.round(mockCompanies.reduce((acc, c) => acc + (c.salaries.find(s => s.role === "Senior")?.avg || 0), 0) / mockCompanies.length / 1000),
    avgWlb: (mockCompanies.reduce((acc, c) => acc + c.cultureRatings.workLifeBalance, 0) / mockCompanies.length).toFixed(1),
  };

  // Fake chart data to represent market trends over 12 months
  const marketTrendData = [
    { month: "Jan", hiringRate: 120, compGrowth: 100 },
    { month: "Feb", hiringRate: 135, compGrowth: 102 },
    { month: "Mar", hiringRate: 150, compGrowth: 105 },
    { month: "Apr", hiringRate: 140, compGrowth: 107 },
    { month: "May", hiringRate: 160, compGrowth: 108 },
    { month: "Jun", hiringRate: 180, compGrowth: 110 },
    { month: "Jul", hiringRate: 175, compGrowth: 113 },
    { month: "Aug", hiringRate: 190, compGrowth: 115 },
    { month: "Sep", hiringRate: 210, compGrowth: 118 },
    { month: "Oct", hiringRate: 220, compGrowth: 121 },
    { month: "Nov", hiringRate: 205, compGrowth: 123 },
    { month: "Dec", hiringRate: 230, compGrowth: 125 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          Global Market Dashboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          High-level aggregated insights, market hiring indices, and compensation trends across all tracked enterprise tech companies.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Building2Icon className="h-16 w-16 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <FileText className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold uppercase">Companies Tracked</span>
          </div>
          <p className="text-3xl font-black text-foreground">{aggregateMetrics.totalTracked}</p>
        </Card>

        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="h-16 w-16 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase">Actively Hiring</span>
          </div>
          <p className="text-3xl font-black text-foreground">{aggregateMetrics.activeHiring}</p>
        </Card>

        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="h-16 w-16 text-amber-500" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <DollarSign className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold uppercase">Avg Senior Base</span>
          </div>
          <p className="text-3xl font-black text-foreground">${aggregateMetrics.avgSalary}k</p>
        </Card>

        <Card className="p-5 border-border bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="h-16 w-16 text-violet-500" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <HeartIcon className="h-4 w-4 text-violet-500" />
            <span className="text-xs font-bold uppercase">Global WLB Index</span>
          </div>
          <p className="text-3xl font-black text-foreground">{aggregateMetrics.avgWlb} <span className="text-lg text-muted-foreground font-semibold">/ 5</span></p>
        </Card>
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm flex flex-col h-[400px]">
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-bold text-foreground">Market Hiring Volume</h3>
            <p className="text-xs text-muted-foreground mt-1">Aggregated open position growth index over 12 months.</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorHiring" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.4} vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="hiringRate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHiring)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm flex flex-col h-[400px]">
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-bold text-foreground">Compensation Growth Curve</h3>
            <p className="text-xs text-muted-foreground mt-1">Indexed base salary trajectory across top-tier firms.</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.4} vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}
                />
                <Line type="monotone" dataKey="compGrowth" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "var(--background)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

    </div>
  );
}

// Inline missing icons to avoid massive imports
const Building2Icon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);
