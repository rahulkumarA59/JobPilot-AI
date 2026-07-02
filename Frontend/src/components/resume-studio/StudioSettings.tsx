import { useState } from "react";
import { motion } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import {
  Settings2, FileText, Shield, Eye, Download, Palette, Check, Save
} from "lucide-react";
import { toast } from "sonner";

export default function StudioSettings() {
  const { selectedTemplate, setSelectedTemplate, versions, activeVersionId } = useResumeStudioStore();
  const [defaultResume, setDefaultResume] = useState(activeVersionId);
  const [privacy, setPrivacy] = useState("private");
  const [visibility, setVisibility] = useState("recruiters");
  const [exportQuality, setExportQuality] = useState("high");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Resume Studio settings saved successfully!");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Studio Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure your Resume Studio preferences and defaults.</p>
      </div>

      {/* Default Resume */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Default Resume Version</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Select which version to use as your primary resume for applications.</p>
          <select
            value={defaultResume}
            onChange={(e) => setDefaultResume(e.target.value)}
            className="w-full px-3 py-2.5 bg-muted/40 border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>{v.name} (ATS: {v.atsScore}%)</option>
            ))}
          </select>
        </Card>
      </motion.div>

      {/* Privacy */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-green-500" />
            <h3 className="text-sm font-bold text-foreground">Privacy Settings</h3>
          </div>
          <div className="space-y-3">
            {[
              { value: "private", label: "Private", desc: "Only you can access your resume" },
              { value: "link", label: "Link Access", desc: "Anyone with the link can view" },
              { value: "public", label: "Public", desc: "Visible to all recruiters on the platform" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  privacy === opt.value ? "border-primary bg-primary/5" : "border-border hover:bg-accent/30"
                }`}
              >
                <input
                  type="radio"
                  name="privacy"
                  value={opt.value}
                  checked={privacy === opt.value}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="sr-only"
                />
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  privacy === opt.value ? "border-primary" : "border-border"
                }`}>
                  {privacy === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground">{opt.label}</span>
                  <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Visibility */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold text-foreground">Visibility Preferences</h3>
          </div>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full px-3 py-2.5 bg-muted/40 border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          >
            <option value="recruiters">Visible to Recruiters Only</option>
            <option value="everyone">Visible to Everyone</option>
            <option value="connections">Visible to Connections Only</option>
            <option value="hidden">Hidden from Search</option>
          </select>
        </Card>
      </motion.div>

      {/* Export Quality */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Download className="h-4 w-4 text-violet-500" />
            <h3 className="text-sm font-bold text-foreground">Export Settings</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "draft", label: "Draft", desc: "Fast export, lower quality" },
              { value: "standard", label: "Standard", desc: "Balanced quality and size" },
              { value: "high", label: "High Quality", desc: "Best for printing" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setExportQuality(opt.value)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  exportQuality === opt.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:bg-accent/30"
                }`}
              >
                <p className="text-xs font-bold text-foreground">{opt.label}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Template Preference */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">Template Preferences</h3>
          </div>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-3 py-2.5 bg-muted/40 border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition capitalize"
          >
            {["minimal", "professional", "google", "microsoft", "startup", "executive", "dark", "academic", "creative"].map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            saved
              ? "bg-green-500/10 text-green-600 border border-green-500/20"
              : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] shadow-glow"
          }`}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Settings Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
