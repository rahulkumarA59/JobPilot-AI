import React from "react";
import { useResumeStudioStore, StudioTab } from "@/store/resumeStudioStore";
import {
  LayoutDashboard, FileText, Brain, Palette, History, GitCompare,
  Eye, Download, Flame, BarChart3, Wand2, LineChart, Settings,
  Sparkles, CheckCircle2, ChevronRight, Zap, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sub-components
import StudioDashboard from "@/components/resume-studio/StudioDashboard";
import ResumeBuilder from "@/components/resume-studio/ResumeBuilder";
import AIOptimizer from "@/components/resume-studio/AIOptimizer";
import ResumeTemplates from "@/components/resume-studio/ResumeTemplates";
import VersionHistory from "@/components/resume-studio/VersionHistory";
import ResumeCompare from "@/components/resume-studio/ResumeCompare";
import ResumePreview from "@/components/resume-studio/ResumePreview";
import ExportCenter from "@/components/resume-studio/ExportCenter";
import KeywordHeatmap from "@/components/resume-studio/KeywordHeatmap";
import SkillIntelligence from "@/components/resume-studio/SkillIntelligence";
import AISuggestions from "@/components/resume-studio/AISuggestions";
import StudioAnalytics from "@/components/resume-studio/StudioAnalytics";
import StudioSettings from "@/components/resume-studio/StudioSettings";

interface TabItem {
  id: StudioTab;
  label: string;
  icon: any;
  component: React.ComponentType;
  category: "Design" | "AI Power" | "Analytics & Settings";
}

const TAB_ITEMS: TabItem[] = [
  // Design & Edit
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, component: StudioDashboard, category: "Design" },
  { id: "builder", label: "Resume Builder", icon: FileText, component: ResumeBuilder, category: "Design" },
  { id: "templates", label: "Resume Templates", icon: Palette, component: ResumeTemplates, category: "Design" },
  { id: "preview", label: "Resume Preview", icon: Eye, component: ResumePreview, category: "Design" },

  // AI Power
  { id: "optimizer", label: "AI Optimizer", icon: Brain, component: AIOptimizer, category: "AI Power" },
  { id: "heatmap", label: "Keyword Heatmap", icon: Flame, component: KeywordHeatmap, category: "AI Power" },
  { id: "skills", label: "Skill Intelligence", icon: BarChart3, component: SkillIntelligence, category: "AI Power" },
  { id: "suggestions", label: "AI Suggestions", icon: Wand2, component: AISuggestions, category: "AI Power" },

  // Management & Management
  { id: "versions", label: "Version History", icon: History, component: VersionHistory, category: "Analytics & Settings" },
  { id: "compare", label: "Resume Compare", icon: GitCompare, component: ResumeCompare, category: "Analytics & Settings" },
  { id: "export", label: "Export Center", icon: Download, component: ExportCenter, category: "Analytics & Settings" },
  { id: "analytics", label: "Analytics", icon: LineChart, component: StudioAnalytics, category: "Analytics & Settings" },
  { id: "settings", label: "Settings", icon: Settings, component: StudioSettings, category: "Analytics & Settings" },
];

export default function AIResumeStudioPage() {
  const { activeTab, setActiveTab, resume, versions } = useResumeStudioStore();
  const activeVersion = versions.find((v) => v.isActive) || versions[versions.length - 1];

  const ActiveComponent = TAB_ITEMS.find((t) => t.id === activeTab)?.component || StudioDashboard;

  const categories: Array<TabItem["category"]> = ["Design", "AI Power", "Analytics & Settings"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header Row with status metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground m-0">AI Resume Studio</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 mt-1 text-primary bg-primary/10 border-primary/20">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              Pro Editor
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Build, optimize, preview, and track performance of your resume versions with integrated AI.
          </p>
        </div>

        {/* Global Mini Stats */}
        <div className="flex items-center gap-5 bg-card border border-border rounded-xl p-3 shadow-sm self-start md:self-center">
          <div className="text-center px-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">Active version</span>
            <p className="text-xs font-bold text-foreground mt-0.5 truncate max-w-[120px]">{activeVersion?.name.split(" — ")[0]}</p>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="text-center px-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase">ATS Score</span>
            <p className="text-sm font-extrabold text-green-500 mt-0.5">{activeVersion?.atsScore ?? 94}%</p>
          </div>
        </div>
      </div>

      {/* Workspace Grid Layout: Left Tab List + Right Active View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Sub-Navigation Tabs */}
        <div className="lg:col-span-3 space-y-5 select-none">
          {categories.map((cat) => (
            <div key={cat} className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider block px-3">
                {cat}
              </span>
              <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-1 lg:pb-0 scrollbar-none">
                {TAB_ITEMS.filter((item) => item.category === cat).map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap lg:w-full group ${
                        isSelected
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 transition ${isSelected ? "text-primaryScale" : "group-hover:text-foreground"}`} />
                      <span>{tab.label}</span>
                      <ChevronRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-40 transition hidden lg:block" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Notice Card */}
          <div className="hidden lg:block p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-violet-500/5 border border-primary/10 space-y-2 text-[11px] leading-relaxed">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" /> Auto-Save Active
            </p>
            <p className="text-muted-foreground">
              Every character change is immediately saved to your local workspace cache. Undo/redo actions are kept history-active.
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
