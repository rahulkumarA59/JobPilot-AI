import { useCompanyIntelligenceStore, IntelligenceTab } from "@/store/companyIntelligenceStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, LineChart, Compass, Briefcase, Zap, AlertCircle,
  FileText, Activity, Shield, Users, Search, Bookmark,
  Bell, LayoutDashboard, ChevronRight
} from "lucide-react";
import CompanyExplorer from "@/components/company-intelligence/CompanyExplorer";
import CompanyDetails from "@/components/company-intelligence/CompanyDetails";
import HiringIntelligence from "@/components/company-intelligence/HiringIntelligence";
import SalaryIntelligence from "@/components/company-intelligence/SalaryIntelligence";
import InterviewIntelligence from "@/components/company-intelligence/InterviewIntelligence";
import SkillIntelligence from "@/components/company-intelligence/SkillIntelligence";
import CultureIntelligence from "@/components/company-intelligence/CultureIntelligence";
import AICompanyAnalysis from "@/components/company-intelligence/AICompanyAnalysis";
import CompareCompanies from "@/components/company-intelligence/CompareCompanies";
import FavoriteCompanies from "@/components/company-intelligence/FavoriteCompanies";
import CompanyDashboard from "@/components/company-intelligence/CompanyDashboard";
import NotificationsPanel from "@/components/company-intelligence/NotificationsPanel";
import { mockCompanies } from "@/services/companyIntelligenceData";

export default function CompanyIntelligencePage() {
  const { activeTab, setActiveTab, selectedCompanyId, notifications } = useCompanyIntelligenceStore();

  const activeCompany = mockCompanies.find(c => c.id === selectedCompanyId) || mockCompanies[0];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabs: { id: IntelligenceTab; label: string; icon: any; global?: boolean }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, global: true },
    { id: "explorer", label: "Company Explorer", icon: Search, global: true },
    { id: "compare", label: "Compare", icon: Activity, global: true },
    { id: "favorites", label: "Favorites", icon: Bookmark, global: true },
    { id: "notifications", label: `Alerts ${unreadCount > 0 ? `(${unreadCount})` : ''}`, icon: Bell, global: true },
    
    // Entity specific tabs
    { id: "details", label: "Overview", icon: Building2 },
    { id: "hiring", label: "Hiring", icon: Briefcase },
    { id: "salary", label: "Salaries", icon: LineChart },
    { id: "interview", label: "Interviews", icon: Compass },
    { id: "skills", label: "Skills Gap", icon: Zap },
    { id: "culture", label: "Culture", icon: Users },
    { id: "ai-analysis", label: "AI Analysis", icon: Shield },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard": return <CompanyDashboard />;
      case "explorer": return <CompanyExplorer />;
      case "compare": return <CompareCompanies />;
      case "favorites": return <FavoriteCompanies />;
      case "notifications": return <NotificationsPanel />;
      
      case "details": return <CompanyDetails />;
      case "hiring": return <HiringIntelligence />;
      case "salary": return <SalaryIntelligence />;
      case "interview": return <InterviewIntelligence />;
      case "skills": return <SkillIntelligence />;
      case "culture": return <CultureIntelligence />;
      case "ai-analysis": return <AICompanyAnalysis />;
      default: return <CompanyExplorer />;
    }
  };

  const isGlobalTab = tabs.find(t => t.id === activeTab)?.global;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full mask-linear-fade">
            {tabs.map((tab) => {
              // Add a visual separator between global tabs and company-specific tabs if we are on a company view
              const showSeparator = !isGlobalTab && tab.id === "details";

              return (
                <div key={tab.id} className="flex items-center">
                  {showSeparator && (
                    <div className="flex items-center px-3 text-muted-foreground">
                      <ChevronRight className="h-4 w-4" />
                      <div className="flex items-center gap-1.5 ml-2 mr-1 px-2 py-1 rounded bg-muted/50 border border-border">
                        <img src={activeCompany.logo} alt={activeCompany.name} className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold text-foreground">{activeCompany.name}</span>
                      </div>
                    </div>
                  )}
                  
                  {(!isGlobalTab && tab.global && tab.id !== "explorer" && tab.id !== "dashboard") ? null : ( // Hide some global tabs when deep diving to save space, but keep back routes
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="h-4 w-4 shrink-0" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeCompanyTab"
                          className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-md shadow-primary/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 relative">
        {/* Background ambient glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
