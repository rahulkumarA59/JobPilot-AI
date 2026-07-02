import {
  CareerPath,
  CompanyReadiness,
  DailyMission,
  LearningPlanner,
  SkillNode,
  ProjectRecommendation,
  CompanyPreparation,
  ChatMessage,
  AnalyticsData,
  AchievementProfile,
  ResourceItem,
  SmartRecommendation,
  DSATopic,
  SystemDesignTopic,
  CodingChallenge
} from "../types";

export const mockCareerPath: CareerPath = {
  role: "Full Stack Developer",
  currentLevel: "SDE-1",
  nextLevel: "SDE-2",
  requiredSkills: ["System Design", "Advanced React", "GraphQL", "AWS Architecture"],
  estimatedTime: "6 - 8 Months",
  expectedSalary: "$130,000 - $160,000",
  difficulty: "Intermediate",
  learningOrder: ["Advanced React Concepts", "State Management Deep Dive", "Backend Scaling", "System Design Basics", "Cloud Deployments"],
};

export const mockCompanyReadiness: CompanyReadiness[] = [
  { companyName: "Google", logo: "https://logo.clearbit.com/google.com", overallScore: 72, dsaReadiness: 85, developmentReadiness: 70, communication: 80, projects: 65, resume: 78, interview: 60 },
  { companyName: "Meta", logo: "https://logo.clearbit.com/meta.com", overallScore: 78, dsaReadiness: 82, developmentReadiness: 88, communication: 75, projects: 80, resume: 85, interview: 65 },
  { companyName: "Amazon", logo: "https://logo.clearbit.com/amazon.com", overallScore: 82, dsaReadiness: 88, developmentReadiness: 75, communication: 85, projects: 70, resume: 88, interview: 75 },
];

export const mockDailyMission: DailyMission = {
  todayGoal: "Solve 2 Medium DP LeetCode Problems",
  weeklyGoal: "Complete System Design Module: Caching",
  monthlyGoal: "Build and deploy a full-stack Next.js app",
  xpReward: 150,
  completionPercent: 45,
  streak: 12,
};

export const mockLearningPlanner: LearningPlanner = {
  dailySchedule: [
    { time: "08:00 AM", task: "Review yesterday's notes", type: "Revision" },
    { time: "09:00 AM", task: "Solve 1 Easy, 1 Medium DSA problem", type: "Practice" },
    { time: "06:00 PM", task: "System Design Video: Message Queues", type: "Learning" },
  ],
  weeklySchedule: [
    "Mon: Graphs and Trees",
    "Wed: React Performance Optimization",
    "Fri: Mock Interview Session",
  ],
  monthlySchedule: [
    "Week 1: Mastering Dynamic Programming",
    "Week 2: Advanced Backend Architecture",
    "Week 3: System Design Mock Interviews",
    "Week 4: Project Building & Deployment",
  ],
  revisionSchedule: ["Sundays: Weekly comprehensive review"],
  mockInterviewSchedule: ["Bi-weekly Fridays at 7 PM"],
};

export const mockSkillTree: SkillNode[] = [
  { id: "s1", name: "Programming Fundamentals", category: "Programming", unlocked: true, masteryPercent: 100, dependencies: [] },
  { id: "s2", name: "Data Structures", category: "Programming", unlocked: true, masteryPercent: 85, dependencies: ["s1"] },
  { id: "s3", name: "Algorithms", category: "Programming", unlocked: true, masteryPercent: 70, dependencies: ["s2"] },
  { id: "f1", name: "HTML/CSS Basics", category: "Frontend", unlocked: true, masteryPercent: 100, dependencies: ["s1"] },
  { id: "f2", name: "React Context & Hooks", category: "Frontend", unlocked: true, masteryPercent: 90, dependencies: ["f1"] },
  { id: "f3", name: "State Management (Redux/Zustand)", category: "Frontend", unlocked: true, masteryPercent: 60, dependencies: ["f2"] },
  { id: "b1", name: "Node.js Basics", category: "Backend", unlocked: true, masteryPercent: 80, dependencies: ["s1"] },
  { id: "b2", name: "REST APIs & Express", category: "Backend", unlocked: true, masteryPercent: 95, dependencies: ["b1"] },
  { id: "b3", name: "GraphQL", category: "Backend", unlocked: false, masteryPercent: 0, dependencies: ["b2"] },
  { id: "c1", name: "Cloud Basics (AWS/GCP)", category: "Cloud", unlocked: false, masteryPercent: 10, dependencies: ["b2"] },
];

