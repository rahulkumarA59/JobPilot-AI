import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ResumePersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  tech: string[];
  link: string;
  startDate: string;
  endDate: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
  level: number;
  category: string;
}

export interface ResumeAchievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface ResumeLanguage {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic";
}

export interface ResumeCertificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  url: string;
}

export interface ResumeInterest {
  id: string;
  name: string;
}

export interface ResumeReference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface ResumeData {
  personalInfo: ResumePersonalInfo;
  summary: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkill[];
  achievements: ResumeAchievement[];
  languages: ResumeLanguage[];
  certificates: ResumeCertificate[];
  interests: ResumeInterest[];
  references: ResumeReference[];
  sectionOrder: string[];
}

export interface ResumeVersion {
  id: string;
  name: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
  atsScore: number;
  isActive: boolean;
}

export interface TemplateInfo {
  id: string;
  name: string;
  category: string;
  preview: string;
  isFavorite: boolean;
}

export type StudioTab =
  | "dashboard"
  | "builder"
  | "optimizer"
  | "templates"
  | "versions"
  | "compare"
  | "preview"
  | "export"
  | "heatmap"
  | "skills"
  | "suggestions"
  | "analytics"
  | "settings";

export interface ResumeStudioState {
  activeTab: StudioTab;
  setActiveTab: (tab: StudioTab) => void;
  resume: ResumeData;
  updatePersonalInfo: (info: Partial<ResumePersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  updateSectionOrder: (order: string[]) => void;
  addEducation: (edu: ResumeEducation) => void;
  updateEducation: (id: string, edu: Partial<ResumeEducation>) => void;
  removeEducation: (id: string) => void;
  addExperience: (exp: ResumeExperience) => void;
  updateExperience: (id: string, exp: Partial<ResumeExperience>) => void;
  removeExperience: (id: string) => void;
  addProject: (proj: ResumeProject) => void;
  updateProject: (id: string, proj: Partial<ResumeProject>) => void;
  removeProject: (id: string) => void;
  addSkill: (skill: ResumeSkill) => void;
  updateSkill: (id: string, skill: Partial<ResumeSkill>) => void;
  removeSkill: (id: string) => void;
  addAchievement: (ach: ResumeAchievement) => void;
  removeAchievement: (id: string) => void;
  addLanguage: (lang: ResumeLanguage) => void;
  removeLanguage: (id: string) => void;
  addCertificate: (cert: ResumeCertificate) => void;
  removeCertificate: (id: string) => void;
  addInterest: (interest: ResumeInterest) => void;
  removeInterest: (id: string) => void;
  addReference: (ref: ResumeReference) => void;
  removeReference: (id: string) => void;
  versions: ResumeVersion[];
  activeVersionId: string;
  restoreVersion: (id: string) => void;
  duplicateVersion: (id: string) => void;
  deleteVersion: (id: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  compareVersions: { a: string; b: string };
  setCompareVersions: (a: string, b: string) => void;
  undoStack: ResumeData[];
  redoStack: ResumeData[];
  pushUndo: () => void;
  undo: () => void;
  redo: () => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  zoomLevel: number;
  setZoomLevel: (z: number) => void;
}

// ─── Default Data ────────────────────────────────────────────────────────────

const defaultResume: ResumeData = {
  personalInfo: {
    fullName: "Rahul Kumar",
    title: "Senior Frontend Engineer",
    email: "rahul.kumar@gmail.com",
    phone: "+1 (555) 304-9830",
    location: "San Francisco, CA",
    website: "https://rahulkumar.dev",
    linkedin: "linkedin.com/in/rahulkumar",
    github: "github.com/rahulkumar",
  },
  summary:
    "Passionate Senior Frontend Engineer with 5+ years of experience building high-performance web applications. Expert in React, TypeScript, and modern CSS. Led teams to deliver pixel-perfect interfaces at scale, achieving 40% improvement in Core Web Vitals across flagship products. Advocate for design systems, accessibility, and developer experience.",
  education: [
    {
      id: "edu-1",
      institution: "Stanford University",
      degree: "Master of Science",
      field: "Computer Science",
      startDate: "2018",
      endDate: "2020",
      gpa: "3.92",
      description: "Specialization in Human-Computer Interaction. Published 2 papers on adaptive UI systems.",
    },
    {
      id: "edu-2",
      institution: "Indian Institute of Technology, Delhi",
      degree: "Bachelor of Technology",
      field: "Computer Science & Engineering",
      startDate: "2014",
      endDate: "2018",
      gpa: "9.1/10",
      description: "Dean's List all semesters. Led university coding club with 200+ members.",
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "Vercel",
      role: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2023",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected and shipped the next-generation dashboard used by 500K+ developers, reducing initial load time by 35%",
        "Led migration of legacy codebase to React Server Components, improving SEO scores by 40% across 12 product pages",
        "Built an internal design system with 60+ components adopted by 4 product teams, reducing development time by 25%",
        "Mentored 6 junior engineers through structured code review processes and weekly knowledge-sharing sessions",
      ],
    },
    {
      id: "exp-2",
      company: "Stripe",
      role: "Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "Jun 2020",
      endDate: "Dec 2022",
      current: false,
      bullets: [
        "Developed interactive payment flow components handling $2B+ in annual transactions with 99.99% uptime",
        "Implemented real-time data visualization dashboards using D3.js and Recharts for merchant analytics",
        "Reduced bundle size by 42% through code splitting, tree shaking, and lazy loading strategies",
        "Contributed to Stripe's open-source design system, receiving 2.5K+ GitHub stars",
      ],
    },
    {
      id: "exp-3",
      company: "Google",
      role: "Software Engineering Intern",
      location: "Mountain View, CA",
      startDate: "May 2019",
      endDate: "Aug 2019",
      current: false,
      bullets: [
        "Built prototype for Chrome DevTools accessibility panel, later shipped to 100M+ Chrome users",
        "Optimized rendering pipeline for Google Maps embed component, achieving 20% FPS improvement on mobile",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "AutoHire AI Platform",
      description: "Enterprise job automation platform with AI-powered resume optimization, automated browser-based applications, and real-time ATS scoring engine.",
      tech: ["React 19", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "Recharts"],
      link: "https://autohire.ai",
      startDate: "2024",
      endDate: "Present",
    },
    {
      id: "proj-2",
      name: "DesignFlow Studio",
      description: "Collaborative real-time design tool with multi-cursor support, component library, and Figma import/export capabilities.",
      tech: ["Next.js", "WebSocket", "Canvas API", "PostgreSQL", "Redis"],
      link: "https://designflow.dev",
      startDate: "2023",
      endDate: "2024",
    },
    {
      id: "proj-3",
      name: "CodeBench IDE",
      description: "Browser-based code editor with AI-powered autocomplete, real-time collaboration, and integrated terminal. Supports 20+ languages.",
      tech: ["Monaco Editor", "WebContainers", "TypeScript", "Rust WASM"],
      link: "https://codebench.io",
      startDate: "2022",
      endDate: "2023",
    },
  ],
  skills: [
    { id: "sk-1", name: "React / Next.js", level: 98, category: "Frontend" },
    { id: "sk-2", name: "TypeScript", level: 96, category: "Languages" },
    { id: "sk-3", name: "Tailwind CSS", level: 95, category: "Frontend" },
    { id: "sk-4", name: "Node.js", level: 88, category: "Backend" },
    { id: "sk-5", name: "GraphQL", level: 82, category: "Backend" },
    { id: "sk-6", name: "PostgreSQL", level: 80, category: "Database" },
    { id: "sk-7", name: "Framer Motion", level: 92, category: "Frontend" },
    { id: "sk-8", name: "Zustand / Redux", level: 94, category: "Frontend" },
    { id: "sk-9", name: "Jest / Vitest", level: 78, category: "Testing" },
    { id: "sk-10", name: "Docker / CI/CD", level: 72, category: "DevOps" },
    { id: "sk-11", name: "Figma", level: 85, category: "Design" },
    { id: "sk-12", name: "Python", level: 75, category: "Languages" },
  ],
  achievements: [
    { id: "ach-1", title: "Employee of the Quarter — Vercel Q3 2023", description: "Recognized for exceptional contributions to the dashboard redesign project.", date: "2023" },
    { id: "ach-2", title: "Speaker — React Summit 2022", description: "Presented 'Beyond Server Components: The Future of React Architecture' to 3,000+ attendees.", date: "2022" },
    { id: "ach-3", title: "Google Code Jam Finalist 2019", description: "Top 500 globally among 35,000+ participants.", date: "2019" },
    { id: "ach-4", title: "Open Source Contributor of the Year — Stripe 2021", description: "Highest-impact open source contributions across all engineering teams.", date: "2021" },
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Native" },
    { id: "lang-2", name: "Hindi", proficiency: "Native" },
    { id: "lang-3", name: "Japanese", proficiency: "Intermediate" },
    { id: "lang-4", name: "Spanish", proficiency: "Basic" },
  ],
  certificates: [
    { id: "cert-1", name: "AWS Solutions Architect Associate", issuer: "Amazon Web Services", date: "2023", credentialId: "AWS-SAA-2023-RK", url: "https://aws.amazon.com/verify" },
    { id: "cert-2", name: "Google Professional Cloud Developer", issuer: "Google Cloud", date: "2022", credentialId: "GCP-PCD-2022-RK", url: "https://cloud.google.com/verify" },
    { id: "cert-3", name: "Meta Frontend Developer Professional", issuer: "Meta (Coursera)", date: "2022", credentialId: "META-FE-2022-RK", url: "https://coursera.org/verify" },
  ],
  interests: [
    { id: "int-1", name: "Open Source Development" },
    { id: "int-2", name: "UI/UX Design Systems" },
    { id: "int-3", name: "Machine Learning & AI" },
    { id: "int-4", name: "Technical Writing" },
    { id: "int-5", name: "Rock Climbing" },
    { id: "int-6", name: "Chess" },
  ],
  references: [
    { id: "ref-1", name: "Sarah Chen", title: "Engineering Manager", company: "Vercel", email: "sarah.chen@vercel.com", phone: "+1 (555) 123-4567", relationship: "Direct Manager" },
    { id: "ref-2", name: "James Mitchell", title: "Staff Engineer", company: "Stripe", email: "james.m@stripe.com", phone: "+1 (555) 987-6543", relationship: "Technical Lead" },
  ],
  sectionOrder: [
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "achievements",
    "certificates",
    "languages",
    "interests",
    "references",
  ],
};

const defaultVersions: ResumeVersion[] = [
  {
    id: "v-1",
    name: "Resume V1 — Initial Draft",
    data: { ...defaultResume, summary: "Frontend Engineer with 3+ years of experience in React and JavaScript. Passionate about building user interfaces." },
    createdAt: "2024-08-15T10:30:00Z",
    updatedAt: "2024-08-15T10:30:00Z",
    atsScore: 72,
    isActive: false,
  },
  {
    id: "v-2",
    name: "Resume V2 — ATS Optimized",
    data: { ...defaultResume, summary: "Senior Frontend Engineer with 4+ years building high-performance web applications using React, TypeScript, and modern tooling." },
    createdAt: "2024-11-02T14:15:00Z",
    updatedAt: "2024-11-02T14:15:00Z",
    atsScore: 85,
    isActive: false,
  },
  {
    id: "v-3",
    name: "Resume V3 — Enterprise Edition",
    data: defaultResume,
    createdAt: "2025-03-20T09:00:00Z",
    updatedAt: "2025-06-28T16:45:00Z",
    atsScore: 94,
    isActive: true,
  },
];

// ─── Store ───────────────────────────────────────────────────────────────────

export const useResumeStudioStore = create<ResumeStudioState>()(
  persist(
    (set, get) => ({
      activeTab: "dashboard",
      setActiveTab: (tab) => set({ activeTab: tab }),

      resume: defaultResume,
      updatePersonalInfo: (info) =>
        set((s) => {
          s.pushUndo();
          return { resume: { ...s.resume, personalInfo: { ...s.resume.personalInfo, ...info } } };
        }),
      updateSummary: (summary) =>
        set((s) => {
          s.pushUndo();
          return { resume: { ...s.resume, summary } };
        }),
      updateSectionOrder: (order) =>
        set((s) => ({ resume: { ...s.resume, sectionOrder: order } })),

      addEducation: (edu) =>
        set((s) => ({ resume: { ...s.resume, education: [...s.resume.education, edu] } })),
      updateEducation: (id, edu) =>
        set((s) => ({
          resume: {
            ...s.resume,
            education: s.resume.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({ resume: { ...s.resume, education: s.resume.education.filter((e) => e.id !== id) } })),

      addExperience: (exp) =>
        set((s) => ({ resume: { ...s.resume, experience: [...s.resume.experience, exp] } })),
      updateExperience: (id, exp) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experience: s.resume.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({ resume: { ...s.resume, experience: s.resume.experience.filter((e) => e.id !== id) } })),

      addProject: (proj) =>
        set((s) => ({ resume: { ...s.resume, projects: [...s.resume.projects, proj] } })),
      updateProject: (id, proj) =>
        set((s) => ({
          resume: {
            ...s.resume,
            projects: s.resume.projects.map((p) => (p.id === id ? { ...p, ...proj } : p)),
          },
        })),
      removeProject: (id) =>
        set((s) => ({ resume: { ...s.resume, projects: s.resume.projects.filter((p) => p.id !== id) } })),

      addSkill: (skill) =>
        set((s) => ({ resume: { ...s.resume, skills: [...s.resume.skills, skill] } })),
      updateSkill: (id, skill) =>
        set((s) => ({
          resume: {
            ...s.resume,
            skills: s.resume.skills.map((sk) => (sk.id === id ? { ...sk, ...skill } : sk)),
          },
        })),
      removeSkill: (id) =>
        set((s) => ({ resume: { ...s.resume, skills: s.resume.skills.filter((sk) => sk.id !== id) } })),

      addAchievement: (ach) =>
        set((s) => ({ resume: { ...s.resume, achievements: [...s.resume.achievements, ach] } })),
      removeAchievement: (id) =>
        set((s) => ({ resume: { ...s.resume, achievements: s.resume.achievements.filter((a) => a.id !== id) } })),

      addLanguage: (lang) =>
        set((s) => ({ resume: { ...s.resume, languages: [...s.resume.languages, lang] } })),
      removeLanguage: (id) =>
        set((s) => ({ resume: { ...s.resume, languages: s.resume.languages.filter((l) => l.id !== id) } })),

      addCertificate: (cert) =>
        set((s) => ({ resume: { ...s.resume, certificates: [...s.resume.certificates, cert] } })),
      removeCertificate: (id) =>
        set((s) => ({ resume: { ...s.resume, certificates: s.resume.certificates.filter((c) => c.id !== id) } })),

      addInterest: (interest) =>
        set((s) => ({ resume: { ...s.resume, interests: [...s.resume.interests, interest] } })),
      removeInterest: (id) =>
        set((s) => ({ resume: { ...s.resume, interests: s.resume.interests.filter((i) => i.id !== id) } })),

      addReference: (ref) =>
        set((s) => ({ resume: { ...s.resume, references: [...s.resume.references, ref] } })),
      removeReference: (id) =>
        set((s) => ({ resume: { ...s.resume, references: s.resume.references.filter((r) => r.id !== id) } })),

      versions: defaultVersions,
      activeVersionId: "v-3",

      restoreVersion: (id) =>
        set((s) => ({
          versions: s.versions.map((v) => ({ ...v, isActive: v.id === id })),
          activeVersionId: id,
          resume: s.versions.find((v) => v.id === id)?.data ?? s.resume,
        })),

      duplicateVersion: (id) =>
        set((s) => {
          const source = s.versions.find((v) => v.id === id);
          if (!source) return s;
          const newId = `v-dup-${Date.now()}`;
          const newVersion: ResumeVersion = {
            ...source,
            id: newId,
            name: `${source.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: false,
          };
          return { versions: [...s.versions, newVersion] };
        }),

      deleteVersion: (id) =>
        set((s) => {
          if (s.versions.length <= 1) return s;
          const filtered = s.versions.filter((v) => v.id !== id);
          const wasActive = s.activeVersionId === id;
          if (wasActive) {
            const newActive = filtered[filtered.length - 1];
            return {
              versions: filtered.map((v) => ({ ...v, isActive: v.id === newActive.id })),
              activeVersionId: newActive.id,
              resume: newActive.data,
            };
          }
          return { versions: filtered };
        }),

      selectedTemplate: "minimal",
      setSelectedTemplate: (id) => set({ selectedTemplate: id }),
      compareVersions: { a: "v-2", b: "v-3" },
      setCompareVersions: (a, b) => set({ compareVersions: { a, b } }),

      undoStack: [],
      redoStack: [],
      pushUndo: () =>
        set((s) => ({
          undoStack: [...s.undoStack.slice(-19), s.resume],
          redoStack: [],
        })),
      undo: () => {
        const { undoStack, resume } = get();
        if (undoStack.length === 0) return;
        const prev = undoStack[undoStack.length - 1];
        set({
          resume: prev,
          undoStack: undoStack.slice(0, -1),
          redoStack: [...get().redoStack, resume],
        });
      },
      redo: () => {
        const { redoStack, resume } = get();
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        set({
          resume: next,
          redoStack: redoStack.slice(0, -1),
          undoStack: [...get().undoStack, resume],
        });
      },

      jobDescription: "",
      setJobDescription: (jd) => set({ jobDescription: jd }),

      zoomLevel: 100,
      setZoomLevel: (z) => set({ zoomLevel: z }),
    }),
    {
      name: "autohire-resume-studio",
      partialize: (s) => ({
        resume: s.resume,
        selectedTemplate: s.selectedTemplate,
        activeVersionId: s.activeVersionId,
        versions: s.versions,
        activeTab: s.activeTab,
      }),
    }
  )
);
