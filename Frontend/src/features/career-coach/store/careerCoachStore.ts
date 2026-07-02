import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockChatHistory, mockResources, mockCodingChallenges } from "../mock/careerCoachData";
import { ChatMessage, ResourceItem, CodingChallenge } from "../types";

export type CoachTab =
  | "dashboard"
  | "path"
  | "skill-gap"
  | "mission"
  | "planner"
  | "skill-tree"
  | "projects"
  | "company-prep"
  | "mentor"
  | "analytics"
  | "achievements"
  | "library"
  | "recommendations"
  | "dsa-roadmap"
  | "system-design"
  | "interview"
  | "coding";

interface CareerCoachStore {
  activeTab: CoachTab;
  setActiveTab: (tab: CoachTab) => void;

  // AI Mentor Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // Resource Library
  resources: ResourceItem[];
  toggleResourceBookmark: (id: string) => void;

  // Coding Practice
  codingChallenges: CodingChallenge[];
  toggleChallengeBookmark: (id: string) => void;
  updateChallengeStatus: (id: string, status: "Solved" | "Attempted" | "Unsolved") => void;

  // Progress/Gamification (simplified for store)
  xp: number;
  addXP: (amount: number) => void;
}

export const useCareerCoachStore = create<CareerCoachStore>()(
  persist(
    (set) => ({
      activeTab: "dashboard",
      setActiveTab: (activeTab) => set({ activeTab }),

      chatMessages: mockChatHistory,
      addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
      clearChat: () => set({ chatMessages: [] }),

      resources: mockResources,
      toggleResourceBookmark: (id) =>
        set((s) => ({
          resources: s.resources.map((r) =>
            r.id === id ? { ...r, bookmarked: !r.bookmarked } : r
          ),
        })),

      codingChallenges: mockCodingChallenges,
      toggleChallengeBookmark: (id) =>
        set((s) => ({
          codingChallenges: s.codingChallenges.map((c) =>
            c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c
          ),
        })),
      updateChallengeStatus: (id, status) =>
        set((s) => ({
          codingChallenges: s.codingChallenges.map((c) =>
            c.id === id ? { ...c, status } : c
          ),
        })),

      xp: 4520,
      addXP: (amount) => set((s) => ({ xp: s.xp + amount })),
    }),
    {
      name: "autohire-career-coach",
      partialize: (s) => ({
        activeTab: s.activeTab,
        chatMessages: s.chatMessages,
        resources: s.resources,
        codingChallenges: s.codingChallenges,
        xp: s.xp,
      }),
    }
  )
);
