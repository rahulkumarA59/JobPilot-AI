import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockNotifications } from "@/services/companyIntelligenceData";
import { CompanyNotification } from "@/types/companyIntelligence";

export type IntelligenceTab =
  | "explorer"
  | "details"
  | "hiring"
  | "salary"
  | "interview"
  | "skills"
  | "culture"
  | "ai-analysis"
  | "compare"
  | "favorites"
  | "dashboard"
  | "notifications";

export interface CompanyFilters {
  industry: string;
  location: string;
  remotePolicy: string;
  hiringStatus: string;
  size: string;
  salaryMin: number;
  techStack: string[];
}

interface CompanyIntelligenceStore {
  activeTab: IntelligenceTab;
  setActiveTab: (tab: IntelligenceTab) => void;
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  
  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: CompanyFilters;
  setFilters: (filters: Partial<CompanyFilters>) => void;
  resetFilters: () => void;

  // Comparison State
  compareCompanyIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;

  // Bookmark / Favorites State
  bookmarkedCompanyIds: string[];
  toggleBookmark: (id: string) => void;
  collections: Record<string, string[]>; // collectionName -> companyIds
  addToCollection: (collection: string, id: string) => void;
  removeFromCollection: (collection: string, id: string) => void;

  // Viewed History State
  viewedCompanyIds: string[];
  addViewedCompany: (id: string) => void;
  clearViewedHistory: () => void;

  // Notifications State
  notifications: CompanyNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const initialFilters: CompanyFilters = {
  industry: "All",
  location: "All",
  remotePolicy: "All",
  hiringStatus: "All",
  size: "All",
  salaryMin: 0,
  techStack: [],
};

export const useCompanyIntelligenceStore = create<CompanyIntelligenceStore>()(
  persist(
    (set) => ({
      activeTab: "explorer",
      setActiveTab: (activeTab) => set({ activeTab }),
      selectedCompanyId: "google",
      setSelectedCompanyId: (selectedCompanyId) =>
        set((state) => {
          // Auto add to viewed history
          const viewed = state.viewedCompanyIds.filter((id) => id !== selectedCompanyId);
          return {
            selectedCompanyId,
            viewedCompanyIds: [selectedCompanyId, ...viewed].slice(0, 10), // keep latest 10
          };
        }),

      searchQuery: "",
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      filters: initialFilters,
      setFilters: (newFilters) => set((s) => ({ filters: { ...s.filters, ...newFilters } })),
      resetFilters: () => set({ filters: initialFilters, searchQuery: "" }),

      compareCompanyIds: ["google", "microsoft"],
      addToCompare: (id) =>
        set((s) => {
          if (s.compareCompanyIds.includes(id)) return s;
          // Keep max 2 companies for split comparison
          const next = [...s.compareCompanyIds, id].slice(-2);
          return { compareCompanyIds: next };
        }),
      removeFromCompare: (id) =>
        set((s) => ({
          compareCompanyIds: s.compareCompanyIds.filter((cid) => cid !== id),
        })),
      clearCompare: () => set({ compareCompanyIds: [] }),

      bookmarkedCompanyIds: ["google", "openai", "nvidia"],
      toggleBookmark: (id) =>
        set((s) => {
          const exists = s.bookmarkedCompanyIds.includes(id);
          const nextBookmarks = exists
            ? s.bookmarkedCompanyIds.filter((bid) => bid !== id)
            : [...s.bookmarkedCompanyIds, id];
          return { bookmarkedCompanyIds: nextBookmarks };
        }),

      collections: {
        "Dream Companies": ["google", "openai", "nvidia", "meta"],
        "Target List": ["microsoft", "apple", "amazon"],
      },
      addToCollection: (collection, id) =>
        set((s) => {
          const current = s.collections[collection] || [];
          if (current.includes(id)) return s;
          return {
            collections: {
              ...s.collections,
              [collection]: [...current, id],
            },
          };
        }),
      removeFromCollection: (collection, id) =>
        set((s) => {
          const current = s.collections[collection] || [];
          return {
            collections: {
              ...s.collections,
              [collection]: current.filter((cid) => cid !== id),
            },
          };
        }),

      viewedCompanyIds: ["google", "microsoft", "openai"],
      addViewedCompany: (id) =>
        set((s) => {
          const filtered = s.viewedCompanyIds.filter((vid) => vid !== id);
          return { viewedCompanyIds: [id, ...filtered].slice(0, 10) };
        }),
      clearViewedHistory: () => set({ viewedCompanyIds: [] }),

      notifications: mockNotifications,
      markNotificationAsRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        })),
      markAllNotificationsAsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
        })),
    }),
    {
      name: "autohire-company-intelligence",
      partialize: (s) => ({
        selectedCompanyId: s.selectedCompanyId,
        compareCompanyIds: s.compareCompanyIds,
        bookmarkedCompanyIds: s.bookmarkedCompanyIds,
        collections: s.collections,
        viewedCompanyIds: s.viewedCompanyIds,
        notifications: s.notifications,
      }),
    }
  )
);
