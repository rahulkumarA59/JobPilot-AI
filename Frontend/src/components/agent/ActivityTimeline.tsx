import React, { useState } from "react";
import { useAgentStore, TimelineLog } from "@/store/agentStore";
import { Search, Filter, Clock, Info, CheckCircle2, AlertTriangle, XCircle, RotateCw } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ActivityTimeline() {
  const { timelineLogs } = useAgentStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCompany, setFilterCompany] = useState<string>("all");

  const getLogIcon = (type: TimelineLog["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "thinking":
        return <RotateCw className="h-4 w-4 text-purple-500 animate-spin" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLogBorder = (type: TimelineLog["type"]) => {
    switch (type) {
      case "success":
        return "border-green-500/20 bg-green-500/5";
      case "error":
        return "border-red-500/20 bg-red-500/5";
      case "warning":
        return "border-amber-500/20 bg-amber-500/5";
      case "thinking":
        return "border-purple-500/20 bg-purple-500/5";
      default:
        return "border-blue-500/20 bg-blue-500/5";
    }
  };

  // Companies present in logs
  const companies = ["Vercel", "Stripe", "Linear", "Airbnb", "Figma", "Cursor"];

  // Filter logs
  const filteredLogs = timelineLogs.filter((log) => {
    const matchesSearch = log.text.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || log.type === filterType;
    
    let matchesCompany = true;
    if (filterCompany !== "all") {
      matchesCompany = log.text.toLowerCase().includes(filterCompany.toLowerCase());
    }

    return matchesSearch && matchesType && matchesCompany;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Timeline Log History</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit history of all background agent actions, forms parsed, and response IDs.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border/80 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          {/* Filter Type */}
          <div className="flex items-center gap-2 bg-card border border-border/80 rounded-xl px-3 py-1.5 text-xs text-muted-foreground font-semibold">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent border-none outline-none text-foreground font-bold cursor-pointer"
            >
              <option value="all">All Event Categories</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="thinking">Thinking</option>
            </select>
          </div>

          {/* Filter Company */}
          <div className="flex items-center gap-2 bg-card border border-border/80 rounded-xl px-3 py-1.5 text-xs text-muted-foreground font-semibold">
            <Clock className="h-3.5 w-3.5" />
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="bg-transparent border-none outline-none text-foreground font-bold cursor-pointer"
            >
              <option value="all">All Targeted Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Layout */}
      <Card className="p-6 bg-card/60 border-border/80">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground font-semibold">No audit logs match your search filters.</p>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-border/80 space-y-6">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative">
                {/* Timeline Bullet node */}
                <div className="absolute -left-[35px] top-0.5 p-1 bg-card border border-border/80 rounded-full shadow-sm flex items-center justify-center">
                  {getLogIcon(log.type)}
                </div>

                <div className={`p-4 rounded-xl border ${getLogBorder(log.type)} flex flex-col md:flex-row md:items-center justify-between gap-3`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-muted-foreground font-bold font-mono">
                        {log.time}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        log.type === "success" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                        log.type === "error" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                        log.type === "warning" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                        log.type === "thinking" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                        "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      }`}>
                        {log.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground/90 leading-relaxed max-w-2xl">
                      {log.text}
                    </p>
                  </div>

                  <span className="text-[9px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded border self-start md:self-center">
                    Docker Sandbox ID: isolated-chrome-893a
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
