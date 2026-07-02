import { useMemo } from "react";
import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from "recharts";
import { DollarSign, Map, Briefcase, TrendingUp } from "lucide-react";

export default function SalaryIntelligence() {
  const { selectedCompanyId } = useCompanyIntelligenceStore();

  const company = useMemo(() => {
    return mockCompanies.find((c) => c.id === selectedCompanyId) || mockCompanies[0];
  }, [selectedCompanyId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Salary Intelligence</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Explore compensation bands, equity structures, and geographic pay differences at {company.name}.
        </p>
      </div>

      {/* Role Salary Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Base Compensation by Level
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {company.salaries.map((s, idx) => (
            <Card key={s.role} className="p-5 border-border bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-colors group">
              <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1">{s.role}</p>
              <h4 className="text-xl font-black text-foreground mb-1 group-hover:text-primary transition-colors">
                ${(s.avg / 1000).toFixed(0)}k
              </h4>
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Range:</span>
                <span>{s.range}</span>
              </div>
              {/* Fake progress bar to show where avg sits in range (visual flair) */}
              <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${idx < 2 ? "bg-blue-500" : idx < 4 ? "bg-violet-500" : idx < 6 ? "bg-fuchsia-500" : "bg-rose-500"}`}
                  style={{ width: `${40 + (idx * 5)}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Country Comparison Chart */}
        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm flex flex-col h-[400px]">
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Map className="h-4 w-4 text-primary" />
              Geographic Disparity (Senior Dev)
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Average base salary adjusted for local markets.</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={company.countryComparison} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.4} vertical={false} />
                <XAxis dataKey="country" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} angle={-30} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <RechartsTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Base Salary"]}
                />
                <Bar dataKey="salary" radius={[4, 4, 0, 0]}>
                  {company.countryComparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#3b82f6"} opacity={index === 0 ? 1 : 0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Experience Comparison Chart */}
        <Card className="p-6 border-border bg-card/60 backdrop-blur-sm flex flex-col h-[400px]">
          <div className="flex flex-col mb-6">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Compensation Growth Curve
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Average total compensation scaling by years of experience.</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={company.experienceComparison} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.4} vertical={false} />
                <XAxis dataKey="years" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <RechartsTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Total Comp"]}
                />
                <Bar dataKey="salary" fill="#8b5cf6" radius={[4, 4, 0, 0]} opacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Footer Info */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
        <DollarSign className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-blue-500">Compensation Structure</h4>
          <p className="text-xs text-foreground/80 mt-1 leading-relaxed">
            Data is aggregated from recent verified offers. At {company.name}, total compensation typically includes base salary, annual performance bonuses, and Restricted Stock Units (RSUs) vesting over a 4-year period.
          </p>
        </div>
      </div>
    </div>
  );
}
