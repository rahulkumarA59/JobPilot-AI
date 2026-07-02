import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Eye, Download, TrendingUp, Briefcase, Users, Award } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, LineChart, Line
} from "recharts";

const viewsData = [
  { month: "Jan", Views: 45, Downloads: 12 },
  { month: "Feb", Views: 62, Downloads: 18 },
  { month: "Mar", Views: 98, Downloads: 24 },
  { month: "Apr", Views: 134, Downloads: 31 },
  { month: "May", Views: 187, Downloads: 38 },
  { month: "Jun", Views: 245, Downloads: 42 },
];

const atsGrowthData = [
  { version: "V1", Score: 72 },
  { version: "V2", Score: 85 },
  { version: "V3", Score: 94 },
];

const conversionData = [
  { stage: "Applications", count: 38, rate: "100%" },
  { stage: "Screenings", count: 28, rate: "73.7%" },
  { stage: "Interviews", count: 16, rate: "42.1%" },
  { stage: "Final Round", count: 8, rate: "21.1%" },
  { stage: "Offers", count: 4, rate: "10.5%" },
];

const metrics = [
  { label: "Total Views", value: "1,247", change: "+32% this month", icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Downloads", value: "142", change: "+18% this month", icon: Download, color: "text-violet-500", bg: "bg-violet-500/10" },
  { label: "ATS Growth", value: "+22pts", change: "V1 → V3 improvement", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Interview Rate", value: "42.1%", change: "Above 35% avg", icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
];

export default function StudioAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Resume Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Track how your resume performs across applications and recruiter engagement.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            <Card className="p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                <div className={`p-2 rounded-xl ${m.bg}`}>
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{m.value}</p>
              <p className={`text-xs font-semibold ${m.color} mt-1`}>{m.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views & Downloads */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">Resume Views & Downloads</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "11px" }} />
                <Area type="monotone" dataKey="Views" stroke="#3b82f6" strokeWidth={2} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="Downloads" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorDownloads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ATS Score Growth */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">ATS Score Growth</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={atsGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="version" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "11px" }} />
                <Bar dataKey="Score" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
          <Award className="h-4 w-4 text-violet-500" />
          Application Conversion Funnel
        </h3>
        <div className="space-y-3">
          {conversionData.map((stage, i) => {
            const width = (stage.count / conversionData[0].count) * 100;
            return (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="flex items-center gap-4"
              >
                <span className="text-xs font-bold text-foreground w-24 shrink-0">{stage.stage}</span>
                <div className="flex-1 h-8 bg-muted/40 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center justify-end pr-3"
                  >
                    {width > 20 && (
                      <span className="text-[10px] font-extrabold text-white">{stage.count}</span>
                    )}
                  </motion.div>
                  {width <= 20 && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-foreground">{stage.count}</span>
                  )}
                </div>
                <span className="text-xs font-extrabold text-muted-foreground w-14 text-right">{stage.rate}</span>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
