import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Briefcase, Sparkles, Bookmark, BookmarkCheck, ExternalLink, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockJobs } from "@/services/mockData";
import { cn, formatSalaryRange } from "@/utils";

export default function JobSearchPage() {
  const [jobs, setJobs] = useState(mockJobs);
  const [search, setSearch] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(mockJobs[0]?.id || "");
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const handleBookmark = (id: string) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, isBookmarked: !j.isBookmarked } : j)));
  };

  const handleApply = (id: string) => {
    setApplyingId(id);
    setTimeout(() => {
      setApplyingId(null);
      setAppliedIds([...appliedIds, id]);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">AI Job Search</h1>
          <p className="text-muted-foreground mt-1">Discover matching jobs and auto-apply in 1-click using AI</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="purple" className="px-3 py-1 text-xs gap-1">
            <Sparkles className="h-3.5 w-3.5" /> AI Recommendation Engine Active
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3 shrink-0">
        <Input
          placeholder="Search roles, skills, or companies..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md bg-card"
        />
        <Button variant="outline" className="gap-2">
          <MapPin className="h-4 w-4" /> Location
        </Button>
        <Button variant="outline" className="gap-2">
          <Briefcase className="h-4 w-4" /> Job Type
        </Button>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Left Side: Jobs List */}
        <div className="w-full md:w-[40%] overflow-y-auto pr-2 space-y-3">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-border">
              <p className="text-muted-foreground">No jobs found matching your search.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-200 cursor-pointer bg-card flex gap-3 relative",
                  selectedJobId === job.id
                    ? "border-primary shadow-premium"
                    : "border-border hover:border-primary/40"
                )}
              >
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="h-8 w-8 object-contain" />
                  ) : (
                    <span className="text-sm font-bold">{job.company[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 justify-between">
                    <h3 className="font-semibold text-sm truncate leading-tight pr-4">{job.title}</h3>
                    {job.matchScore && (
                      <Badge variant="purple" className="text-[10px] px-1.5 py-0 shrink-0">
                        {job.matchScore}% Match
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.company} · {job.location}</p>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">{job.workMode}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{job.jobType}</Badge>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(job.id);
                  }}
                  className="absolute right-3 bottom-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {job.isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Job details */}
        {selectedJob && (
          <div className="hidden md:flex flex-col flex-1 bg-card border border-border rounded-2xl overflow-hidden min-h-0">
            {/* Header */}
            <div className="p-6 border-b border-border space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                    {selectedJob.companyLogo ? (
                      <img src={selectedJob.companyLogo} alt={selectedJob.company} className="h-10 w-10 object-contain" />
                    ) : (
                      <span className="text-lg font-bold">{selectedJob.company[0]}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedJob.company} · {selectedJob.location}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleBookmark(selectedJob.id)}
                >
                  {selectedJob.isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <strong className="text-foreground">{selectedJob.jobType}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Work Mode:</span>{" "}
                  <strong className="text-foreground">{selectedJob.workMode}</strong>
                </div>
                {selectedJob.salaryMin && selectedJob.salaryMax && (
                  <div>
                    <span className="text-muted-foreground">Salary:</span>{" "}
                    <strong className="text-foreground">
                      {formatSalaryRange(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.currency)}
                    </strong>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {appliedIds.includes(selectedJob.id) ? (
                  <Button variant="outline" className="gap-2 w-full sm:w-auto text-green-600 border-green-500/30 bg-green-500/5 cursor-default">
                    <CheckCircle2 className="h-4 w-4" /> Applied Successfully
                  </Button>
                ) : (
                  <Button
                    variant="gradient"
                    className="gap-2 w-full sm:w-auto"
                    loading={applyingId === selectedJob.id}
                    onClick={() => handleApply(selectedJob.id)}
                  >
                    <Zap className="h-4 w-4" /> AI Auto Apply
                  </Button>
                )}
                <a href={selectedJob.source} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    External Link <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-base mb-2">Job Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-base mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-base mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
