import React, { useEffect, useRef, useState } from "react";
import { useAgentStore } from "@/store/agentStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, ShieldCheck, RefreshCw, ArrowLeft, ArrowRight, Home, Lock,
  Globe, Play, Pause, Circle, Upload, CheckCircle, Search, Laptop
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AgentConsole() {
  const {
    status,
    currentTask,
    activeBrowserUrl,
    activeBrowserTab,
    browserStep,
    timelineLogs,
    queue,
    activeJobIndex,
    startAgent,
    pauseAgent
  } = useAgentStore();

  const consoleEndRef = useRef<HTMLDivElement>(null);
  const currentJob = queue[activeJobIndex] || queue[0] || null;

  // Auto scroll console to top/bottom
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [timelineLogs]);

  // Fake upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    if (browserStep === "uploading") {
      setUploadProgress(0);
      const int = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(int);
            return 100;
          }
          return prev + 20;
        });
      }, 400);
      return () => clearInterval(int);
    } else {
      setUploadProgress(0);
    }
  }, [browserStep]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-230px)] min-h-[500px]">
      {/* LEFT: Live Console Timeline & Thinking screen (5 cols) */}
      <div className="xl:col-span-5 flex flex-col h-full space-y-4">
        <Card className="flex-1 flex flex-col bg-[#0b0c10] border-[#1f222e] text-slate-300 font-mono text-xs overflow-hidden rounded-2xl relative shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#13151f] border-b border-[#1f222e] select-none shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-violet-400" />
              <span className="font-semibold text-slate-200">live_agent_console.log</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Circle className="h-2.5 w-2.5 fill-red-500/80 stroke-red-600/80" />
              <Circle className="h-2.5 w-2.5 fill-yellow-500/80 stroke-yellow-600/80" />
              <Circle className="h-2.5 w-2.5 fill-green-500/80 stroke-green-600/80" />
            </div>
          </div>

          {/* Console Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
            <AnimatePresence initial={false}>
              {timelineLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-2.5 rounded-lg border flex items-start gap-3 bg-[#13151f]/50 ${
                    log.type === "success" ? "border-green-500/20 text-green-400" :
                    log.type === "error" ? "border-red-500/20 text-red-400" :
                    log.type === "warning" ? "border-amber-500/20 text-amber-400" :
                    log.type === "thinking" ? "border-violet-500/20 text-violet-400" :
                    "border-[#1f222e] text-slate-300"
                  }`}
                >
                  <span className="text-slate-500 font-semibold select-none">{log.time}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold mr-1.5">[{log.type.toUpperCase()}]</span>
                    <span className="break-words">{log.text}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={consoleEndRef} />
          </div>

          {/* Thinking overlay when loading or simulating */}
          {status === "running" && browserStep !== "idle" && (
            <div className="absolute bottom-16 right-4 p-3 bg-violet-600/10 border border-violet-500/30 rounded-xl backdrop-blur-md shadow-glow flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-violet-300 animate-pulse">
                Agent thinking...
              </span>
            </div>
          )}

          {/* Footer stats / state summary */}
          <div className="p-3.5 bg-[#13151f] border-t border-[#1f222e] flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <Laptop className="h-3.5 w-3.5 text-slate-500" />
              <span>Status: <span className="text-violet-400 font-semibold">{status}</span></span>
            </div>
            <div className="flex items-center gap-3">
              <span>Step: <span className="text-slate-200 font-semibold">{browserStep}</span></span>
              <span>Tab: <span className="text-slate-200 font-semibold">{activeBrowserTab}</span></span>
            </div>
          </div>
        </Card>
      </div>

      {/* RIGHT: Chrome Browser Simulator (7 cols) */}
      <div className="xl:col-span-7 flex flex-col h-full">
        <Card className="flex-1 flex flex-col border-border/80 overflow-hidden rounded-2xl shadow-xl bg-card">
          {/* Chrome Chrome Header Bar */}
          <div className="bg-muted px-4 py-2 border-b border-border/80 flex flex-col gap-2 shrink-0 select-none">
            {/* Window controls and tabs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 mr-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
                <div className={`px-4 py-1.5 rounded-t-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer max-w-[120px] truncate ${
                  activeBrowserTab === "linkedin"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-card/40"
                }`}>
                  <span className="h-3 w-3 bg-blue-600 text-white font-bold flex items-center justify-center text-[9px] rounded-sm">in</span>
                  LinkedIn
                </div>
                <div className={`px-4 py-1.5 rounded-t-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer max-w-[120px] truncate ${
                  activeBrowserTab === "careers"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-card/40"
                }`}>
                  <Globe className="h-3 w-3 text-violet-500" />
                  {currentJob ? currentJob.company : "Careers"} Portal
                </div>
                <div className={`px-4 py-1.5 rounded-t-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer max-w-[120px] truncate ${
                  activeBrowserTab === "submitting" || activeBrowserTab === "success"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-card/40"
                }`}>
                  <ShieldCheck className="h-3 w-3 text-green-500" />
                  Apply Status
                </div>
              </div>
            </div>

            {/* Browser control bar */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                <ArrowLeft className="h-3.5 w-3.5 cursor-not-allowed opacity-50" />
                <ArrowRight className="h-3.5 w-3.5 cursor-not-allowed opacity-50" />
                <RefreshCw className={`h-3.5 w-3.5 ${browserStep === "navigating" ? "animate-spin text-primary" : ""}`} />
                <Home className="h-3.5 w-3.5" />
              </div>

              {/* Address bar */}
              <div className="flex-1 bg-background border border-border/80 rounded-lg px-3 py-1 flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                <Lock className="h-3 w-3 text-green-500 shrink-0" />
                <span className="text-green-600 font-semibold shrink-0">https://</span>
                <span className="truncate text-foreground font-medium">{activeBrowserUrl.replace("https://", "")}</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                <Globe className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Simulator Viewport content */}
          <div className="flex-1 bg-muted/20 overflow-y-auto p-6 flex flex-col justify-start relative">
            <AnimatePresence mode="wait">
              {activeBrowserTab === "linkedin" && (
                <motion.div
                  key="linkedin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 max-w-2xl mx-auto w-full"
                >
                  {/* Mock LinkedIn UI */}
                  <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                    {/* Glowing scanning border when analyzing */}
                    {browserStep === "typing" && (
                      <div className="absolute inset-0 border-2 border-violet-500/40 rounded-xl pointer-events-none animate-pulse">
                        <div className="h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full animate-scan" />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg shrink-0">
                        {currentJob?.company[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-foreground text-lg">{currentJob?.role}</h4>
                        <p className="text-sm text-blue-600 font-semibold hover:underline">{currentJob?.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">California, CA • Remote • 2 days ago</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20">
                        {currentJob?.matchScore}% ATS Score
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        Easy Apply Enabled
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-muted-foreground pt-1">
                      <p className="font-semibold text-foreground text-sm">About the job:</p>
                      <p className="leading-relaxed">
                        We are looking for a high-performing developer with experience in React, TypeScript, and Tailwind CSS.
                        You will build sleek client-side tools and coordinate interactive interfaces.
                      </p>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition">
                        Easy Apply
                      </button>
                      <button className="px-3 py-2 rounded-xl border border-border text-muted-foreground hover:bg-accent text-xs">
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Extracting view */}
                  {browserStep === "typing" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl space-y-2 text-xs"
                    >
                      <p className="font-bold text-violet-600 dark:text-violet-400 flex items-center gap-2">
                        <span className="animate-ping h-1.5 w-1.5 rounded-full bg-violet-400" />
                        AI Agent - Keywords Extraction & CV Alignment
                      </p>
                      <ul className="grid grid-cols-2 gap-1.5 text-muted-foreground">
                        <li className="flex items-center gap-1.5">✓ React & NextJS</li>
                        <li className="flex items-center gap-1.5">✓ TypeScript TypeSafety</li>
                        <li className="flex items-center gap-1.5">✓ UI Polish / Animations</li>
                        <li className="flex items-center gap-1.5">✓ Tailwind CSS utility classes</li>
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeBrowserTab === "careers" && (
                <motion.div
                  key="careers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-card border border-border/85 rounded-xl p-6 max-w-2xl mx-auto w-full space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-border/60">
                    <div>
                      <h4 className="font-bold text-foreground text-base">Submit Application</h4>
                      <p className="text-xs text-muted-foreground">{currentJob?.role} — {currentJob?.company}</p>
                    </div>
                    <Globe className="h-6 w-6 text-violet-500" />
                  </div>

                  {/* Simulated Form fields */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Full Name</label>
                      <input
                        type="text"
                        readOnly
                        value={browserStep !== "navigating" ? "Rahul Kumar" : ""}
                        className={`w-full px-3 py-1.5 bg-muted/40 border rounded-lg text-xs font-semibold focus:outline-none transition ${
                          browserStep === "typing" ? "border-violet-500 ring-2 ring-violet-500/10" : "border-border"
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Email</label>
                        <input
                          type="text"
                          readOnly
                          value={browserStep !== "navigating" ? "rahulkumar.dev@gmail.com" : ""}
                          className="w-full px-3 py-1.5 bg-muted/40 border border-border rounded-lg text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Phone</label>
                        <input
                          type="text"
                          readOnly
                          value={browserStep !== "navigating" ? "+1 (555) 304-9830" : ""}
                          className="w-full px-3 py-1.5 bg-muted/40 border border-border rounded-lg text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Resume upload */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Resume / CV</label>
                      <div className={`p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1.5 transition ${
                        browserStep === "uploading" ? "border-violet-500 bg-violet-500/5" : "border-border"
                      }`}>
                        <Upload className={`h-5 w-5 ${browserStep === "uploading" ? "text-violet-500 animate-bounce" : "text-muted-foreground"}`} />
                        <span className="text-xs font-bold text-foreground">
                          {browserStep === "uploading" || browserStep === "submitting" || browserStep === "idle"
                            ? "rahul_kumar_resume_optimized.pdf"
                            : "Click or drag resume file"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">PDF format - Max 5MB</span>

                        {browserStep === "uploading" && (
                          <div className="w-full max-w-xs mt-2 space-y-1">
                            <Progress value={uploadProgress} className="h-1" />
                            <div className="flex justify-between text-[9px] text-violet-500 font-semibold">
                              <span>Uploading CV...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        className={`w-full py-2.5 rounded-xl text-white font-bold text-xs transition flex items-center justify-center gap-2 ${
                          browserStep === "submitting"
                            ? "bg-violet-600/80 cursor-wait"
                            : "bg-violet-600 hover:bg-violet-700"
                        }`}
                      >
                        {browserStep === "submitting" ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            SUBMITTING FORM...
                          </>
                        ) : (
                          "SUBMIT APPLICATION"
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeBrowserTab === "submitting" && (
                <motion.div
                  key="submitting"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center max-w-sm mx-auto h-64 text-center space-y-4"
                >
                  <div className="h-16 w-16 bg-violet-600/10 border border-violet-500/20 rounded-full flex items-center justify-center shadow-lg">
                    <RefreshCw className="h-7 w-7 text-violet-500 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">Submitting form data</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Encrypting assets and transmitting final application nodes.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeBrowserTab === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-card border border-border/80 rounded-2xl p-8 max-w-md mx-auto w-full text-center space-y-5 shadow-lg relative overflow-hidden"
                >
                  {/* Floating sparkles */}
                  <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-violet-400 animate-ping" />
                  <div className="absolute bottom-6 right-8 h-2.5 w-2.5 rounded-full bg-blue-400 animate-ping" />

                  <div className="h-16 w-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-foreground text-xl">Submission Successful!</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      {currentJob ? currentJob.company : "Company"} recruiter has received your credentials. Status update stored in your workspace.
                    </p>
                  </div>

                  <div className="p-3 bg-muted/60 border border-border/80 rounded-xl space-y-1 max-w-xs mx-auto">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Receipt Hash</span>
                    <p className="font-mono text-xs font-bold text-foreground">AH-{Math.floor(100000 + Math.random() * 900000)}</p>
                  </div>

                  <p className="text-[10px] text-green-500 font-semibold animate-pulse">
                    Next queue agent executing in 3s...
                  </p>
                </motion.div>
              )}

              {activeBrowserTab === "success" === false && activeBrowserUrl === "about:blank" && (
                <motion.div
                  key="blank"
                  className="flex flex-col items-center justify-center text-center h-72 space-y-4"
                >
                  <div className="h-14 w-14 bg-accent/40 border border-border rounded-2xl flex items-center justify-center text-muted-foreground shadow-sm">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Chrome Sandbox Standby</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-normal">
                      Click 'Start Agent' to start automated browser searches, resume uploading, and form submissions.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  );
}
