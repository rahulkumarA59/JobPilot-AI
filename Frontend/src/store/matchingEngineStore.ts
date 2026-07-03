import { create } from 'zustand';

export interface SkillMatchInfo {
  name: string;
  status: 'matched' | 'missing' | 'extra';
  importance: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  learningTime: string;
  resources: string[];
}

export interface AISuggestion {
  id: string;
  category: 'Summary' | 'Experience' | 'Projects' | 'Skills' | 'Keywords' | 'ATS';
  title: string;
  suggestion: string;
  expectedAtsIncrease: number;
  priority: 'High' | 'Medium' | 'Low';
  applied: boolean;
}

export interface SimilarJob {
  id: string;
  title: string;
  company: string;
  reason: string;
  matchPercent: number;
  salary: string;
  location: string;
  applyStatus: 'Apply' | 'Applied' | 'Saved';
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  company: string;
  role: string;
  matchPercent: number;
  atsScore: number;
  isBest?: boolean;
  isLowest?: boolean;
}

export interface MatchState {
  overallMatchPercent: number;
  atsScore: number;
  skillMatchScore: number;
  experienceMatchScore: number;
  educationMatchScore: number;
  locationMatchScore: number;
  salaryMatchScore: number;
  confidenceScore: number;
  
  resumeText: string;
  jobDescriptionText: string;
  
  skillsList: SkillMatchInfo[];
  aiSuggestions: AISuggestion[];
  similarJobs: SimilarJob[];
  history: MatchHistoryItem[];
  
  confidenceReasoning: string[];
}

interface MatchingEngineState {
  currentMatch: MatchState | null;
  history: MatchHistoryItem[];
  suggestions: AISuggestion[];
  selectedJobId: string | null;
  isLoading: boolean;
  
  // Actions
  calculateMatch: (resumeText: string, jdText: string) => Promise<void>;
  applySuggestion: (id: string) => void;
  setHistory: (history: MatchHistoryItem[]) => void;
  setSelectedJobId: (id: string | null) => void;
  resetMatch: () => void;
}

const initialHistory: MatchHistoryItem[] = [
  { id: 'h1', date: '2026-06-25', company: 'Google', role: 'Senior React Developer', matchPercent: 88, atsScore: 85, isBest: true },
  { id: 'h2', date: '2026-06-21', company: 'Netflix', role: 'Full Stack Engineer', matchPercent: 74, atsScore: 71 },
  { id: 'h3', date: '2026-06-18', company: 'Uber', role: 'Frontend Engineer', matchPercent: 55, atsScore: 50, isLowest: true },
  { id: 'h4', date: '2026-06-12', company: 'Stripe', role: 'UI Developer', matchPercent: 81, atsScore: 79 },
];

const mockSkills: SkillMatchInfo[] = [
  { name: 'React 19', status: 'matched', importance: 'High', difficulty: 'Medium', learningTime: '2 hours', resources: [] },
  { name: 'TypeScript', status: 'matched', importance: 'High', difficulty: 'Easy', learningTime: '1 hour', resources: [] },
  { name: 'Zustand', status: 'matched', importance: 'Medium', difficulty: 'Easy', learningTime: '30 mins', resources: [] },
  { name: 'Next.js 15', status: 'missing', importance: 'High', difficulty: 'Medium', learningTime: '5 hours', resources: ['Next.js App Router Masterclass', 'Next.js Official Docs'] },
  { name: 'GraphQL', status: 'missing', importance: 'Medium', difficulty: 'Medium', learningTime: '4 hours', resources: ['GraphQL Fundamentals on egghead.io', 'Apollo GraphQL Tutorials'] },
  { name: 'Docker', status: 'missing', importance: 'Medium', difficulty: 'Hard', learningTime: '8 hours', resources: ['Docker for Beginners', 'Dockerizing Node-React Architectures'] },
  { name: 'Tailwind CSS', status: 'matched', importance: 'High', difficulty: 'Easy', learningTime: '1 hour', resources: [] },
  { name: 'Redux Toolkit', status: 'extra', importance: 'Low', difficulty: 'Medium', learningTime: '3 hours', resources: [] },
  { name: 'Framer Motion', status: 'extra', importance: 'Low', difficulty: 'Easy', learningTime: '2 hours', resources: [] },
];

