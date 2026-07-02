import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import type { ApplicationStatus } from "@/types";

// ─── Class utility ──────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date utilities ──────────────────────────────────────────────────────────

export function formatDate(date: string | Date, formatStr = "MMM d, yyyy"): string {
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, formatStr);
  } catch {
    return "Invalid date";
  }
}

export function timeAgo(date: string | Date): string {
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "Unknown time";
  }
}

// ─── Number utilities ─────────────────────────────────────────────────────────

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryRange(min: number, max: number, currency = "USD"): string {
  return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
}

// ─── Status utilities ─────────────────────────────────────────────────────────

export function getStatusColor(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    applied: "status-applied",
    screening: "status-pending",
    interview: "status-interview",
    offer: "status-offer",
    rejected: "status-rejected",
    pending: "status-pending",
    withdrawn: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20",
  };
  return map[status] ?? "status-pending";
}

export function getStatusLabel(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    applied: "Applied",
    screening: "Screening",
    interview: "Interview",
    offer: "Offer Received",
    rejected: "Rejected",
    pending: "Pending",
    withdrawn: "Withdrawn",
  };
  return map[status] ?? "Unknown";
}

export function getStatusIcon(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    applied: "Send",
    screening: "Eye",
    interview: "Video",
    offer: "Gift",
    rejected: "XCircle",
    pending: "Clock",
    withdrawn: "MinusCircle",
  };
  return map[status] ?? "Circle";
}

// ─── String utilities ─────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Validation utilities ────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 0, label: "Very Weak", color: "text-red-500" },
    { score: 1, label: "Weak", color: "text-orange-500" },
    { score: 2, label: "Fair", color: "text-yellow-500" },
    { score: 3, label: "Good", color: "text-blue-500" },
    { score: 4, label: "Strong", color: "text-green-500" },
    { score: 5, label: "Very Strong", color: "text-emerald-500" },
  ];

  return levels[score] ?? levels[0];
}

// ─── Storage utilities ───────────────────────────────────────────────────────

export function getLocalStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("Failed to save to localStorage");
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.error("Failed to remove from localStorage");
  }
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const group = String(item[key]);
    return { ...groups, [group]: [...(groups[group] ?? []), item] };
  }, {} as Record<string, T[]>);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
