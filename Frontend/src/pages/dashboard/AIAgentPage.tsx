import React, { useState } from "react";
import { useAgentStore } from "@/store/agentStore";
import {
  LayoutDashboard, Terminal, Search, FileText, ListTodo, History,
  BarChart3, Bot, ChevronRight, Play, Pause, AlertTriangle, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sub-components
import AgentOverview from "@/components/agent/AgentOverview";
import AgentConsole from "@/components/agent/AgentConsole";
import JobDiscovery from "@/components/agent/JobDiscovery";
import ResumeIntelligence from "@/components/agent/ResumeIntelligence";
import QueueBoard from "@/components/agent/QueueBoard";
import ActivityTimeline from "@/components/agent/ActivityTimeline";
import AgentInsights from "@/components/agent/AgentInsights";

type SubTab = "overview" | "console" | "jobs" | "resume" | "queue" | "activity" | "insights";

interface TabItem {
  id: SubTab;
  label: string;
  icon: any;
  component: React.ComponentType;
}

const TAB_ITEMS: TabItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, component: AgentOverview },
  { id: "console", label: "Live Console", icon: Terminal, component: AgentConsole },
  { id: "jobs", label: "Job Discovery", icon: Search, component: JobDiscovery },
  { id: "resume", label: "Resume Intelligence", icon: FileText, component: ResumeIntelligence },
  { id: "queue", label: "Application Queue", icon: ListTodo, component: QueueBoard },
  { id: "activity", label: "Activity Log", icon: History, component: ActivityTimeline },
  { id: "insights", label: "AI Insights", icon: BarChart3, component: AgentInsights }
];

export default function AIAgentPage() {
  const [activeTab, setActiveTab] = useState<SubTab>("overview");
  const { status, applicationsCompleted, successRate } = useAgentStore();

  const ActiveComponent = TAB_ITEMS.find((t) => t.id === activeTab)?.component || AgentOverview;

  const getStatusLabelColor = () => {
    switch (status) {
      case "running":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "paused":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "error":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getStatusDot = () => {
    if (status === "running") return "bg-green-500 animate-ping";
    if (status === "paused") return "bg-amber-500 animate-pulse";
    if (status === "error") return "bg-red-500 animate-pulse";
    return "bg-blue-500";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Row with status metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/80 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground m-0">AI Recruiter Agent</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 mt-1 ${getStatusLabelColor()}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot()}`} />
              {status.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Sandbox-based automated browser applications, portfolio synchronization, and ATS score forecasts.
          </p>
        </div>

        {/* Global Mini Stats */}
        <div className="flex items-center gap-5 bg-card/45 border border-border/80 rounded-xl p-3 shadow-sm self-start md:self-center">
          <div className="text-center px-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Submitted</span>
            <p className="text-sm font-extrabold text-foreground mt-0.5">{applicationsCompleted}</p>
          </div>
          <div className="h-6 w-px bg-border/80" />
          <div className="text-center px-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Avg Score</span>
            <p className="text-sm font-extrabold text-foreground mt-0.5">{successRate}%</p>
          </div>
        </div>
      </div>

      {/* Workspace Sub-layout: Sidebar Navigation + Active view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Sub-Navigation Tabs */}
        <div className="lg:col-span-3 space-y-2 select-none">
          <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block px-3 mb-2">
            Agent Operations
          </span>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0 scrollbar-none">
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap lg:w-full group ${
                    isSelected
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition ${isSelected ? "text-primaryScale" : "group-hover:text-foreground"}`} />
                  <span>{tab.label}</span>
                  <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition hidden lg:block" />
                </button>
              );
            })}
          </div>

          {/* Quick Notice Card */}
          <div className="hidden lg:block p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-violet-500/5 border border-primary/10 space-y-2 text-[11px] leading-relaxed">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Connected Sandbox
            </p>
            <p className="text-muted-foreground">
              Your browser agent is operating under secure docker container isolation. Automated tabs are safe.
            </p>
          </div>
        </div>

        {/* Right Side Active Panel View */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
