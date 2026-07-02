import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import {
  Scale, Plus, X, ArrowRightLeft, DollarSign,
  Heart, Target, Briefcase, ChevronRight
} from "lucide-react";

export default function CompareCompanies() {
  const { compareCompanyIds, removeFromCompare, addToCompare } = useCompanyIntelligenceStore();

  const c1 = mockCompanies.find(c => c.id === compareCompanyIds[0]);
  const c2 = mockCompanies.find(c => c.id === compareCompanyIds[1]);

  const availableCompanies = mockCompanies.filter(c => !compareCompanyIds.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Compare Companies
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze compensation, culture, and hiring trends side-by-side to make data-driven career choices.
          </p>
        </div>
        
        {/* Simple selector for C2 if missing */}
        {compareCompanyIds.length < 2 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) addToCompare(e.target.value);
              }}
              className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-bold focus:ring-1 focus:ring-primary outline-none"
              defaultValue=""
            >
              <option value="" disabled>+ Add Company to Compare</option>
              {availableCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {compareCompanyIds.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 bg-card/40">
          <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground">No companies selected</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Select two companies from the dropdown above or from the explorer to compare them side-by-side.
          </p>
          <select
            onChange={(e) => {
              if (e.target.value) addToCompare(e.target.value);
            }}
            className="mt-6 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm cursor-pointer outline-none"
            defaultValue=""
          >
            <option value="" disabled>Select First Company</option>
            {mockCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Vertical VS Divider (desktop only) */}
          {c1 && c2 && (
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-card border border-border items-center justify-center z-10 shadow-lg">
              <span className="text-sm font-black text-muted-foreground italic">VS</span>
            </div>
          )}

          {/* Company 1 */}
          {c1 ? (
            <Card className="p-0 overflow-hidden border-border bg-card/60 backdrop-blur-sm flex flex-col relative">
              <button
                onClick={() => removeFromCompare(c1.id)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 transition-colors z-20"
              >
                <X className="h-4 w-4" />
              </button>
              <div className={`h-24 w-full ${c1.coverImage}`} />
              <div className="px-6 pb-6 relative -mt-10 flex-1">
                <div className="h-20 w-20 rounded-2xl bg-white border-2 border-card flex items-center justify-center p-2 shadow-lg overflow-hidden mb-4">
                  <img src={c1.logo} alt={c1.name} className="h-full w-full object-contain" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground">{c1.name}</h3>
                <p className="text-xs font-bold text-primary mb-6">{c1.industry}</p>

                <div className="space-y-6">
                  {/* Comp Block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-1">
                      <DollarSign className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Compensation (Senior)</h4>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-black">${(c1.salaries.find(s => s.role === "Senior")?.avg || 0) / 1000}k</span>
                      <span className="text-xs text-muted-foreground font-semibold">{c1.salaries.find(s => s.role === "Senior")?.range}</span>
                    </div>
                  </div>

                  {/* Culture Block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-1">
                      <Heart className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Culture Ratings</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-semibold block">WLB</span>
                        <span className="text-sm font-extrabold text-rose-500">{c1.cultureRatings.workLifeBalance.toFixed(1)} <span className="text-[10px] text-muted-foreground">/ 5</span></span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground font-semibold block">Growth</span>
                        <span className="text-sm font-extrabold text-blue-500">{c1.cultureRatings.growth.toFixed(1)} <span className="text-[10px] text-muted-foreground">/ 5</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Hiring Block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-1">
                      <Target className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Hiring Outlook</h4>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold block mb-1">Current Status</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        c1.hiringStatus === "Accelerated" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                        c1.hiringStatus === "Active" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                        "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}>{c1.hiringStatus.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Summary Block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-1">
                      <Briefcase className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">AI Outlook</h4>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                      "{c1.aiAnalysis.aiSummary.split(". ")[0]}."
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 border-dashed border-2 bg-card/40 flex flex-col items-center justify-center h-full min-h-[500px]">
              <Plus className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <select
                onChange={(e) => {
                  if (e.target.value) addToCompare(e.target.value);
                }}
                className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-bold focus:ring-1 focus:ring-primary outline-none max-w-[200px]"
                defaultValue=""
              >
                <option value="" disabled>Select Company 1</option>
                {availableCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Card>
          )}

          {/* Company 2 */}
          {c2 ? (
            <Card className="p-0 overflow-hidden border-border bg-card/60 backdrop-blur-sm flex flex-col relative">
              <button
                onClick={() => removeFromCompare(c2.id)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 transition-colors z-20"
              >
                <X className="h-4 w-4" />
              </button>
              <div className={`h-24 w-full ${c2.coverImage}`} />
              <div className="px-6 pb-6 relative -mt-10 flex-1">
                <div className="h-20 w-20 rounded-2xl bg-white border-2 border-card flex items-center justify-center p-2 shadow-lg overflow-hidden mb-4">
                  <img src={c2.logo} alt={c2.name} className="h-full w-full object-contain" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground">{c2.name}</h3>
                <p className="text-xs font-bold text-primary mb-6">{c2.industry}</p>

                <div className="space-y-6">
                  {/* Comp Block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-1">
                      <DollarSign className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Compensation (Senior)</h4>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-black">${(c2.salaries.find(s => s.role === "Senior")?.avg || 0) / 1000}k</span>
                      <span className="text-xs text-muted-foreground font-semibold">{c2.salaries.find(s => s.role === "Senior")?.range}</span>
                    </div>
                  </div>

                  {/* Culture Block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-1">
                      <Heart className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Culture Ratings</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-semibold block">WLB</span>
                        <span className="text-sm font-extrabold text-rose-500">{c2.cultureRatings.workLifeBalance.toFixed(1)} <span className="text-[10px] text-muted-foreground">/ 5</span></span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground font-semibold block">Growth</span>
                        <span className="text-sm font-extrabold text-blue-500">{c2.cultureRatings.growth.toFixed(1)} <span className="text-[10px] text-muted-foreground">/ 5</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Hiring Block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-1">
                      <Target className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Hiring Outlook</h4>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-semibold block mb-1">Current Status</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        c2.hiringStatus === "Accelerated" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                        c2.hiringStatus === "Active" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                        "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}>{c2.hiringStatus.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Summary Block */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-1">
                      <Briefcase className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">AI Outlook</h4>
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                      "{c2.aiAnalysis.aiSummary.split(". ")[0]}."
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 border-dashed border-2 bg-card/40 flex flex-col items-center justify-center h-full min-h-[500px]">
              <Plus className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <select
                onChange={(e) => {
                  if (e.target.value) addToCompare(e.target.value);
                }}
                className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-bold focus:ring-1 focus:ring-primary outline-none max-w-[200px]"
                defaultValue=""
              >
                <option value="" disabled>Select Company 2</option>
                {availableCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