const mockSuggestions: AISuggestion[] = [
  {
    id: 'sug1',
    category: 'Summary',
    title: 'Focus on React 19 Upgrade',
    suggestion: 'Rewrite your professional summary to explicitly mention migrating frontend enterprise applications to React 19 to align with the company JD.',
    expectedAtsIncrease: 8,
    priority: 'High',
    applied: false,
  },
  {
    id: 'sug2',
    category: 'Experience',
    title: 'Add Docker deployment containerization',
    suggestion: 'Incorporate Docker experience inside your last project description. Describe how you containerized microservices to scale deployments.',
    expectedAtsIncrease: 12,
    priority: 'High',
    applied: false,
  },
  {
    id: 'sug3',
    category: 'Projects',
    title: 'GraphQL API Integration project',
    suggestion: 'Highlight dynamic GraphQL endpoints inside your Realtime Dashboard portfolio project to address missing API requirements.',
    expectedAtsIncrease: 5,
    priority: 'Medium',
    applied: false,
  },
  {
    id: 'sug4',
    category: 'Keywords',
    title: 'Add ATS-friendly action verbs',
    suggestion: 'Replace passive phrases like "worked on UI improvements" with powerful ATS keywords like "Engineered performant, responsive single page interfaces".',
    expectedAtsIncrease: 6,
    priority: 'Medium',
    applied: false,
  },
];

const mockSimilarJobs: SimilarJob[] = [
  { id: 'sj1', title: 'Senior Frontend Architect', company: 'Vercel', reason: 'High alignment with your React 19 & Framer Motion skills.', matchPercent: 91, salary: '$160k - $190k', location: 'Remote, US', applyStatus: 'Apply' },
  { id: 'sj2', title: 'React Core Engineer', company: 'Meta', reason: 'Excellent core React framework expertise compatibility.', matchPercent: 86, salary: '$180k - $210k', location: 'Menlo Park, CA', applyStatus: 'Saved' },
  { id: 'sj3', title: 'Senior UI Platform Developer', company: 'Airbnb', reason: 'Tailwind and complex state management focus match.', matchPercent: 84, salary: '$150k - $175k', location: 'San Francisco, CA', applyStatus: 'Apply' },
];

export const useMatchingEngineStore = create<MatchingEngineState>((set, get) => ({
  currentMatch: null,
  history: initialHistory,
  suggestions: mockSuggestions,
  selectedJobId: null,
  isLoading: false,

  calculateMatch: async (resumeText, jdText) => {
    set({ isLoading: true });
    // Simulate complex AI indexing calculation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Create random realistic response matching resumeText & jdText length
    const overallMatchPercent = Math.floor(Math.random() * 25) + 65; // 65-90%
    const atsScore = Math.floor(overallMatchPercent * 0.95);
    const skillMatchScore = Math.floor(Math.random() * 20) + 70;
    const experienceMatchScore = Math.floor(Math.random() * 30) + 60;
    const educationMatchScore = 90;
    const locationMatchScore = 100;
    const salaryMatchScore = 80;
    const confidenceScore = Math.floor((overallMatchPercent + atsScore + skillMatchScore) / 3);

    const calculatedMatch: MatchState = {
      overallMatchPercent,
      atsScore,
      skillMatchScore,
      experienceMatchScore,
      educationMatchScore,
      locationMatchScore,
      salaryMatchScore,
      confidenceScore,
      resumeText,
      jobDescriptionText: jdText,
      skillsList: mockSkills,
      aiSuggestions: mockSuggestions,
      similarJobs: mockSimilarJobs,
      history: get().history,
      confidenceReasoning: [
        'Strong React 19 migration and framework mechanics demonstrated.',
        'TypeScript interfaces and compile safety match enterprise requirements.',
        'Docker containerization pipelines and orchestration missing from professional experience.',
        'GraphQL queries and Apollo client caching integration partially matches the platform requirements.'
      ]
    };

    const newHistoryItem: MatchHistoryItem = {
      id: `h_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      company: 'Interactive Match Engine',
      role: 'Frontend Engineer Profile',
      matchPercent: overallMatchPercent,
      atsScore,
    };

    set({
      currentMatch: calculatedMatch,
      history: [newHistoryItem, ...get().history],
      isLoading: false
    });
  },

  applySuggestion: (id) => {
    set((state) => {
      if (!state.currentMatch) return {};
      
      const updatedSuggestions = state.currentMatch.aiSuggestions.map((s) =>
        s.id === id ? { ...s, applied: true } : s
      );

      // Boost score upon applying mock modifications
      const appliedItem = state.currentMatch.aiSuggestions.find(s => s.id === id);
      const pointsGain = appliedItem && !appliedItem.applied ? appliedItem.expectedAtsIncrease : 0;
      
      const newAtsScore = Math.min(100, state.currentMatch.atsScore + pointsGain);
      const newOverall = Math.min(100, state.currentMatch.overallMatchPercent + Math.round(pointsGain * 0.8));

      return {
        currentMatch: {
          ...state.currentMatch,
          aiSuggestions: updatedSuggestions,
          atsScore: newAtsScore,
          overallMatchPercent: newOverall
        }
      };
    });
  },

  setHistory: (history) => set({ history }),
  setSelectedJobId: (selectedJobId) => set({ selectedJobId }),
  resetMatch: () => set({ currentMatch: null })
}));