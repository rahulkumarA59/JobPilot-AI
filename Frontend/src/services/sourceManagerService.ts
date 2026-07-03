import { JobSource } from "@/store/sourceManagerStore";

export const sourceManagerService = {
  getSources: async (): Promise<JobSource[]> => {
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return []; // We manage live list inside state, but service mocks API
  },
  
  updateSource: async (id: string, updates: Partial<JobSource>): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
  
  scanSource: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }
};