export const mockProjects: ProjectRecommendation[] = [
  { id: "p1", title: "Real-time Collaboration Workspace", type: "Industry Level", difficulty: "Advanced", skillsLearned: ["WebSockets", "React", "CRDTs", "Redis"], resumeValue: 9, hiringValue: 9, description: "Build a Google Docs clone with real-time cursor tracking and conflict resolution." },
  { id: "p2", title: "Distributed Job Scheduler", type: "Startup Level", difficulty: "Advanced", skillsLearned: ["Go", "Kafka", "PostgreSQL", "Docker"], resumeValue: 10, hiringValue: 9.5, description: "A cron-like distributed system capable of executing millions of tasks reliably." },
  { id: "p3", title: "E-Commerce Checkout Flow", type: "Open Source", difficulty: "Intermediate", skillsLearned: ["Next.js", "Stripe API", "Zustand"], resumeValue: 6, hiringValue: 7, description: "A highly optimized, accessible checkout pipeline for modern web apps." },
];

export const mockCompanyPreps: CompanyPreparation[] = [
  { companyName: "Google", roadmapTimeline: "4-6 Weeks", mostAskedTopics: ["Graphs", "Dynamic Programming", "System Design Scalability"], interviewPattern: ["1 OA", "2 Tech Rounds", "1 System Design", "1 Googliness"], importantSkills: ["C++/Java/Go", "Distributed Systems", "Algorithm Optimization"], estimatedSuccessPercent: 45 },
  { companyName: "Amazon", roadmapTimeline: "3-5 Weeks", mostAskedTopics: ["Trees", "BFS/DFS", "OOD", "Leadership Principles"], interviewPattern: ["1 OA", "3 Tech Rounds", "1 System Design", "Bar Raiser"], importantSkills: ["Java", "AWS Ecosystem", "Object Oriented Design"], estimatedSuccessPercent: 60 },
];

export const mockChatHistory: ChatMessage[] = [
  { id: "m1", sender: "ai", text: "Hello! I am your AI Career Mentor. I noticed your target is SDE-2 at Google. Your DSA readiness is currently 85%, which is great! What would you like to focus on today?", timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: "m2", sender: "user", text: "Can you help me understand how to approach System Design for a URL Shortener?", timestamp: new Date(Date.now() - 1000 * 60 * 50) },
  { id: "m3", sender: "ai", text: "Absolutely! For a URL shortener (like bit.ly), you need to consider:\n\n1. **High Read-to-Write Ratio:** Use caching aggressively.\n2. **Database:** Key-Value stores like DynamoDB or Cassandra work best.\n3. **Encoding:** Base62 encoding is standard to generate short hashes.\n\nLet's break down the API design first.", timestamp: new Date(Date.now() - 1000 * 60 * 49) },
];

export const mockAnalytics: AnalyticsData[] = [
  { month: "Jan", learningHours: 20, skillsLearned: 2, projectsCompleted: 0, interviewReadiness: 40, applicationReadiness: 50, offerPrediction: 25 },
  { month: "Feb", learningHours: 35, skillsLearned: 4, projectsCompleted: 1, interviewReadiness: 55, applicationReadiness: 60, offerPrediction: 40 },
  { month: "Mar", learningHours: 42, skillsLearned: 5, projectsCompleted: 1, interviewReadiness: 70, applicationReadiness: 75, offerPrediction: 65 },
  { month: "Apr", learningHours: 50, skillsLearned: 8, projectsCompleted: 2, interviewReadiness: 85, applicationReadiness: 88, offerPrediction: 82 },
];

