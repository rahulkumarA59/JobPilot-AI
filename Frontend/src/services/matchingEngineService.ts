import { useMatchingEngineStore, AISuggestion, MatchHistoryItem } from '@/store/matchingEngineStore';

export const matchingEngineService = {
  calculateMatch: async (resumeText: string, jdText: string): Promise<void> => {
    await useMatchingEngineStore.getState().calculateMatch(resumeText, jdText);
  },
  
  getSuggestions: async (): Promise<AISuggestion[]> => {
    return useMatchingEngineStore.getState().suggestions;
  },
  
  getHistory: async (): Promise<MatchHistoryItem[]> => {
    return useMatchingEngineStore.getState().history;
  }
};