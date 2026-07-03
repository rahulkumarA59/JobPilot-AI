import { create } from 'zustand';

export interface LetterVersion {
  id: string;
  timestamp: string;
  content: string;
  style: WritingStyle;
  analytics: LetterAnalytics;
}

export type WritingStyle = 'Professional' | 'Friendly' | 'Corporate' | 'Startup' | 'Executive' | 'Formal';

export interface LetterAnalytics {
  readability: number;
  atsScore: number;
  keywordDensity: number;
  grammar: number;
  length: number;
  professionalScore: number;
}

export interface CoverLetterState {
  company: string;
  role: string;
  department: string;
  location: string;
  hiringManager: string;
  jobDescription: string;
  
  currentLetter: string;
  currentStyle: WritingStyle;
  history: LetterVersion[];
  suggestions: string[];
  reasoning: { paragraph: number; explanation: string }[];
  
  isGenerating: boolean;
  isSaving: boolean;
  
  // Actions
  setField: (field: 'company' | 'role' | 'department' | 'location' | 'hiringManager' | 'jobDescription', value: string) => void;
  setCurrentLetter: (content: string) => void;
  setStyle: (style: WritingStyle) => void;
  generateLetter: () => Promise<void>;
  improveLetter: (instruction: string) => Promise<void>;
  restoreVersion: (id: string) => void;
  deleteVersion: (id: string) => void;
}

const mockReasoning = [
  { paragraph: 1, explanation: "Standard formal opening, directly addressing the hiring manager and clearly stating the intent to apply for the Senior React Role." },
  { paragraph: 2, explanation: "Company-specific alignment paragraph. Leverages insights from Company Intelligence to mention their recent React 19 migration efforts." },
  { paragraph: 3, explanation: "Technical core competency highlight. Maps candidate's TypeScript and state management expertise to the specific JD requirements." },
  { paragraph: 4, explanation: "Impact and value proposition. Focuses on 'Executive' style outcomes like reducing delivery cycles and improving system performance." }
];

export const useCoverLetterStore = create<CoverLetterState>((set, get) => ({
  company: 'Linear',
  role: 'Senior Frontend Engineer',
  department: 'Product Engineering',
  location: 'Remote, US',
  hiringManager: 'Sarah Chen',
  jobDescription: 'Seeking a seasoned React developer to build high-performance project management tools...',
  
  currentLetter: '',
  currentStyle: 'Professional',
  history: [],
  suggestions: [
    'Mention your recent work with Framer Motion to match Linear\'s focus on high-quality animations.',
    'Strengthen the opening statement by quantifying your React 19 migration experience.',
    'Include more keywords related to "Performance Optimization" and "State Architectures".'
  ],
  reasoning: mockReasoning,
  
  isGenerating: false,
  isSaving: false,

  setField: (field, value) => set({ [field]: value }),
  
  setCurrentLetter: (content) => set({ currentLetter: content }),
  
  setStyle: (style) => set({ currentStyle: style }),

  generateLetter: async () => {
    set({ isGenerating: true });
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const { company, role, hiringManager, currentStyle } = get();
    const generatedContent = `Dear ${hiringManager},

I am writing to express my strong interest in the ${role} position at ${company}. Having followed ${company}'s journey in redefining project management interfaces, I am impressed by your commitment to speed and craft.

In my previous roles, I have specialized in building performant frontend architectures. My recent transition to React 19 allowed me to leverage concurrent rendering to improve UI responsiveness by 30%. I believe my expertise in TypeScript and state orchestration aligns perfectly with your engineering culture.

I am particularly excited about the prospect of bringing my experience in motion design and accessible interfaces to your team. Thank you for your time and consideration.

Best regards,
Candidate Name`;

    const newVersion: LetterVersion = {
      id: `v_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      content: generatedContent,
      style: currentStyle,
      analytics: {
        readability: 88,
        atsScore: 92,
        keywordDensity: 12,
        grammar: 95,
        length: 245,
        professionalScore: 90
      }
    };

    set({ 
      currentLetter: generatedContent, 
      history: [newVersion, ...get().history],
      isGenerating: false 
    });
  },

  improveLetter: async (instruction) => {
    set({ isGenerating: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const current = get().currentLetter;
    const improvedContent = current + `\n\n[AI Adjustment: Applied ${instruction}]`;
    
    set({ 
      currentLetter: improvedContent,
      isGenerating: false 
    });
  },

  restoreVersion: (id) => {
    const version = get().history.find(v => v.id === id);
    if (version) {
      set({ currentLetter: version.content, currentStyle: version.style });
    }
  },

  deleteVersion: (id) => {
    set({ history: get().history.filter(v => v.id !== id) });
  }
}));