import { useMemo } from "react";
import { useCompanyIntelligenceStore, IntelligenceTab } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import {
  MapPin, Users, DollarSign, Calendar, Globe,
  Building, User, Briefcase, Bookmark, Sparkles,
  Award, Compass, Cpu, Layers
} from "lucide-react";
import { toast } from "sonner";

export default function CompanyDetails() {
  const { selectedCompanyId, bookmarkedCompanyIds, toggleBookmark, setActiveTab } = useCompanyIntelligenceStore();

  const company = useMemo(() => {
    return mockCompanies.find((c) => c.id === selectedCompanyId) || mockCompanies[0];
  }, [selectedCompanyId]);

  const isBookmarked = bookmarkedCompanyIds.includes(company.id);

  const stats = [
    { label: "CEO", value: company.ceo, icon: User, color: "text-blue-500" },
    { label: "Headquarters", value: company.headquarters, icon: MapPin, color: "text-red-500" },
    { label: "Employees", value: company.employees, icon: Users, color: "text-emerald-500" },
    { label: "Funding / Valuation", value: company.funding, icon: DollarSign, color: "text-amber-500" },
    { label: "Founded", value: company.founded, icon: Calendar, color: "text-indigo-500" },
    { label: "Remote Policy", value: company.remotePolicy, icon: Building, color: "text-pink-500" },
  ];

  const quickLinks: { label: string; tab: IntelligenceTab; desc: string; icon: any }[] = [
    { label: "Hiring Trends", tab: "hiring", desc: "View velocities & openings", icon: Briefcase },
    { label: "Salary Ranges", tab: "salary", desc: "Compare levels & locations", icon: DollarSign },
    { label: "Interview Loops", tab: "interview", desc: "Assess stages & questions", icon: Compass },
    { label: "AI SWAT Analysis", tab: "ai-analysis", desc: "Check career risk & growth", icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
        {/* Banner Background */}
        <div className={`h-40 md:h-52 w-full ${company.coverImage} opacity-90`} />
        
        {/* Content Overlap */}
        <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-10 md:-mt-14">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-white border-2 border-card flex items-center justify-center p-2.5 shrink-0 shadow-lg overflow-hidden">
              <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
            </div>
            <div className="space-y-1 pt-2 md:pt-0">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">{company.name}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  company.hiringStatus === "Accelerated" ? "bg-green-500/10 text-green-500 border border-green-500/20 animate-pulse" :
                  company.hiringStatus === "Active" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                  company.hiringStatus === "Selective" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                  "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                }`}>
                  {company.hiringStatus.toUpperCase()} HIRING
                </span>
              </div>
              <p className="text-xs md:text-sm text-primary font-bold">{company.industry}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                toggleBookmark(company.id);
                toast.success(isBookmarked ? `Removed ${company.name} from bookmarks` : `Bookmarked ${company.name}`);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                isBookmarked
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" fill={isBookmarked ? "currentColor" : "none"} />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              Website
            </a>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 flex flex-col justify-between border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
            </div>
            <span className="text-xs md:text-sm font-extrabold text-foreground truncate">{s.value}</span>
          </Card>
        ))}
      </div>

      {/* Overview, Mission, Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-4 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Company Overview</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {company.description}
          </p>
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Mission Statement</span>
              <p className="text-xs text-foreground/80 font-medium mt-1 leading-relaxed">"{company.mission}"</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Company Vision</span>
              <p className="text-xs text-foreground/80 font-medium mt-1 leading-relaxed">"{company.vision}"</p>
            </div>
          </div>
        </Card>

        {/* Tech Stack & Core Products */}
        <Card className="p-6 space-y-5 border-border bg-card/60 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Tech Stack Moat</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {company.techStack.map((tech) => (
                <span key={tech} className="text-xs px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/10 font-bold">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Flagship Products</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {company.products.map((prod) => (
                <div key={prod} className="px-3 py-2 rounded-lg bg-muted text-xs font-semibold text-foreground/90 text-center border border-border/50 truncate">
                  {prod}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Links / Navigation Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Deep Dive Analytics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((ql) => (
            <Card
              key={ql.label}
              onClick={() => setActiveTab(ql.tab)}
              className="p-4 hover:border-primary/30 transition-all cursor-pointer group bg-card/60 backdrop-blur-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 transition-colors">
                  <ql.icon className="h-4 w-4" />
                </div>
              </div>
              <h4 className="font-extrabold text-foreground text-xs">{ql.label}</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">{ql.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Office Images Gallery */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Workplace & Office Culture</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {company.officeImages.map((img, idx) => (
            <div key={idx} className="h-44 rounded-2xl overflow-hidden border border-border bg-muted relative group">
              <img src={img} alt={`Office ${idx + 1}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{company.name} Campus</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
