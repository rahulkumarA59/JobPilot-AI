import { sleep } from "./api";
import { mockProfile } from "./mockData";
import type { UserProfile } from "@/types";

let profile = { ...mockProfile };

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    await sleep(600);
    return { ...profile };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await sleep(800);
    profile = { ...profile, ...updates };
    return { ...profile };
  },

  async uploadAvatar(_file: File): Promise<{ avatarUrl: string }> {
    await sleep(1200);
    return { avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + Date.now() };
  },

  async uploadResume(_file: File): Promise<{ resumeUrl: string; score: number }> {
    await sleep(2000);
    return { resumeUrl: "/resume-updated.pdf", score: Math.floor(Math.random() * 20) + 75 };
  },

  async getResumeScore(): Promise<{ atsScore: number; resumeScore: number; suggestions: string[] }> {
    await sleep(800);
    return {
      atsScore: profile.atsScore,
      resumeScore: profile.resumeScore,
      suggestions: [
        "Add more quantifiable achievements to your experience section",
        "Include relevant keywords: 'distributed systems', 'microservices', 'CI/CD'",
        "Your skills section is missing trending technologies like Kubernetes",
        "Add a professional summary at the top of your resume",
      ],
    };
  },
};
