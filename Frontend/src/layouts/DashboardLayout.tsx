import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/common/Sidebar";
import { DashboardHeader } from "@/components/common/DashboardHeader";
import { CommandPalette } from "@/components/common/CommandPalette";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(theme);
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
