import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, Search, FileText, Video, Bell, User, Settings,
  ChevronLeft, ChevronRight, Zap, LogOut, Crown, Bot, Sparkles, Building2
} from "lucide-react";
import { cn } from "@/utils";
import { useAuthStore } from "@/store/authStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/agent", label: "AI Agent", icon: Bot },
  { href: "/dashboard/resume-studio", label: "AI Resume Studio", icon: Sparkles },
  { href: "/dashboard/company-intelligence", label: "Company Intelligence", icon: Building2 },
  { href: "/dashboard/applications", label: "Applications", icon: Briefcase },
  { href: "/dashboard/jobs", label: "Job Search", icon: Search },
  { href: "/dashboard/resume", label: "Resume AI", icon: FileText },
  { href: "/dashboard/interviews", label: "Interviews", icon: Video },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: true },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar } = useDashboardStore();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col h-screen bg-card border-r border-border relative z-30 shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-border", isSidebarCollapsed && "justify-center px-2")}>
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0 shadow-glow">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <span className="font-bold text-base gradient-text">AutoHire AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                whileHover={{ x: isSidebarCollapsed ? 0 : 4 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer relative group",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isSidebarCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <AnimatePresence>
                  {!isSidebarCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && unreadCount > 0 && (
                  <span className={cn("bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center", isSidebarCollapsed ? "absolute -top-1 -right-1 h-4 w-4" : "h-5 w-5 ml-auto")}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-popover border border-border rounded-lg text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-premium z-50">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Plan badge */}
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-violet-600/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-foreground">Pro Plan</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Unlimited AI applications</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User */}
      <div className={cn("flex items-center gap-3 px-3 py-4 border-t border-border", isSidebarCollapsed && "justify-center px-2")}>
        <Avatar src={user?.avatar} name={user?.name ?? ""} size="sm" />
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={logout} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute top-[72px] -right-3 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-sm z-40"
      >
        {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </motion.aside>
  );
}
