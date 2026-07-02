import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Sun, Moon, Command, ChevronDown, Settings, User, LogOut, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { timeAgo } from "@/utils";

export function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead, setOpen, isOpen } = useNotificationStore();
  const { setCommandPaletteOpen } = useDashboardStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-6 py-3 bg-background/80 backdrop-blur-lg border-b border-border">
      {/* Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2 flex-1 max-w-md h-9 px-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm hover:border-primary/40 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-background border border-border text-[10px] font-mono">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label="Toggle theme">
          {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(!isOpen)} aria-label="Notifications" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
          <AnimatePresence>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-96 z-40 rounded-2xl bg-card border border-border shadow-premium overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`flex gap-3 px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-accent transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}
                      >
                        <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${!n.isRead ? "bg-blue-500" : "bg-transparent"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{n.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                          <p className="text-[11px] text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/dashboard/notifications" onClick={() => setOpen(false)} className="block text-center py-3 text-xs text-primary hover:underline font-medium">
                    View all notifications
                  </Link>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent transition-colors"
          >
            <Avatar src={user?.avatar} name={user?.name ?? ""} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Crown className="h-3 w-3 text-amber-400" />
                <p className="text-[11px] text-muted-foreground capitalize">{user?.plan}</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-56 z-40 rounded-2xl bg-card border border-border shadow-premium overflow-hidden py-1"
                >
                  <div className="px-3 py-2.5 border-b border-border">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  {[
                    { icon: User, label: "Profile", href: "/dashboard/profile" },
                    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
                  ].map((item) => (
                    <Link key={item.href} to={item.href} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-accent transition-colors">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