export const mockAchievements: AchievementProfile = {
  xp: 4520,
  level: 14,
  badges: [
    { id: "b1", name: "Algorithm Novice", icon: "Brain", unlockedAt: "2023-01-15", description: "Solved first 50 Easy problems" },
    { id: "b2", name: "System Architect", icon: "Building2", unlockedAt: "2023-04-20", description: "Completed System Design module" },
    { id: "b3", name: "Night Owl", icon: "Moon", unlockedAt: "2023-05-01", description: "Coded past midnight for 5 consecutive days" },
  ],
  dailyStreak: 12,
  weeklyStreak: 4,
  monthlyChallengesCompleted: 3,
  leaderboardRank: 420,
};

export const mockResources: ResourceItem[] = [
  { id: "r1", title: "Designing Data-Intensive Applications", type: "Book", url: "#", provider: "Martin Kleppmann", bookmarked: true, description: "The holy grail of System Design." },
  { id: "r2", title: "React Under the Hood", type: "Article", url: "#", provider: "Medium", bookmarked: false, description: "Deep dive into Fiber architecture." },
  { id: "r3", title: "MIT 6.006 Intro to Algorithms", type: "Video", url: "#", provider: "YouTube", bookmarked: true, description: "Classic algorithm course." },
];

export const mockSmartRecs: SmartRecommendation[] = [
  { id: "sr1", category: "Course", title: "Advanced Distributed Systems", reason: "Based on your mock interview weakness in database sharding.", actionUrl: "#" },
  { id: "sr2", category: "Project", title: "Build a Rate Limiter", reason: "High ROI for backend roles. Fills gap in your Redis knowledge.", actionUrl: "#" },
  { id: "sr3", category: "Company", title: "Stripe", reason: "Your API design skills match their rigorous technical bar.", actionUrl: "#" },
];

export const mockDSATopics: DSATopic[] = [
  { topic: "Arrays & Hashing", totalQuestions: 35, solved: 35 },
  { topic: "Two Pointers", totalQuestions: 20, solved: 18 },
  { topic: "Sliding Window", totalQuestions: 15, solved: 10 },
  { topic: "Stack", totalQuestions: 12, solved: 5 },
  { topic: "Binary Search", totalQuestions: 25, solved: 12 },
  { topic: "Linked List", totalQuestions: 18, solved: 18 },
  { topic: "Trees", totalQuestions: 40, solved: 22 },
  { topic: "Graphs", totalQuestions: 35, solved: 8 },
  { topic: "Dynamic Programming", totalQuestions: 50, solved: 15 },
];

export const mockSystemDesignTopics: SystemDesignTopic[] = [
  { tier: "Beginner", topic: "Client-Server Model & DNS", progressPercent: 100, resources: 5 },
  { tier: "Beginner", topic: "Load Balancing", progressPercent: 100, resources: 4 },
  { tier: "Intermediate", topic: "Database Sharding & Replication", progressPercent: 70, resources: 8 },
  { tier: "Intermediate", topic: "Caching Strategies", progressPercent: 40, resources: 6 },
  { tier: "Advanced", topic: "Message Queues (Kafka/RabbitMQ)", progressPercent: 10, resources: 10 },
  { tier: "Advanced", topic: "Consensus Algorithms (Paxos/Raft)", progressPercent: 0, resources: 3 },
];

export const mockCodingChallenges: CodingChallenge[] = [
  { id: "c1", title: "Two Sum", difficulty: "Beginner", status: "Solved", isBookmarked: false, category: "Arrays & Hashing" },
  { id: "c2", title: "Longest Substring Without Repeating Characters", difficulty: "Intermediate", status: "Attempted", isBookmarked: true, category: "Sliding Window" },
  { id: "c3", title: "Merge k Sorted Lists", difficulty: "Advanced", status: "Unsolved", isBookmarked: false, category: "Linked List" },
  { id: "c4", title: "Word Ladder", difficulty: "Advanced", status: "Unsolved", isBookmarked: true, category: "Graphs" },
];
