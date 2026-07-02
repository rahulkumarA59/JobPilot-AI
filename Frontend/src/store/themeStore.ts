import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types";
import { THEME_STORAGE_KEY } from "@/constants";

interface ThemeStore {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      resolvedTheme: "dark",
      setTheme: (theme) => {
        const resolvedTheme = applyTheme(theme);
        set({ theme, resolvedTheme });
      },
      toggleTheme: () => {
        const current = get().resolvedTheme;
        const next: Theme = current === "dark" ? "light" : "dark";
        const resolvedTheme = applyTheme(next);
        set({ theme: next, resolvedTheme });
      },
    }),
    { name: THEME_STORAGE_KEY, partialize: (s) => ({ theme: s.theme }) }
  )
);
