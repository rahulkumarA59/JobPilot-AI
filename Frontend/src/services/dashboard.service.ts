import { sleep } from "./api";
import {
  mockApplications, mockDashboardStats, mockActivity, mockWeeklyData
} from "./mockData";
import type { Application, ApplicationStatus } from "@/types";

let applications = [...mockApplications];

export const dashboardService = {
  async getStats() {
    await sleep(600);
    return mockDashboardStats;
  },

  async getActivity() {
    await sleep(500);
    return mockActivity;
  },

  async getWeeklyData() {
    await sleep(400);
    return mockWeeklyData;
  },

  async getApplications(filters?: { status?: ApplicationStatus; search?: string }) {
    await sleep(700);
    let result = [...applications];
    if (filters?.status) result = result.filter(a => a.status === filters.status);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(a =>
        a.jobTitle.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async getApplicationById(id: string) {
    await sleep(400);
    return applications.find(a => a.id === id) ?? null;
  },

  async addApplication(data: Omit<Application, "id" | "lastUpdated">) {
    await sleep(800);
    const newApp: Application = {
      ...data,
      id: "a" + Date.now(),
      lastUpdated: new Date().toISOString(),
    };
    applications = [newApp, ...applications];
    return newApp;
  },

  async updateApplication(id: string, updates: Partial<Application>) {
    await sleep(600);
    applications = applications.map(a =>
      a.id === id ? { ...a, ...updates, lastUpdated: new Date().toISOString() } : a
    );
    return applications.find(a => a.id === id)!;
  },

  async deleteApplication(id: string) {
    await sleep(500);
    applications = applications.filter(a => a.id !== id);
    return { success: true };
  },
};
