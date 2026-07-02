export interface SalaryLevel {
  role: "Intern" | "SDE-1" | "SDE-2" | "Senior" | "Lead" | "Principal" | "Manager";
  range: string;
  avg: number;
}

export interface CountryComparison {
  country: string;
  salary: number;
}

export interface ExperienceComparison {
  years: string;
  salary: number;
}

export interface HiringTrendPoint {
  month: string;
  count: number;
}

export interface DepartmentHiring {
  name: string;
  count: number;
}

export interface OpenPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  salaryRange: string;
}

export interface InterviewStage {
  name: string;
  description: string;
  duration: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface TimelinePhase {
  phase: string;
  duration: string;
}

export interface LearningPriorityItem {
  skill: string;
  priority: "High" | "Medium" | "Low";
  estTime: string;
}

export interface CultureRatings {
  workLifeBalance: number;
  benefits: number;
  growth: number;
  management: number;
  learning: number;
  remoteCulture: number;
  diversity: number;
}

export interface CultureReview {
  id: string;
  author: string;
  title: string;
  rating: number;
  text: string;
}

export interface AIAnalysis {
  strengths: string[];
  weaknesses: string[];
  growthPrediction: string;
  layoffRisk: "Low" | "Moderate" | "High";
  hiringPrediction: string;
  careerGrowth: string;
  promotionSpeed: string;
  jobStability: string;
  futureOutlook: string;
  aiSummary: string;
}

export interface CompanyIntelligenceProfile {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  industry: string;
  founded: string;
  employees: string;
  headquarters: string;
  funding: string;
  ceo: string;
  website: string;
  hiringStatus: "Active" | "Paused" | "Selective" | "Accelerated";
  remotePolicy: "Fully Remote" | "Hybrid" | "Office-First" | "Flexible";
  description: string;
  mission: string;
  vision: string;
  products: string[];
  techStack: string[];
  officeImages: string[];
  
  // Intelligence Sub-structures
  hiringTrend: HiringTrendPoint[];
  hiringVelocity: number; // percentage growth or speed
  departmentsHiring: DepartmentHiring[];
  recentOpenings: OpenPosition[];
  averageHiringTime: string; // e.g. "3 Weeks"
  responseRate: number; // percentage
  acceptanceRate: number; // percentage
  hiringPrediction: string;

  salaries: SalaryLevel[];
  countryComparison: CountryComparison[];
  experienceComparison: ExperienceComparison[];

  interviewStages: InterviewStage[];
  interviewDifficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  interviewFAQs: FAQItem[];
  prepTips: string[];
  experienceTimeline: TimelinePhase[];

  requiredSkills: string[];
  trendingSkills: string[];
  learningPriority: LearningPriorityItem[];
  missingSkills: string[];
  aiSkillRecommendation: string;

  cultureRatings: CultureRatings;
  cultureReviews: CultureReview[];
  pros: string[];
  cons: string[];

  aiAnalysis: AIAnalysis;
}

export interface CompanyNotification {
  id: string;
  type: "new_hiring" | "referral" | "hiring_again" | "salary_updated" | "interview_pattern";
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
