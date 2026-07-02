import { motion, AnimatePresence } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, RotateCcw, Copy, Trash2, CheckCircle2, FileText, ArrowUpRight, AlertTriangle } from "lucide-react";
import { formatDate } from "@/utils";
import { toast } from "sonner";
import { useState } from "react";

export default function VersionHistory() {
  const { versions, activeVersionId, restoreVersion, duplicateVersion, deleteVersion } = useResumeStudioStore();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleRestore = (id: string, name: string) => {
    restoreVersion(id);
    toast.success(`Restored "${name}" as active version.`);
  };

  const handleDuplicate = (id: string, name: string) => {
    duplicateVersion(id);
    toast.success(`Duplicated "${name}" successfully.`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirmDeleteId === id) {
      deleteVersion(id);
      setConfirmDeleteId(null);
      toast.success(`Deleted "${name}".`);
    } else {
      setConfirmDeleteId(id);
      // Auto-dismiss the confirm state after 3s
      setTimeout(() => setConfirmDeleteId((prev) => (prev === id ? null : prev)), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Version History</h2>
          <p className="text-sm text-muted-foreground mt-1">Track every iteration of your resume with automatic versioning.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground">{versions.length} version{versions.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Timeline Line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-border" />

        <AnimatePresence mode="popLayout">
          <div className="space-y-6">
            {versions.map((version, i) => {
              const isActive = version.id === activeVersionId;
              const isConfirmingDelete = confirmDeleteId === version.id;
              return (
                <motion.div
                  key={version.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="relative"
                >
                  {/* Timeline Node */}
                  <div className={`absolute -left-8 top-4 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    isActive
                      ? "bg-primary border-primary shadow-glow"
                      : "bg-card border-border"
                  }`}>
                    {isActive ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                    ) : (
                      <FileText className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>

                  <Card className={`p-5 transition-all hover:shadow-md ${
                    isActive ? "ring-1 ring-primary/30 bg-primary/[0.02]" : ""
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-foreground text-sm">{version.name}</h3>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Created {formatDate(version.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" />
                            Updated {formatDate(version.updatedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-muted-foreground">ATS Score</span>
                          <div className="w-32">
                            <Progress value={version.atsScore} className="h-1.5" />
                          </div>
                          <span className={`text-xs font-extrabold ${
                            version.atsScore >= 90 ? "text-green-500" :
                            version.atsScore >= 75 ? "text-blue-500" : "text-amber-500"
                          }`}>{version.atsScore}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isActive && (
                          <button
                            onClick={() => handleRestore(version.id, version.name)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Restore
                          </button>
                        )}
                        <button
                          onClick={() => handleDuplicate(version.id, version.name)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Duplicate
                        </button>
                        {!isActive && (
                          <button
                            onClick={() => handleDelete(version.id, version.name)}
                            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-bold transition-all ${
                              isConfirmingDelete
                                ? "border-destructive bg-destructive/10 text-destructive"
                                : "border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10"
                            }`}
                          >
                            {isConfirmingDelete ? (
                              <>
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Confirm
                              </>
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
