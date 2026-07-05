import { useBrowserAutomationStore, ApplicationQueueItem, AutomationAction, AutomationNotification } from "@/store/browserAutomationStore";

export const browserAutomationService = {
  startAutomation: async (): Promise<void> => {
    useBrowserAutomationStore.getState().startAutomation();
  },
  
  pauseAutomation: async (): Promise<void> => {
    useBrowserAutomationStore.getState().pauseAutomation();
  },
  
  resumeAutomation: async (): Promise<void> => {
    useBrowserAutomationStore.getState().resumeAutomation();
  },
  
  stopAutomation: async (): Promise<void> => {
    useBrowserAutomationStore.getState().stopAutomation();
  },
  
  retryFailedAutomation: async (): Promise<void> => {
    useBrowserAutomationStore.getState().retryFailedAutomation();
  },

  enqueueApplication: async (app: ApplicationQueueItem): Promise<void> => {
    useBrowserAutomationStore.getState().enqueueApplication(app);
  },

  getAutomationState: async () => {
    // In a real app, this would fetch state from backend
    return useBrowserAutomationStore.getState();
  }
};