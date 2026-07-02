// TypeScript Types and Interfaces for AutoHire AI

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  plan: "free" | "pro" | "enterprise";
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OTPPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  github?: string;
  techStack: string[];
  startDate: string;
  endDate?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
  other?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  avatar?: string;
  phone?: string;
  location: string;
  preferredLocations: string[];
  expectedSalary: {
    min: number;
    max: number;
    currency: string;
  };
  resumeUrl?: string;
  resumeLastUpdated?: string;
  skills: string[];
  languages: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certificates: Certificate[];
  socialLinks: SocialLinks;
  profileCompletion: number;
  atsScore: number;
  resumeScore: number;
}

// ─── Applications ────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "pending"
  | "withdrawn";

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  workMode: string;
  salaryRange?: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
  jobUrl?: string;
  resumeVersion?: string;
  interviewDate?: string;
  offerAmount?: string;
  source: string;
  tags: string[];
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  workMode: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  description: string;
  requirements: string[];
  skills: string[];
  experienceLevel: string;
  postedAt: string;
  deadline?: string;
  applicants?: number;
  isBookmarked: boolean;
  isFeatured: boolean;
  matchScore?: number;
  source: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalApplications: number;
  interviews: number;
  offers: number;
  rejected: number;
  pending: number;
  responseRate: number;
  avgResponseTime: string;
  thisWeekApplications: number;
  weeklyChange: number;
}

export interface ActivityItem {
  id: string;
  type: "application" | "interview" | "offer" | "rejection" | "system" | "ai";
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface WeeklyChartData {
  day: string;
  applications: number;
  interviews: number;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotificationType =
  | "application_update"
  | "new_job"
  | "interview_reminder"
  | "offer_received"
  | "system"
  | "ai_insight";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, string>;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface NotificationSettings {
  emailApplicationUpdates: boolean;
  emailNewJobs: boolean;
  emailInterviewReminders: boolean;
  emailWeeklyDigest: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  showSalaryExpectation: boolean;
  allowRecruiterContact: boolean;
  showLastActive: boolean;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  errors?: Record<string, string[]>;
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark" | "system";

export interface SelectOption {
  label: string;
  value: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}
