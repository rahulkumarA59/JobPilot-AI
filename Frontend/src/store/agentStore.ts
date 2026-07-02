import { create } from "zustand";
import { toast } from "sonner";

export interface QueueItem {
  id: string;
  role: string;
  company: string;
  status: "Queued" | "Preparing" | "Applying" | "Submitted" | "Interview" | "Rejected" | "Offer";
  matchScore: number;
  reason: string;
  logo: string;
}

export interface TimelineLog {
  id: string;
  time: string;
  text: string;
  type: "info" | "success" | "warning" | "error" | "thinking";
}

export interface AgentState {
  status: "idle" | "running" | "paused" | "stopped" | "error";
  currentTask: string;
  activeBrowserUrl: string;
  activeBrowserTab: "linkedin" | "careers" | "submitting" | "success";
  browserStep: "navigating" | "typing" | "uploading" | "submitting" | "idle";
  applicationsCompleted: number;
  successRate: number;
  estimatedTimeRemaining: string;
  timelineLogs: TimelineLog[];
  queue: QueueItem[];
  activeJobIndex: number;
  stepIndex: number; // 0 to 6 inside a single job lifecycle
  
  // Actions
  startAgent: () => void;
  pauseAgent: () => void;
  stopAgent: () => void;
  resetQueue: () => void;
  emergencyStop: () => void;
  updateQueueItemStatus: (id: string, newStatus: QueueItem["status"]) => void;
  addLog: (text: string, type: TimelineLog["type"]) => void;
  tickSimulation: () => void;
}

const initialQueue: QueueItem[] = [
  {
    id: "q-1",
    role: "Frontend Engineer",
    company: "Vercel",
    status: "Queued",
    matchScore: 98,
    reason: "Expert alignment with React, Next.js, and modern CSS frameworks.",
    logo: "vercel"
  },
  {
    id: "q-2",
    role: "Software Engineer - Frontend",
    company: "Stripe",
    status: "Queued",
    matchScore: 95,
    reason: "Strong Match for TypeScript, payment components, and API integration.",
    logo: "stripe"
  },
  {
    id: "q-3",
    role: "Product Engineer",
    company: "Linear",
    status: "Queued",
    matchScore: 92,
    reason: "Matches UI/UX focus, custom workspace design, and clean code practices.",
    logo: "linear"
  },
  {
    id: "q-4",
    role: "Staff UI Engineer",
    company: "Airbnb",
    status: "Queued",
    matchScore: 88,
    reason: "Excellent UI polish, Framer Motion, and design system capabilities.",
    logo: "airbnb"
  },
  {
    id: "q-5",
    role: "Senior Frontend Developer",
    company: "Figma",
    status: "Queued",
    matchScore: 91,
    reason: "Strong fit for SVG rendering, dashboard layouts, and collaborative tools.",
    logo: "figma"
  },
  {
    id: "q-6",
    role: "AI Product Engineer",
    company: "Cursor",
    status: "Queued",
    matchScore: 96,
    reason: "High compatibility with LLM prompt design, monaco-editor, and devtools.",
    logo: "cursor"
  }
];

let intervalId: any = null;

