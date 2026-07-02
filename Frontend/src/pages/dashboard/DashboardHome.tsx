import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Briefcase, Video, Trophy, XCircle, Clock, TrendingUp,
  Zap, Send, ArrowRight, Brain, Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { StatCardSkeleton, ChartSkeleton, ApplicationCardSkeleton } from "@/components/ui/skeleton";
import { dashboardService } from "@/services/dashboard.service";
import { profileService } from "@/services/profile.service";
import { cn, formatDate, timeAgo, getStatusColor, getStatusLabel } from "@/utils";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function DashboardHome() {
  const { user } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardService.getStats(),
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: () => dashboardService.getActivity(),
  });

  const { data: weeklyData, isLoading: chartLoading } = useQuery({
    queryKey: ["weekly-data"],
    queryFn: () => dashboardService.getWeeklyData(),
  });

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: () => dashboardService.getApplications(),
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
  });

  const statCards = stats ? [
    { label: "Total Applications", value: stats.totalApplications, icon: Briefcase, color: "from-blue-600 to-blue-400", change: `+${stats.weeklyChange}% this week` },
    { label: "Interviews", value: stats.interviews, icon: Video, color: "from-violet-600 to-violet-400", change: "3 scheduled" },
    { label: "Offers Received", value: stats.offers, icon: Trophy, color: "from-green-600 to-green-400", change: "1 pending review" },
    { label: "Response Rate", value: `${stats.responseRate}%`, icon: TrendingUp, color: "from-amber-500 to-orange-400", change: `Avg ${stats.avgResponseTime}` },
  ] : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">{greeting}, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your job search today.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/applications">
            <Button variant="outline" size="sm" className="gap-2"><Send className="h-4 w-4" /> Add Application</Button>
          </Link>
          <Link to="/dashboard/jobs">
            <Button variant="gradient" size="sm" className="gap-2"><Zap className="h-4 w-4" /> AI Apply</Button>
          </Link>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="p-5 hover:shadow-premium transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                      <p className="text-3xl font-bold mt-1">{s.value}</p>
                    </div>
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.change}</p>
                </Card>
              </motion.div>
            ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          {chartLoading ? <ChartSkeleton /> : (
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Weekly Applications</CardTitle>
                  <Badge variant="info" className="text-xs">This Week</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "currentColor" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "currentColor" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} fill="url(#appGrad)" name="Applications" />
                    <Area type="monotone" dataKey="interviews" stroke="#8b5cf6" strokeWidth={2} fill="url(#intGrad)" name="Interviews" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Score Cards */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">ATS Score</p>
                <p className="text-xs text-muted-foreground">Resume compatibility</p>
              </div>
            </div>
            <div className="text-4xl font-bold gradient-text mb-3">{profile?.atsScore ?? 82}<span className="text-lg text-muted-foreground">/100</span></div>
            <Progress value={profile?.atsScore ?? 82} />
            <p className="text-xs text-muted-foreground mt-2">Good — 3 improvements suggested</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Profile Score</p>
                <p className="text-xs text-muted-foreground">Completeness</p>
              </div>
            </div>
            <div className="text-4xl font-bold mb-3">{profile?.profileCompletion ?? 87}<span className="text-lg text-muted-foreground">%</span></div>
            <Progress value={profile?.profileCompletion ?? 87} colorClass="bg-gradient-to-r from-amber-500 to-orange-400" />
            <p className="text-xs text-muted-foreground mt-2">Add certificates to reach 100%</p>
          </Card>
        </div>
      </div>

      {/* Recent Applications + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Applications</CardTitle>
              <Link to="/dashboard/applications"><Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="h-3 w-3" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {appsLoading
              ? Array.from({ length: 3 }).map((_, i) => <ApplicationCardSkeleton key={i} />)
              : applications?.slice(0, 4).map((app) => (
                  <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors group">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                      {app.companyLogo ? (
                        <img src={app.companyLogo} alt={app.company} className="h-8 w-8 object-contain" />
                      ) : (
                        <span className="text-sm font-bold">{app.company[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{app.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">{app.company} · {app.workMode}</p>
                    </div>
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", getStatusColor(app.status))}>
                      {getStatusLabel(app.status)}
                    </span>
                  </div>
                ))
            }
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-40 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-56 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))
                : activity?.map((item) => {
                    const iconMap = { application: "📨", interview: "🎙️", offer: "🎉", rejection: "😞", system: "⚙️", ai: "🤖" };
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-base shrink-0">
                          {iconMap[item.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                          <p className="text-[11px] text-muted-foreground/60 mt-1">{timeAgo(item.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Auto Apply", desc: "AI applies for you", icon: Zap, href: "/dashboard/jobs", color: "from-blue-600 to-violet-600" },
            { label: "Upload Resume", desc: "Get AI score", icon: Brain, href: "/dashboard/resume", color: "from-violet-600 to-pink-600" },
            { label: "Interview Prep", desc: "Practice with AI", icon: Video, href: "/dashboard/interviews", color: "from-green-600 to-emerald-500" },
            { label: "View Offers", desc: "Review & compare", icon: Trophy, href: "/dashboard/applications", color: "from-amber-500 to-orange-400" },
          ].map((action) => (
            <Link key={action.label} to={action.href}>
              <div className="p-4 rounded-2xl border border-border hover:border-primary/40 hover:bg-accent transition-all duration-200 cursor-pointer group text-center">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
