import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Trash2, ExternalLink, Calendar, MapPin, DollarSign, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { dashboardService } from "@/services/dashboard.service";
import { cn, getStatusColor, getStatusLabel, formatDate, timeAgo } from "@/utils";
import type { ApplicationStatus } from "@/types";

const statusTabs: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Screening", value: "screening" },
  { label: "Interview", value: "interview" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications", activeTab, search],
    queryFn: () => dashboardService.getApplications({
      status: activeTab === "all" ? undefined : activeTab,
      search: search || undefined,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dashboardService.deleteApplication(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
  });

  const statusCounts = {
    all: applications?.length ?? 0,
    applied: applications?.filter(a => a.status === "applied").length ?? 0,
    interview: applications?.filter(a => a.status === "interview").length ?? 0,
    offer: applications?.filter(a => a.status === "offer").length ?? 0,
    rejected: applications?.filter(a => a.status === "rejected").length ?? 0,
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-muted-foreground mt-1">Track and manage all your job applications</p>
        </div>
        <Button variant="gradient" size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Application
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: applications?.length ?? 0, color: "text-blue-500" },
          { label: "Interviews", value: statusCounts.interview, color: "text-violet-500" },
          { label: "Offers", value: statusCounts.offer, color: "text-green-500" },
          { label: "Rejected", value: statusCounts.rejected, color: "text-red-500" },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by job title or company..." leftIcon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <div className="flex gap-1 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4"><TableSkeleton rows={6} /></div>
          ) : applications && applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Applied</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Source</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {applications.map((app, i) => (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border/50 hover:bg-accent/50 transition-colors group"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
                              {app.companyLogo ? (
                                <img src={app.companyLogo} alt={app.company} className="h-7 w-7 object-contain" />
                              ) : <span className="text-sm font-bold">{app.company[0]}</span>}
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-tight">{app.jobTitle}</p>
                              <p className="text-xs text-muted-foreground">{app.company} · {app.jobType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", getStatusColor(app.status))}>
                            {getStatusLabel(app.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {app.workMode}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground hidden md:table-cell">
                          {timeAgo(app.appliedDate)}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground hidden lg:table-cell">
                          <Badge variant="secondary" className="text-xs">{app.source}</Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {app.jobUrl && (
                              <a href={app.jobUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon-sm"><ExternalLink className="h-3.5 w-3.5" /></Button>
                              </a>
                            )}
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => deleteMutation.mutate(app.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No applications found</h3>
              <p className="text-muted-foreground text-sm mb-6">
                {search ? "Try adjusting your search or filters" : "Start tracking your job applications here"}
              </p>
              <Button variant="gradient" size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Add Your First Application
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
