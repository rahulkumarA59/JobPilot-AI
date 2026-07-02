import type {
  Application, Job, DashboardStats, ActivityItem,
  WeeklyChartData, Notification, UserProfile
} from "@/types";

// ─── Profile ──────────────────────────────────────────────────────────────────
export const mockProfile: UserProfile = {
  id: "p1", userId: "u1",
  firstName: "Rahul", lastName: "Kumar",
  headline: "Full Stack Developer | React & Node.js",
  bio: "Passionate developer with 3+ years of experience building scalable web applications. Love solving complex problems and shipping great products.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
  phone: "+91 98765 43210", location: "Bengaluru, India",
  preferredLocations: ["Bengaluru", "Hyderabad", "Remote"],
  expectedSalary: { min: 1200000, max: 2000000, currency: "INR" },
  resumeUrl: "/resume.pdf", resumeLastUpdated: "2024-03-15T00:00:00Z",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL", "Redis"],
  languages: ["English", "Hindi"],
  education: [
    { id: "e1", institution: "Indian Institute of Technology, Delhi", degree: "B.Tech", field: "Computer Science", startYear: "2019", endYear: "2023", grade: "8.7 CGPA", description: "Specialized in algorithms and distributed systems." }
  ],
  experience: [
    { id: "ex1", company: "Razorpay", position: "Software Engineer", location: "Bengaluru", startDate: "2023-07", endDate: undefined, isCurrent: true, description: "Building payment infrastructure at scale. Reduced API latency by 40%.", skills: ["Go", "PostgreSQL", "Redis", "Kubernetes"] },
    { id: "ex2", company: "Flipkart", position: "SDE Intern", location: "Bengaluru", startDate: "2022-05", endDate: "2022-08", isCurrent: false, description: "Built internal tooling for supply chain optimization.", skills: ["React", "Python", "Django"] }
  ],
  projects: [
    { id: "pr1", name: "CodeCollab", description: "Real-time collaborative code editor with AI suggestions.", link: "https://codecollab.dev", github: "https://github.com/rahul/codecollab", techStack: ["React", "Socket.io", "Node.js", "OpenAI API"], startDate: "2023-01", endDate: "2023-03" },
    { id: "pr2", name: "FinTrack", description: "Personal finance tracker with ML-based spending insights.", link: "https://fintrack.app", github: "https://github.com/rahul/fintrack", techStack: ["Next.js", "Python", "FastAPI", "PostgreSQL"], startDate: "2022-09", endDate: "2023-01" }
  ],
  certificates: [
    { id: "c1", name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", issueDate: "2023-06", expiryDate: "2026-06", credentialId: "AWS-SAA-2023-RK", link: "https://aws.amazon.com/verify" }
  ],
  socialLinks: { linkedin: "https://linkedin.com/in/rahulkumar", github: "https://github.com/rahulkumar", twitter: "https://twitter.com/rahulkumar", portfolio: "https://rahulkumar.dev" },
  profileCompletion: 87, atsScore: 82, resumeScore: 78,
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const mockApplications: Application[] = [
  { id: "a1", jobTitle: "Senior Frontend Engineer", company: "Stripe", companyLogo: "https://logo.clearbit.com/stripe.com", location: "Remote", jobType: "Full-time", workMode: "Remote", salaryRange: "$150K – $200K", status: "interview", appliedDate: "2024-03-20T00:00:00Z", lastUpdated: "2024-03-25T00:00:00Z", interviewDate: "2024-04-02T14:00:00Z", notes: "Final round interview scheduled", jobUrl: "https://stripe.com/jobs", resumeVersion: "v3", source: "LinkedIn", tags: ["dream", "top-priority"] },
  { id: "a2", jobTitle: "Software Engineer II", company: "Google", companyLogo: "https://logo.clearbit.com/google.com", location: "Hyderabad, India", jobType: "Full-time", workMode: "Hybrid", salaryRange: "$120K – $160K", status: "applied", appliedDate: "2024-03-18T00:00:00Z", lastUpdated: "2024-03-18T00:00:00Z", jobUrl: "https://careers.google.com", resumeVersion: "v3", source: "AutoHire AI", tags: ["big-tech"] },
  { id: "a3", jobTitle: "Full Stack Developer", company: "Notion", companyLogo: "https://logo.clearbit.com/notion.so", location: "Remote", jobType: "Full-time", workMode: "Remote", salaryRange: "$130K – $170K", status: "offer", appliedDate: "2024-03-05T00:00:00Z", lastUpdated: "2024-03-28T00:00:00Z", offerAmount: "$155,000/yr", jobUrl: "https://notion.so/careers", resumeVersion: "v2", source: "Direct", tags: ["offer-received"] },
  { id: "a4", jobTitle: "React Native Engineer", company: "Airbnb", companyLogo: "https://logo.clearbit.com/airbnb.com", location: "San Francisco, CA", jobType: "Full-time", workMode: "Hybrid", salaryRange: "$140K – $180K", status: "rejected", appliedDate: "2024-02-28T00:00:00Z", lastUpdated: "2024-03-20T00:00:00Z", notes: "Position filled internally", source: "Company website", tags: [] },
  { id: "a5", jobTitle: "Engineering Manager", company: "Linear", companyLogo: "https://logo.clearbit.com/linear.app", location: "Remote", jobType: "Full-time", workMode: "Remote", salaryRange: "$160K – $220K", status: "screening", appliedDate: "2024-03-22T00:00:00Z", lastUpdated: "2024-03-24T00:00:00Z", source: "Referral", tags: ["referral"] },
  { id: "a6", jobTitle: "Backend Engineer", company: "Vercel", companyLogo: "https://logo.clearbit.com/vercel.com", location: "Remote", jobType: "Full-time", workMode: "Remote", salaryRange: "$130K – $170K", status: "pending", appliedDate: "2024-03-26T00:00:00Z", lastUpdated: "2024-03-26T00:00:00Z", source: "AutoHire AI", tags: [] },
  { id: "a7", jobTitle: "Frontend Developer", company: "Figma", companyLogo: "https://logo.clearbit.com/figma.com", location: "Remote", jobType: "Full-time", workMode: "Remote", salaryRange: "$120K – $160K", status: "applied", appliedDate: "2024-03-27T00:00:00Z", lastUpdated: "2024-03-27T00:00:00Z", source: "AutoHire AI", tags: [] },
  { id: "a8", jobTitle: "Staff Engineer", company: "Atlassian", companyLogo: "https://logo.clearbit.com/atlassian.com", location: "Sydney / Remote", jobType: "Full-time", workMode: "Hybrid", salaryRange: "$160K – $200K", status: "interview", appliedDate: "2024-03-10T00:00:00Z", lastUpdated: "2024-03-29T00:00:00Z", interviewDate: "2024-04-05T10:00:00Z", source: "LinkedIn", tags: [] },
];

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const mockJobs: Job[] = [
  { id: "j1", title: "Senior React Engineer", company: "OpenAI", companyLogo: "https://logo.clearbit.com/openai.com", location: "San Francisco, CA", jobType: "Full-time", workMode: "Hybrid", salaryMin: 180000, salaryMax: 240000, currency: "USD", description: "Build the interfaces that millions of people use every day to interact with AI.", requirements: ["5+ years React", "TypeScript expert", "Experience with large-scale apps"], skills: ["React", "TypeScript", "GraphQL", "Python"], experienceLevel: "Senior", postedAt: "2024-03-28T00:00:00Z", applicants: 847, isBookmarked: true, isFeatured: true, matchScore: 94, source: "AutoHire AI" },
  { id: "j2", title: "Full Stack Engineer", company: "Anthropic", companyLogo: "https://logo.clearbit.com/anthropic.com", location: "Remote", jobType: "Full-time", workMode: "Remote", salaryMin: 160000, salaryMax: 200000, currency: "USD", description: "Join the team building safe and beneficial AI systems.", requirements: ["3+ years full stack", "Node.js or Python backend"], skills: ["React", "Node.js", "Python", "AWS"], experienceLevel: "Mid-Level", postedAt: "2024-03-27T00:00:00Z", applicants: 1243, isBookmarked: false, isFeatured: true, matchScore: 89, source: "LinkedIn" },
  { id: "j3", title: "Frontend Engineer", company: "Cursor", companyLogo: "https://logo.clearbit.com/cursor.sh", location: "Remote", jobType: "Full-time", workMode: "Remote", salaryMin: 140000, salaryMax: 180000, currency: "USD", description: "Help build the AI-powered code editor of the future.", requirements: ["Strong React/TypeScript skills"], skills: ["React", "TypeScript", "Electron", "WebGL"], experienceLevel: "Mid-Level", postedAt: "2024-03-26T00:00:00Z", applicants: 532, isBookmarked: true, isFeatured: false, matchScore: 91, source: "AutoHire AI" },
  { id: "j4", title: "Software Engineer - Platform", company: "Figma", companyLogo: "https://logo.clearbit.com/figma.com", location: "New York, NY", jobType: "Full-time", workMode: "Hybrid", salaryMin: 150000, salaryMax: 195000, currency: "USD", description: "Scale the platform that designers rely on worldwide.", requirements: ["4+ years experience", "Systems design expertise"], skills: ["TypeScript", "Rust", "WebAssembly", "Node.js"], experienceLevel: "Senior", postedAt: "2024-03-25T00:00:00Z", applicants: 389, isBookmarked: false, isFeatured: false, matchScore: 76, source: "Company website" },
];

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  totalApplications: 48, interviews: 12, offers: 3,
  rejected: 18, pending: 15, responseRate: 58,
  avgResponseTime: "4.2 days", thisWeekApplications: 7, weeklyChange: 16.7,
};

// ─── Activity ─────────────────────────────────────────────────────────────────
export const mockActivity: ActivityItem[] = [
  { id: "act1", type: "interview", title: "Interview Scheduled", description: "Stripe — Final round interview on April 2nd at 2 PM IST", timestamp: "2024-03-28T10:00:00Z" },
  { id: "act2", type: "offer", title: "Offer Received 🎉", description: "Notion extended an offer of $155,000/yr", timestamp: "2024-03-27T15:30:00Z" },
  { id: "act3", type: "application", title: "Applied to Vercel", description: "Auto-applied via AI to Backend Engineer position", timestamp: "2024-03-26T09:00:00Z" },
  { id: "act4", type: "ai", title: "Resume Optimized", description: "AI improved your ATS score from 74 to 82", timestamp: "2024-03-25T14:00:00Z" },
  { id: "act5", type: "rejection", title: "Application Update", description: "Airbnb — Position has been filled", timestamp: "2024-03-20T11:00:00Z" },
  { id: "act6", type: "application", title: "Applied to Figma", description: "Auto-applied to Frontend Developer position", timestamp: "2024-03-19T08:00:00Z" },
];

// ─── Weekly Chart ─────────────────────────────────────────────────────────────
export const mockWeeklyData: WeeklyChartData[] = [
  { day: "Mon", applications: 4, interviews: 1 },
  { day: "Tue", applications: 7, interviews: 2 },
  { day: "Wed", applications: 3, interviews: 0 },
  { day: "Thu", applications: 9, interviews: 3 },
  { day: "Fri", applications: 6, interviews: 1 },
  { day: "Sat", applications: 2, interviews: 0 },
  { day: "Sun", applications: 1, interviews: 0 },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: "n1", type: "interview_reminder", title: "Interview Tomorrow", message: "Your interview with Stripe is tomorrow at 2 PM. Prepare your talking points!", isRead: false, createdAt: "2024-04-01T09:00:00Z", actionUrl: "/dashboard/applications" },
  { id: "n2", type: "offer_received", title: "Offer Received 🎉", message: "Notion has extended an offer of $155,000/yr. Review and respond by April 5th.", isRead: false, createdAt: "2024-03-28T15:30:00Z", actionUrl: "/dashboard/applications" },
  { id: "n3", type: "ai_insight", title: "Resume Insight", message: "Your resume score improved to 82/100 after AI optimization. You're now matching 3 more jobs.", isRead: true, createdAt: "2024-03-27T10:00:00Z" },
  { id: "n4", type: "new_job", title: "New Match Found", message: "OpenAI is hiring a Senior React Engineer — 94% match with your profile!", isRead: true, createdAt: "2024-03-26T08:00:00Z", actionUrl: "/dashboard/jobs" },
  { id: "n5", type: "application_update", title: "Application Update", message: "Airbnb has updated your application status to Rejected.", isRead: true, createdAt: "2024-03-20T11:00:00Z" },
  { id: "n6", type: "system", title: "Profile Reminder", message: "Complete your profile to improve your visibility and match score by up to 40%.", isRead: true, createdAt: "2024-03-18T09:00:00Z", actionUrl: "/dashboard/profile" },
];
