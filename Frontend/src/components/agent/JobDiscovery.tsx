import React, { useState } from "react";
import { useAgentStore, QueueItem } from "@/store/agentStore";
import { Search, SlidersHorizontal, Plus, Check, Briefcase, MapPin, Building, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function JobDiscovery() {
  const { queue, updateQueueItemStatus } = useAgentStore();
  const [search, setSearch] = useState("");
  const [minMatch, setMinMatch] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"score" | "company">("score");

  // Mock discovered jobs not yet in the active queue
  const [discoveredJobs, setDiscoveredJobs] = useState<QueueItem[]>([
    ...queue,
    {
      id: "disc-1",
      role: "Senior UI Architect",
      company: "Supabase",
      status: "Queued" as const,
      matchScore: 94,
      reason: "High alignment with Postgres schema designs, custom tables, and Tailwind config.",
      logo: "supabase"
    },
    {
      id: "disc-2",
      role: "Frontend Engineer",
      company: "Vercel",
      status: "Submitted" as const,
      matchScore: 98,
      reason: "Expert alignment with React, Next.js, and modern CSS frameworks.",
      logo: "vercel"
    },
    {
      id: "disc-3",
      role: "React Native Developer",
      company: "Expo",
      status: "Queued" as const,
      matchScore: 86,
      reason: "Good React foundation, requires slight ramp up in native module configurations.",
      logo: "expo"
    },
    {
      id: "disc-4",
      role: "Staff Product Engineer",
      company: "Clerk",
      status: "Queued" as const,
      matchScore: 90,
      reason: "Excellent fit for auth components, custom hook design, and session management.",
      logo: "clerk"
    }
  ].filter((item, index, self) => self.findIndex(t => t.id === item.id) === index)); // deduplicate by ID

  const handleToggleQueue = (job: QueueItem) => {
    // If the job is in agentStore queue, we toggle status
    const inStore = queue.find(q => q.id === job.id);
    if (inStore) {
      // Toggle
      if (inStore.status === "Queued") {
        updateQueueItemStatus(job.id, "Rejected"); // or remove
      } else {
        updateQueueItemStatus(job.id, "Queued");
      }
    } else {
      // It's a discovered job, let's say we toggle it
      setDiscoveredJobs(prev =>
        prev.map(j => (j.id === job.id ? { ...j, status: j.status === "Queued" ? "Rejected" : "Queued" } : j))
      );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-500 bg-green-500/10 border-green-500/20";
    if (score >= 90) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  };

  // Filter & Sort
  const filteredJobs = discoveredJobs
    .filter(job => {
      const matchSearch =
        job.role.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase());
      const matchScore = job.matchScore >= minMatch;
      return matchSearch && matchScore;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.matchScore - a.matchScore;
      return a.company.localeCompare(b.company);
    });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Job Discovery</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            AutoHire scans 20+ channels hourly. Real-time relevance calculations matching your resume profile.
          </p>
        </div>

        {/* Filter bars */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search roles or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border/80 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 bg-card border border-border/80 rounded-xl px-3 py-1.5 text-xs text-muted-foreground font-semibold">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none text-foreground font-bold cursor-pointer"
            >
              <option value="score">Sort by ATS Match</option>
              <option value="company">Sort Alphabetically</option>
            </select>
          </div>

          {/* Filter Tab buttons */}
          <div className="flex items-center bg-muted rounded-xl p-1 text-xs">
            <button
              onClick={() => setMinMatch(0)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                minMatch === 0 ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setMinMatch(92)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                minMatch === 92 ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              High Match (92%+)
            </button>
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-card border border-border/80 rounded-2xl">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground font-medium">No matching jobs found.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="p-5 bg-card border-border/80 flex flex-col justify-between hover:shadow-md transition duration-300 relative overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-border/60 flex items-center justify-center font-bold text-foreground text-sm uppercase shrink-0">
                      {job.company[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition">
                        {job.role}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-semibold">
                        <span className="flex items-center gap-0.5"><Building className="h-3 w-3" /> {job.company}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> Remote</span>
                      </div>
                    </div>
                  </div>

                  {/* ATS Circle Gauge */}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${getScoreColor(job.matchScore)}`}>
                    {job.matchScore}% match
                  </span>
                </div>

                {/* AI Reasoning */}
                <div className="p-3 bg-muted/40 border border-border/60 rounded-xl space-y-1">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">AI Reasoning</span>
                  <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                    {job.reason}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60">
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Scanned 3 hours ago
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleQueue(job)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                      job.status === "Submitted"
                        ? "bg-green-500/10 text-green-500 border-green-500/20 cursor-default"
                        : job.status === "Queued"
                        ? "bg-primary text-primary-foreground border-transparent hover:bg-primary/90"
                        : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {job.status === "Submitted" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Applied
                      </>
                    ) : job.status === "Queued" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        In Queue
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        Queue Job
                      </>
                    )}
                  </button>

                  <a
                    href={`https://google.com/search?q=${encodeURIComponent(job.role + " " + job.company)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
