import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Upload, Sparkles, AlertCircle, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { profileService } from "@/services/profile.service";

export default function ResumePage() {
  const [uploading, setUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<string | null>("resume_rahul_dev.pdf");
  const [customScore, setCustomScore] = useState<number | null>(null);

  const { data: scores, refetch } = useQuery({
    queryKey: ["resume-scores"],
    queryFn: () => profileService.getResumeScore(),
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResumeFile(file.name);

    setTimeout(() => {
      setUploading(false);
      setCustomScore(Math.floor(Math.random() * 15) + 80);
      refetch();
    }, 2000);
  };

  const displayAts = customScore !== null ? customScore : (scores?.atsScore ?? 82);
  const displayResume = customScore !== null ? Math.min(100, customScore - 4) : (scores?.resumeScore ?? 78);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resume AI</h1>
          <p className="text-muted-foreground mt-1">Optimize your resume using AI targeting specific ATS parameters</p>
        </div>
        {resumeFile && (
          <Badge variant="success" className="gap-1.5 px-3 py-1 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" /> Active Resume Loaded
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Upload / File Status */}
        <div className="md:col-span-1 space-y-4">
          <Card className="p-6 text-center border-dashed border-2 border-border/70 hover:border-primary/50 transition-colors relative">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <div className="space-y-4 py-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-sm">Upload New Resume</p>
                <p className="text-xs text-muted-foreground mt-1">Supports PDF or DOCX up to 10MB</p>
              </div>
              {uploading && (
                <div className="space-y-2">
                  <p className="text-xs text-primary animate-pulse">Analyzing document...</p>
                  <Progress value={45} className="h-1.5" />
                </div>
              )}
            </div>
          </Card>

          {resumeFile && (
            <Card className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{resumeFile}</p>
                <p className="text-xs text-muted-foreground mt-0.5">PDF Document</p>
              </div>
            </Card>
          )}
        </div>

        {/* Right Side: ATS Score & AI Feedback */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 text-center">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ATS Score</p>
              <p className="text-5xl font-bold gradient-text mt-3 mb-4">{displayAts}</p>
              <Progress value={displayAts} className="h-2" />
              <p className="text-xs text-muted-foreground mt-3">Target score is 80+ to bypass systems</p>
            </Card>

            <Card className="p-5 text-center">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Formatting & Structure</p>
              <p className="text-5xl font-bold gradient-text mt-3 mb-4">{displayResume}</p>
              <Progress value={displayResume} className="h-2" colorClass="bg-gradient-to-r from-violet-500 to-pink-500" />
              <p className="text-xs text-muted-foreground mt-3">Good formatting practices followed</p>
            </Card>
          </div>

          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">AI Suggestions for Improvement</CardTitle>
              </div>
              <CardDescription className="text-xs">Based on matches with modern software engineering roles</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {scores?.suggestions.map((suggestion, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl border border-border/50 bg-muted/20">
                  <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    💡
                  </div>
                  <div>
                    <p className="text-sm font-medium">{suggestion}</p>
                    <p className="text-xs text-muted-foreground mt-1">This will increase your match relevance by up to +12 points.</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
