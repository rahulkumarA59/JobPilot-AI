// Application Constants

export const APP_NAME = "AutoHire AI";
export const APP_TAGLINE = "Land Your Dream Job with AI";
export const APP_DESCRIPTION = "The intelligent job application platform that automates your job search, optimizes your resume, and tracks every application.";
export const APP_VERSION = "1.0.0";

// API
export const API_BASE_URL = "/api/v1";
export const API_TIMEOUT = 10000;

// Auth
export const TOKEN_KEY = "autohire_token";
export const USER_KEY = "autohire_user";
export const REFRESH_TOKEN_KEY = "autohire_refresh";

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Application Statuses
export const APPLICATION_STATUS = {
  APPLIED: "applied",
  SCREENING: "screening",
  INTERVIEW: "interview",
  OFFER: "offer",
  REJECTED: "rejected",
  PENDING: "pending",
  WITHDRAWN: "withdrawn",
} as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

// Job Types
export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote",
] as const;

// Work Modes
export const WORK_MODES = ["Remote", "Hybrid", "On-site"] as const;

// Experience Levels
export const EXPERIENCE_LEVELS = [
  "Intern",
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Manager",
  "Director",
  "VP",
  "C-Level",
] as const;

// Skills list
export const POPULAR_SKILLS = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "Go",
  "Rust", "AWS", "GCP", "Azure", "Docker", "Kubernetes", "GraphQL", "REST API",
  "PostgreSQL", "MongoDB", "Redis", "Next.js", "Vue.js", "Angular", "Swift",
  "Kotlin", "Flutter", "Machine Learning", "Data Science", "DevOps", "CI/CD",
  "Terraform", "Figma", "Product Management", "Agile", "Scrum",
] as const;

// Languages
export const LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "German", "Chinese (Mandarin)",
  "Japanese", "Korean", "Arabic", "Portuguese", "Russian", "Italian",
] as const;

// Currency
export const CURRENCIES = ["USD", "INR", "EUR", "GBP", "CAD", "AUD", "SGD"] as const;

// Salary ranges (USD/year)
export const SALARY_RANGES = [
  { label: "$0 – $50K", min: 0, max: 50000 },
  { label: "$50K – $100K", min: 50000, max: 100000 },
  { label: "$100K – $150K", min: 100000, max: 150000 },
  { label: "$150K – $200K", min: 150000, max: 200000 },
  { label: "$200K+", min: 200000, max: null },
];

// Nav Links
export const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#faq", label: "FAQ" },
];

// Dashboard Sidebar Links
export const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/applications", label: "Applications", icon: "Briefcase" },
  { href: "/dashboard/jobs", label: "Job Search", icon: "Search" },
  { href: "/dashboard/resume", label: "Resume AI", icon: "FileText" },
  { href: "/dashboard/interviews", label: "Interviews", icon: "Video" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "Bell" },
  { href: "/dashboard/profile", label: "Profile", icon: "User" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
];

// Pricing Plans
export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "month",
    description: "Perfect for getting started with your job search.",
    features: [
      "5 applications/month",
      "Basic resume score",
      "Application tracking",
      "Email notifications",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "Everything you need to supercharge your job search.",
    features: [
      "Unlimited applications",
      "AI resume optimizer",
      "ATS score checker",
      "1-click apply",
      "Interview prep AI",
      "Priority support",
      "Analytics dashboard",
      "Custom alerts",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For power users and teams scaling their hiring.",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Bulk CSV import",
      "API access",
      "Dedicated account manager",
      "White-label options",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

// Social links
export const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Discord", href: "https://discord.com" },
];

// Countries
export const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Singapore", "UAE", "Netherlands", "Sweden",
  "Japan", "South Korea", "Brazil", "Mexico", "Spain", "Italy",
];

// Notification types
export const NOTIFICATION_TYPES = {
  APPLICATION_UPDATE: "application_update",
  NEW_JOB: "new_job",
  INTERVIEW_REMINDER: "interview_reminder",
  OFFER_RECEIVED: "offer_received",
  SYSTEM: "system",
  AI_INSIGHT: "ai_insight",
} as const;

export const THEME_STORAGE_KEY = "autohire_theme";
export const SIDEBAR_COLLAPSED_KEY = "autohire_sidebar_collapsed";
