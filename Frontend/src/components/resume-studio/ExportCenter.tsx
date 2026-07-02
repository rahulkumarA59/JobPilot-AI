import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FileText, FileType, FileCode, FileDown, Link2, Check, Download,
  Copy, ExternalLink, Loader2, Package, RotateCcw
} from "lucide-react";
import { toast } from "sonner";

const exportFormats = [
  {
    id: "pdf",
    name: "PDF Document",
    description: "Professional PDF with fonts embedded. Best for applications.",
    icon: FileDown,
    ext: ".pdf",
    size: "~245 KB",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: "docx",
    name: "Word Document",
    description: "Editable DOCX format. Compatible with Microsoft Word and Google Docs.",
    icon: FileText,
    ext: ".docx",
    size: "~180 KB",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "txt",
    name: "Plain Text",
    description: "Simple text format. Best for ATS systems that strip formatting.",
    icon: FileType,
    ext: ".txt",
    size: "~12 KB",
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
  {
    id: "md",
    name: "Markdown",
    description: "Markdown format for developer portfolios and GitHub profiles.",
    icon: FileCode,
    ext: ".md",
    size: "~18 KB",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

export default function ExportCenter() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [linkCopied, setLinkCopied] = useState(false);
  const [bulkExporting, setBulkExporting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkStep, setBulkStep] = useState("");

  const handleDownload = (formatId: string) => {
    if (downloading || bulkExporting) return;
    setDownloading(formatId);
    setTimeout(() => {
      setDownloading(null);
      setCompleted((prev) => new Set(prev).add(formatId));
      toast.success(`Resume exported as ${formatId.toUpperCase()} successfully!`);
    }, 1500);
  };

  const handleBulkExport = () => {
    if (bulkExporting || downloading) return;
    setBulkExporting(true);
    setBulkProgress(0);
    setBulkStep("Preparing...");

    const formats = exportFormats.map((f) => f.id);
    let i = 0;

    const next = () => {
      if (i >= formats.length) {
        setBulkProgress(100);
        setBulkStep("Complete!");
        setTimeout(() => {
          setBulkExporting(false);
          setBulkProgress(0);
          setBulkStep("");
          setCompleted(new Set(formats));
          toast.success("All formats exported successfully!", {
            description: `${formats.length} files ready for download.`,
          });
        }, 800);
        return;
      }

      const fmt = exportFormats[i];
      setBulkStep(`Exporting ${fmt.name}...`);
      setBulkProgress(Math.round(((i + 0.5) / formats.length) * 100));

      setTimeout(() => {
        setCompleted((prev) => new Set(prev).add(formats[i]));
        setBulkProgress(Math.round(((i + 1) / formats.length) * 100));
        i++;
        setTimeout(next, 300);
      }, 800);
    };

    setTimeout(next, 400);
  };

  const handleReset = () => {
    setCompleted(new Set());
    toast("Export status reset.");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://autohire.ai/resume/rahul-kumar-v3");
    setLinkCopied(true);
    toast.success("Resume link copied to clipboard!");
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const allCompleted = completed.size === exportFormats.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Export Center</h2>
          <p className="text-sm text-muted-foreground mt-1">Download your resume in multiple formats or share via link.</p>
        </div>
        <div className="flex items-center gap-2">
          {completed.size > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
          <button
            onClick={handleBulkExport}
            disabled={bulkExporting || allCompleted}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold hover:from-blue-500 hover:to-violet-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {bulkExporting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Exporting...
              </>
            ) : allCompleted ? (
              <>
                <Check className="h-3.5 w-3.5" />
                All Exported
              </>
            ) : (
              <>
                <Package className="h-3.5 w-3.5" />
                Export All Formats
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bulk Progress Bar */}
      <AnimatePresence>
        {bulkExporting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">{bulkStep}</span>
                <span className="text-xs font-extrabold text-primary">{bulkProgress}%</span>
              </div>
              <Progress value={bulkProgress} className="h-2" />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed Summary */}
      <AnimatePresence>
        {allCompleted && !bulkExporting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/[0.06] border border-green-500/20">
              <Check className="h-4 w-4 text-green-500 shrink-0" />
              <p className="text-xs font-medium text-foreground/80">
                <span className="font-bold text-green-600 dark:text-green-400">All {exportFormats.length} formats exported</span>
                {" — "}Total estimated size: ~455 KB
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportFormats.map((fmt, i) => {
          const isDownloading = downloading === fmt.id;
          const isCompleted = completed.has(fmt.id);
          return (
            <motion.div
              key={fmt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <Card className={`p-5 transition-all group ${isCompleted ? "ring-1 ring-green-500/20 bg-green-500/[0.02]" : "hover:shadow-md"}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isCompleted ? "bg-green-500/10" : fmt.bg} shrink-0 transition-colors`}>
                    {isCompleted ? (
                      <Check className={`h-6 w-6 text-green-500`} />
                    ) : (
                      <fmt.icon className={`h-6 w-6 ${fmt.color}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-sm">{fmt.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-bold">{fmt.ext}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{fmt.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[10px] text-muted-foreground font-semibold">Est. size: {fmt.size}</span>
                      <button
                        onClick={() => handleDownload(fmt.id)}
                        disabled={isDownloading || bulkExporting}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isCompleted
                            ? "bg-green-500/10 text-green-600 border border-green-500/20"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                        } disabled:opacity-60`}
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Exporting...
                          </>
                        ) : isCompleted ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Downloaded
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5" />
                            Export
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Share Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Share Resume Link</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Generate a public link to share your resume with recruiters.</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 py-2.5 bg-muted/40 border border-border rounded-xl text-sm font-mono text-foreground/80 truncate">
              https://autohire.ai/resume/rahul-kumar-v3
            </div>
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                linkCopied
                  ? "bg-green-500/10 text-green-600 border border-green-500/20"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {linkCopied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Link
                </>
              )}
            </button>
            <a
              href="https://autohire.ai/resume/rahul-kumar-v3"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
