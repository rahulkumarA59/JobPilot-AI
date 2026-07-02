import { useMemo } from "react";
import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import {
  Heart, Users, GraduationCap, Building2, Smile, ArrowUpRight,
  PlusCircle, MinusCircle, MessageSquare
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CultureIntelligence() {
  const { selectedCompanyId } = useCompanyIntelligenceStore();

  const company = useMemo(() => {
    return mockCompanies.find((c) => c.id === selectedCompanyId) || mockCompanies[0];
  }, [selectedCompanyId]);

  const ratingMetrics = [
    { label: "Work-Life Balance", score: company.cultureRatings.workLifeBalance, icon: Heart, color: "text-rose-500", bg: "bg-rose-500" },
    { label: "Benefits & Perks", score: company.cultureRatings.benefits, icon: Smile, color: "text-emerald-500", bg: "bg-emerald-500" },
    { label: "Career Growth", score: company.cultureRatings.growth, icon: ArrowUpRight, color: "text-blue-500", bg: "bg-blue-500" },
    { label: "Management", score: company.cultureRatings.management, icon: Users, color: "text-violet-500", bg: "bg-violet-500" },
    { label: "Learning & Dev", score: company.cultureRatings.learning, icon: GraduationCap, color: "text-amber-500", bg: "bg-amber-500" },
    { label: "Remote Culture", score: company.cultureRatings.remoteCulture, icon: Building2, color: "text-cyan-500", bg: "bg-cyan-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Culture Intelligence</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Deep dive into the true work environment, employee reviews, and cultural nuances of {company.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Ratings */}
        <Card className="lg:col-span-2 p-6 border-border bg-card/60 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-foreground mb-6">Cultural Health Ratings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {ratingMetrics.map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    <span className="text-xs font-bold text-foreground">{metric.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-foreground">{metric.score.toFixed(1)} <span className="text-muted-foreground font-semibold">/ 5</span></span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${metric.bg}`} style={{ width: `${(metric.score / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Diversity & Inclusion */}
        <Card className="p-6 border-border bg-gradient-to-br from-indigo-500/10 via-card to-card backdrop-blur-sm flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center mb-4">
            <span className="text-2xl font-black text-indigo-500">{company.cultureRatings.diversity.toFixed(1)}</span>
          </div>
          <h3 className="text-sm font-bold text-foreground">Diversity & Inclusion Score</h3>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Rated highly for maintaining equitable hiring practices and supporting Employee Resource Groups (ERGs).
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pros and Cons */}
        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-foreground mb-6">Pros & Cons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-500">
                <PlusCircle className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Top Pros</h4>
              </div>
              <ul className="space-y-3">
                {company.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="text-xs text-foreground/80 leading-relaxed">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-rose-500">
                <MinusCircle className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Top Cons</h4>
              </div>
              <ul className="space-y-3">
                {company.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span className="text-xs text-foreground/80 leading-relaxed">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Highlighted Reviews */}
        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Highlighted Reviews</h3>
          </div>
          <div className="space-y-4">
            {company.cultureReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl border border-border/50 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-foreground">"{rev.title}"</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold text-foreground">{rev.rating}.0</span>
                    <span className="text-amber-400 text-xs">★</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {rev.text}
                </p>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  — {rev.author}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
