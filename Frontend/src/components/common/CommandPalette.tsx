import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Briefcase, Search, FileText, Video, Bell, User, Settings,
  ArrowRight, Zap
} from "lucide-react";
import { useDashboardStore } from "@/store/dashboardStore";

const commands = [
  { label: "Go to Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "G D" },
  { label: "View Applications", href: "/dashboard/applications", icon: Briefcase, shortcut: "G A" },
  { label: "Job Search", href: "/dashboard/jobs", icon: Search, shortcut: "G J" },
  { label: "Resume AI", href: "/dashboard/resume", icon: FileText, shortcut: "G R" },
  { label: "Interviews", href: "/dashboard/interviews", icon: Video, shortcut: "G I" },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User, shortcut: "G P" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useDashboardStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);

  const handleSelect = (href: string) => {
    navigate(href);
    setCommandPaletteOpen(false);
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="rounded-2xl bg-card border border-border shadow-premium overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">ESC</kbd>
              </div>
              <div className="py-2">
                <p className="px-4 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Navigation</p>
                {commands.map((cmd) => (
                  <button
                    key={cmd.href}
                    onClick={() => handleSelect(cmd.href)}
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-left hover:bg-accent transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <cmd.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="flex-1 text-sm">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono hidden group-hover:block">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
              <div className="border-t border-border px-4 py-2.5 flex items-center gap-2 bg-muted/30">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">Powered by AutoHire AI</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
