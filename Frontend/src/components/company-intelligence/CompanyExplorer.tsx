import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search, Filter, Sparkles, MapPin, Users, DollarSign,
  Bookmark, Building2, ArrowRight, RotateCcw, X
} from "lucide-react";
import { toast } from "sonner";

export default function CompanyExplorer() {
  const {
    setSelectedCompanyId,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    resetFilters,
    bookmarkedCompanyIds,
    toggleBookmark
  } = useCompanyIntelligenceStore();

  const [showFilters, setShowFilters] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  // Unique list values for filter selectors
  const industries = useMemo(() => ["All", ...Array.from(new Set(mockCompanies.map(c => c.industry)))], []);
  const locations = useMemo(() => ["All", "Mountain View, CA", "Cupertino, CA", "San Francisco, CA", "Seattle, WA", "Bengaluru, India", "Mumbai, India", "San Jose, CA"], []);
  const policies = ["All", "Fully Remote", "Hybrid", "Office-First", "Flexible"];
  const hiringStatuses = ["All", "Active", "Paused", "Selective", "Accelerated"];
  const sizes = ["All", "Small (< 5,000)", "Medium (5,000 - 50,000)", "Large (50,000+)"];

  const handleAiSearch = () => {
    if (!aiPrompt.trim()) return;
    setIsAiSearching(true);
    setTimeout(() => {
      setIsAiSearching(false);
      // Simulate matching query
      const promptLower = aiPrompt.toLowerCase();
      if (promptLower.includes("ai") || promptLower.includes("openai")) {
        setSearchQuery("OpenAI");
      } else if (promptLower.includes("india") || promptLower.includes("tcs") || promptLower.includes("service")) {
        setFilters({ industry: "IT Services & Consulting" });
      } else if (promptLower.includes("remote") || promptLower.includes("fully")) {
        setFilters({ remotePolicy: "Fully Remote" });
      } else if (promptLower.includes("highest") || promptLower.includes("salary")) {
        setSearchQuery("Netflix");
      } else {
        setSearchQuery(aiPrompt.split(" ")[0]);
      }
      toast.success("AI Search completed! Filters applied.");
      setAiPrompt("");
    }, 1800);
  };

  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter((company) => {
      // Search query
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.techStack.some(t => t.toLowerCase().includes(query));

      // Filters
      const matchesIndustry = filters.industry === "All" || company.industry === filters.industry;
      
      const matchesLocation = filters.location === "All" || company.headquarters.includes(filters.location);
      
      const matchesPolicy = filters.remotePolicy === "All" || company.remotePolicy === filters.remotePolicy;
      
      const matchesHiring = filters.hiringStatus === "All" || company.hiringStatus === filters.hiringStatus;
      
      // Size mapping
      const sizeNum = parseInt(company.employees.replace(/,/g, ""), 10);
      let matchesSize = true;
      if (filters.size === "Small (< 5,000)") matchesSize = sizeNum < 5000;
      else if (filters.size === "Medium (5,000 - 50,000)") matchesSize = sizeNum >= 5000 && sizeNum <= 50000;
      else if (filters.size === "Large (50,000+)") matchesSize = sizeNum > 50000;

      // Salary base modifier filtering
      let matchesSalary = true;
      if (filters.salaryMin > 0) {
        // e.g. base salary avg is ~100k
        const avgCompanySalary = 100 * (company.salaries[3]?.avg / 180000 || 1.0);
        matchesSalary = avgCompanySalary >= filters.salaryMin;
      }

      return matchesSearch && matchesIndustry && matchesLocation && matchesPolicy && matchesHiring && matchesSize && matchesSalary;
    });
  }, [searchQuery, filters]);

  const selectCompany = (id: string) => {
    setSelectedCompanyId(id);
    setActiveTab("details");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Company Explorer</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Search, filter, and discover deep workspace statistics on 22 enterprise firms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              showFilters
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.values(filters).some(v => v !== "All" && v !== 0 && (Array.isArray(v) ? v.length > 0 : true)) && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
          </button>
          {(searchQuery || Object.values(filters).some(v => v !== "All" && v !== 0)) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* AI Intelligence Query Search Bar */}
      <Card className="p-4 bg-gradient-to-r from-blue-900/10 via-purple-950/10 to-violet-900/10 border border-violet-500/25 relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-violet-500 shrink-0 animate-pulse" />
          <Input
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
            placeholder="Ask AI: 'Show me fully remote AI companies' or 'Highest paying firms in Silicon Valley'..."
            className="flex-1 bg-transparent border-none placeholder:text-muted-foreground/60 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isAiSearching}
          />
          <button
            onClick={handleAiSearch}
            disabled={isAiSearching || !aiPrompt.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isAiSearching ? (
              <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Ask AI"
            )}
          </button>
        </div>
      </Card>

      {/* Basic Search and Filter Expand */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by company name, industry, or tech stack (e.g. React, Go, Java)..."
          className="pl-10 h-11 rounded-xl border-border bg-card/60 backdrop-blur-sm focus-visible:ring-primary/20"
        />
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-border bg-card/40 backdrop-blur-md">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => setFilters({ industry: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                >
                  {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Location HQ</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ location: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                >
                  {locations.map(loc => <option key={loc} value={loc}>{loc === "All" ? "All Locations" : loc}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Remote Policy</label>
                <select
                  value={filters.remotePolicy}
                  onChange={(e) => setFilters({ remotePolicy: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                >
                  {policies.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Hiring Status</label>
                <select
                  value={filters.hiringStatus}
                  onChange={(e) => setFilters({ hiringStatus: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                >
                  {hiringStatuses.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Company Size</label>
                <select
                  value={filters.size}
                  onChange={(e) => setFilters({ size: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                >
                  {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Min Base Salary Avg (k)</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={filters.salaryMin === 0 ? "" : filters.salaryMin}
                  onChange={(e) => setFilters({ salaryMin: Number(e.target.value) || 0 })}
                  placeholder="e.g. 120"
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredCompanies.map((company, index) => {
            const isBookmarked = bookmarkedCompanyIds.includes(company.id);
            return (
              <motion.div
                key={company.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
              >
                <Card className="h-full flex flex-col justify-between border-border hover:border-primary/30 transition-all hover:shadow-md relative overflow-hidden group bg-card/75 backdrop-blur-sm">
                  {/* Banner Line */}
                  <div className={`h-1.5 w-full ${company.coverImage}`} />
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-12 w-12 rounded-xl bg-white border border-border flex items-center justify-center p-1.5 shrink-0 shadow-sm overflow-hidden">
                          <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                            company.hiringStatus === "Accelerated" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                            company.hiringStatus === "Active" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                            company.hiringStatus === "Selective" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                            "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                          }`}>
                            {company.hiringStatus.toUpperCase()}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(company.id);
                              toast.success(isBookmarked ? `Removed ${company.name} from bookmarks` : `Bookmarked ${company.name}`);
                            }}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isBookmarked
                                ? "border-primary/20 bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                          >
                            <Bookmark className="h-3.5 w-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-foreground text-base tracking-tight">{company.name}</h3>
                      <p className="text-xs text-primary font-bold mt-0.5">{company.industry}</p>
                      
                      <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
                        {company.description}
                      </p>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground/80" /> {company.headquarters.split(",")[0]}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-muted-foreground/80" /> {company.employees}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {company.techStack.slice(0, 3).map(tech => (
                          <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                            {tech}
                          </span>
                        ))}
                        {company.techStack.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                            +{company.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="h-px bg-border pt-1" />

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{company.remotePolicy}</span>
                        <button
                          onClick={() => selectCompany(company.id)}
                          className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-1.5 transition-all"
                        >
                          Explore
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredCompanies.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-extrabold text-foreground text-sm">No companies found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              We couldn't find any companies matching your filter criteria. Try resetting or adjusting filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
