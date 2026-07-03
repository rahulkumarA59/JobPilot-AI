import { useCoverLetterStore } from '@/store/coverLetterStore';

export const coverLetterService = {
  generateLetter: async (): Promise<void> => {
    await useCoverLetterStore.getState().generateLetter();
  },
  
  improveLetter: async (instruction: string): Promise<void> => {
    await useCoverLetterStore.getState().improveLetter(instruction);
  },
  
  exportLetter: async (format: 'pdf' | 'docx' | 'markdown' | 'copy'): Promise<void> => {
    // Simulated export logic
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Exported in ${format} format.`);
  }
};