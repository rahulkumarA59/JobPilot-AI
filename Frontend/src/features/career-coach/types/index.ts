// Career Coach Global Types

export type SkillCategory = "Programming" | "Frontend" | "Backend" | "Database" | "Cloud" | "DevOps" | "AI" | "Soft Skills";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
export type ProjectType = "Industry Level" | "Startup Level" | "Open Source";

// 1. Personalized Career Path
export interface CareerPath {
  role: string;
  currentLevel: string;
  nextLevel: string;
  requiredSkills: string[];
  estimatedTime: string;
  expectedSalary: string;
  difficulty: DifficultyLevel;
  learningOrder: string[];
}

// 2. Company Readiness
export interface CompanyReadiness {
  companyName: string;
  logo: string;
  overallScore: number;
  dsaReadiness: number;
  developmentReadiness: number;
  communication: number;
  projects: number;
  resume: number;
  interview: number;
}

// 3. Daily Mission
export interface DailyMission {
  todayGoal: string;
  weeklyGoal: string;
  monthlyGoal: string;
  xpReward: number;
  completionPercent: number;
  streak: number;
}

// 4. AI Learning Planner
export interface ScheduleItem {
  time: string;
  task: string;
  type: "Learning" | "Practice" | "Revision" | "Mock Interview";
}

export interface LearningPlanner {
  dailySchedule: ScheduleItem[];
  weeklySchedule: string[];
  monthlySchedule: string[];
  revisionSchedule: string[];
  mockInterviewSchedule: string[];
}

// 5. Skill Tree
export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  unlocked: boolean;
  masteryPercent: number;
  dependencies: string[]; // IDs of prerequisites
}

// 6. Project Roadmap
export interface ProjectRecommendation {
  id: string;
  title: string;
  type: ProjectType;
  difficulty: DifficultyLevel;
  skillsLearned: string[];
  resumeValue: number; // out of 10
  hiringValue: number; // out of 10
  description: string;
}

// 7. Company Preparation
export interface CompanyPreparation {
  companyName: string;
  roadmapTimeline: string;
  mostAskedTopics: string[];
  interviewPattern: string[];
  importantSkills: string[];
  estimatedSuccessPercent: number;
}

// 8. AI Mentor
export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  isCode?: boolean;
}

// 9. Progress Analytics
export interface AnalyticsData {
  month: string;
  learningHours: number;
  skillsLearned: number;
  projectsCompleted: number;
  interviewReadiness: number;
  applicationReadiness: number;
  offerPrediction: number; // % chance
}

// 10. Achievements
export interface Badge {
  id: string;
  name: string;
  icon: string; // url or lucide icon name
  unlockedAt?: string;
  description: string;
}

export interface AchievementProfile {
  xp: number;
  level: number;
  badges: Badge[];
  dailyStreak: number;
  weeklyStreak: number;
  monthlyChallengesCompleted: number;
  leaderboardRank: number;
}

// 11. Resource Library
export type ResourceType = "Book" | "Article" | "Video" | "Course" | "Documentation" | "GitHub Repository";

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  provider: string;
  bookmarked: boolean;
  description: string;
}

// 12. Smart Recommendations
export interface SmartRecommendation {
  id: string;
  category: "Course" | "Project" | "Company" | "Skill" | "Roadmap" | "Interview Question";
  title: string;
  reason: string; // why it's recommended
  actionUrl?: string;
}

// Sub-components data (DSA, Courses, System Design, Coding Practice)
export interface DSATopic {
  topic: string;
  totalQuestions: number;
  solved: number;
}

export interface SystemDesignTopic {
  tier: DifficultyLevel;
  topic: string;
  progressPercent: number;
  resources: number;
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  status: "Solved" | "Attempted" | "Unsolved";
  isBookmarked: boolean;
  category: string;
}