export const useAgentStore = create<AgentState>((set, get) => {
  const getFormattedTime = () => {
    const d = new Date();
    return d.toTimeString().split(" ")[0];
  };

  return {
    status: "idle",
    currentTask: "Agent on standby. Click 'Start Agent' to begin automation.",
    activeBrowserUrl: "about:blank",
    activeBrowserTab: "linkedin",
    browserStep: "idle",
    applicationsCompleted: 24, // Starting baseline
    successRate: 94.2,
    estimatedTimeRemaining: "--:--",
    timelineLogs: [
      {
        id: "log-init-1",
        time: getFormattedTime(),
        text: "AI Recruiter system initialized. Connected to browser sandbox.",
        type: "info"
      },
      {
        id: "log-init-2",
        time: getFormattedTime(),
        text: "Standby mode active. Waiting for queue instructions...",
        type: "info"
      }
    ],
    queue: initialQueue,
    activeJobIndex: 0,
    stepIndex: 0,

    addLog: (text: string, type: TimelineLog["type"]) => {
      const newLog: TimelineLog = {
        id: `log-${Date.now()}-${Math.random()}`,
        time: getFormattedTime(),
        text,
        type
      };
      set((state) => ({
        timelineLogs: [newLog, ...state.timelineLogs].slice(0, 100) // Keep last 100 logs
      }));
    },

    updateQueueItemStatus: (id: string, newStatus: QueueItem["status"]) => {
      set((state) => ({
        queue: state.queue.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      }));
    },

    startAgent: () => {
      const { status } = get();
      if (status === "running") return;

      set({ status: "running" });
      get().addLog("Agent started. Securing browser session...", "thinking");
      toast.info("AI Recruiter Agent started. Sandbox browser active.");

      if (intervalId) clearInterval(intervalId);
      
      // Let's set a 3-second tick
      intervalId = setInterval(() => {
        get().tickSimulation();
      }, 3000);
    },

    pauseAgent: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      set({ status: "paused" });
      get().addLog("Agent automation paused by operator.", "warning");
      toast.warning("AI Agent automation paused.");
    },

    stopAgent: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      set({
        status: "stopped",
        currentTask: "Agent stopped.",
        browserStep: "idle",
        stepIndex: 0
      });
      get().addLog("Agent execution terminated.", "error");
      toast.error("AI Agent stopped.");
    },

    emergencyStop: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      set({
        status: "error",
        currentTask: "CRITICAL STOP: Browser sandboxing connection lost.",
        browserStep: "idle",
        stepIndex: 0
      });
      get().addLog("CRITICAL: Operator triggered Emergency Stop. Sandbox shut down.", "error");
      toast.error("CRITICAL: Sandbox browser isolation terminated!");
    },

    resetQueue: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      set({
        status: "idle",
        currentTask: "Agent on standby. Click 'Start Agent' to begin automation.",
        activeBrowserUrl: "about:blank",
        activeBrowserTab: "linkedin",
        browserStep: "idle",
        applicationsCompleted: 24,
        successRate: 94.2,
        estimatedTimeRemaining: "--:--",
        timelineLogs: [
          {
            id: `log-${Date.now()}-1`,
            time: getFormattedTime(),
            text: "AI Recruiter system reset complete.",
            type: "info"
          },
          {
            id: `log-${Date.now()}-2`,
            time: getFormattedTime(),
            text: "Queue restored to default mock data.",
            type: "info"
          }
        ],
        queue: initialQueue.map(item => ({ ...item, status: "Queued" })),
        activeJobIndex: 0,
        stepIndex: 0
      });
      toast.success("AI Agent queue state reset successfully.");
    },

    tickSimulation: () => {
      const { queue, activeJobIndex, stepIndex, status } = get();
      if (status !== "running") return;

      // Find the next queued job
      let currentJob = queue[activeJobIndex];
      
      // If the current job isn't queued, let's find the first Queued job
      if (!currentJob || currentJob.status !== "Queued") {
        const nextIndex = queue.findIndex(item => item.status === "Queued");
        if (nextIndex === -1) {
          // No more jobs!
          if (intervalId) clearInterval(intervalId);
          intervalId = null;
          set({
            status: "idle",
            currentTask: "All queued applications processed. Agent standing by.",
            browserStep: "idle",
            activeBrowserUrl: "about:blank"
          });
          get().addLog("Job queue completed. All matches successfully applied.", "success");
          return;
        }
        set({ activeJobIndex: nextIndex, stepIndex: 0 });
        currentJob = queue[nextIndex];
      }

      const role = currentJob.role;
      const company = currentJob.company;
      const score = currentJob.matchScore;
      const reason = currentJob.reason;

      switch (stepIndex) {
        case 0:
          // Step 0: Analyzing the next job
          set({
            currentTask: `Analyzing job: ${role} at ${company} (ATS Match: ${score}%)`,
            activeBrowserTab: "linkedin",
            activeBrowserUrl: `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(role)}+${encodeURIComponent(company)}`,
            browserStep: "navigating",
            stepIndex: 1,
            estimatedTimeRemaining: "1m 30s"
          });
          get().addLog(`Scanning LinkedIn postings for ${role} at ${company}...`, "info");
          
          // Set queue item status to Preparing
          get().updateQueueItemStatus(currentJob.id, "Preparing");
          break;

        case 1:
          // Step 1: Evaluating match profile
          set({
            currentTask: `Evaluating match details for ${role} at ${company}`,
            activeBrowserUrl: `https://www.linkedin.com/jobs/view/${company.toLowerCase()}-role-109283`,
            browserStep: "typing",
            stepIndex: 2,
            estimatedTimeRemaining: "1m 15s"
          });
          get().addLog(`Match analysis: ATS score is ${score}%. Reason: ${reason}`, "thinking");
          break;

        case 2:
          // Step 2: Navigating to careers page
          set({
            currentTask: `Routing to ${company} application portal`,
            activeBrowserTab: "careers",
            activeBrowserUrl: `https://careers.${company.toLowerCase()}.com/jobs/${role.toLowerCase().replace(/ /g, "-")}/apply`,
            browserStep: "navigating",
            stepIndex: 3,
            estimatedTimeRemaining: "1m 00s"
          });
          get().addLog(`Redirecting browser sandbox to ${company} Careers Application.`, "info");
          get().updateQueueItemStatus(currentJob.id, "Applying");
          break;

        case 3:
          // Step 3: Filling personal info
          set({
            currentTask: `Filling out applicant details (Rahul Kumar)`,
            browserStep: "typing",
            stepIndex: 4,
            estimatedTimeRemaining: "45s"
          });
          get().addLog(`Auto-filling form fields: Full Name, Email, Phone, GitHub, LinkedIn.`, "info");
          break;

        case 4:
          // Step 4: Uploading Resume
          set({
            currentTask: `Uploading Resume & Tailoring ATS keywords`,
            browserStep: "uploading",
            stepIndex: 5,
            estimatedTimeRemaining: "30s"
          });
          get().addLog(`Uploading parsed CV: 'rahul_kumar_resume_optimized.pdf'. Injecting custom cover note.`, "thinking");
          break;

        case 5:
          // Step 5: Submitting
          set({
            currentTask: `Submitting form for ${company}`,
            activeBrowserTab: "submitting",
            browserStep: "submitting",
            stepIndex: 6,
            estimatedTimeRemaining: "10s"
          });
          get().addLog(`Final submission trigger clicked on ${company} application page. Waiting for API callback...`, "warning");
          break;

        case 6:
          // Step 6: Success!
          const confId = `AH-${Math.floor(100000 + Math.random() * 900000)}`;
          set((state) => ({
            currentTask: `Application submitted successfully!`,
            activeBrowserTab: "success",
            browserStep: "idle",
            applicationsCompleted: state.applicationsCompleted + 1,
            successRate: Math.round((92 + Math.random() * 6) * 10) / 10,
            estimatedTimeRemaining: "0s",
            stepIndex: 0,
            activeJobIndex: state.activeJobIndex + 1
          }));
          get().addLog(`Submission confirmed! Receipt ID: ${confId}. Saved application status in DB.`, "success");
          get().updateQueueItemStatus(currentJob.id, "Submitted");
          toast.success(`Application submitted to ${company}! ID: ${confId}`);
          break;

        default:
          set({ stepIndex: 0 });
          break;
      }
    }
  };
});
