import { useState } from "react";
import { motion } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import { Heart, Eye, Check, Palette, Star, Grid3x3 } from "lucide-react";

const templates = [
  { id: "minimal", name: "Minimal", category: "Modern", colors: ["#0f172a", "#f8fafc", "#3b82f6"], description: "Clean lines, maximum readability. Perfect for tech roles." },
  { id: "professional", name: "Professional", category: "Classic", colors: ["#1e293b", "#ffffff", "#6366f1"], description: "Timeless layout trusted by Fortune 500 recruiters." },
  { id: "google", name: "Google Style", category: "Tech", colors: ["#202124", "#ffffff", "#4285f4"], description: "Inspired by Google's Material Design language." },
  { id: "microsoft", name: "Microsoft Style", category: "Corporate", colors: ["#1a1a2e", "#f5f5f5", "#0078d4"], description: "Enterprise-ready layout with structured sections." },
  { id: "startup", name: "Startup", category: "Modern", colors: ["#0d1117", "#f0f6fc", "#8b5cf6"], description: "Bold, dynamic layout for fast-moving startup culture." },
  { id: "executive", name: "Executive", category: "Premium", colors: ["#1c1917", "#fafaf9", "#d97706"], description: "Sophisticated design for C-suite and leadership roles." },
  { id: "dark", name: "Dark Theme", category: "Creative", colors: ["#09090b", "#18181b", "#a78bfa"], description: "Stunning dark mode design that stands out immediately." },
  { id: "academic", name: "Academic", category: "Traditional", colors: ["#1e3a5f", "#ffffff", "#2563eb"], description: "Research-focused layout with publication support." },
  { id: "creative", name: "Creative", category: "Design", colors: ["#0c0a09", "#fafaf9", "#f43f5e"], description: "Expressive design for UX designers and creative roles." },
];

export default function ResumeTemplates() {
  const { selectedTemplate, setSelectedTemplate } = useResumeStudioStore();
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["minimal", "startup"]));
  const [filter, setFilter] = useState("All");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(templates.map((t) => t.category)))];
  const filtered = filter === "All" ? templates : templates.filter((t) => t.category === filter);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Resume Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose from 9 professionally designed templates.</p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === c ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tmpl, i) => {
          const isActive = selectedTemplate === tmpl.id;
          return (
            <motion.div
              key={tmpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Card className={`overflow-hidden group hover:shadow-lg transition-all duration-300 ${isActive ? "ring-2 ring-primary shadow-glow" : ""}`}>
                {/* Preview Area */}
                <div
                  className="h-48 relative overflow-hidden cursor-pointer"
                  onClick={() => setPreviewId(previewId === tmpl.id ? null : tmpl.id)}
                  style={{
                    background: `linear-gradient(135deg, ${tmpl.colors[0]} 0%, ${tmpl.colors[1]} 50%, ${tmpl.colors[0]} 100%)`,
                  }}
                >
                  {/* Mock Resume Lines */}
                  <div className="absolute inset-4 flex flex-col gap-2 opacity-60">
                    <div className="h-3 rounded-sm" style={{ backgroundColor: tmpl.colors[2], width: "60%" }} />
                    <div className="h-1.5 rounded-sm" style={{ backgroundColor: tmpl.colors[1], width: "40%", opacity: 0.4 }} />
                    <div className="mt-2 space-y-1.5">
                      {[80, 100, 70, 90, 60, 85, 45].map((w, idx) => (
                        <div key={idx} className="h-1 rounded-sm" style={{ backgroundColor: tmpl.colors[1], width: `${w}%`, opacity: 0.25 }} />
                      ))}
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="h-2 rounded-sm" style={{ backgroundColor: tmpl.colors[2], width: "35%", opacity: 0.5 }} />
                      {[90, 75, 100, 65].map((w, idx) => (
                        <div key={idx} className="h-1 rounded-sm" style={{ backgroundColor: tmpl.colors[1], width: `${w}%`, opacity: 0.2 }} />
                      ))}
                    </div>
                  </div>

                  {/* Active Badge */}
                  {isActive && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-extrabold flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Active
                    </div>
                  )}

                  {/* Preview Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2">
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{tmpl.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{tmpl.category}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(tmpl.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        favorites.has(tmpl.id)
                          ? "text-red-500 bg-red-500/10"
                          : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(tmpl.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tmpl.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {tmpl.colors.map((c, ci) => (
                        <div key={ci} className="h-4 w-4 rounded-full border-2 border-card" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div className="flex-1" />
                    <button
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {isActive ? "Applied" : "Apply Template"}
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
