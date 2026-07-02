import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import {
  User, FileText, GraduationCap, Briefcase, FolderOpen, Code2, Award,
  Languages, ShieldCheck, Heart, Users, GripVertical, Plus, Trash2,
  Undo2, Redo2, Save, ChevronDown, ChevronUp, Edit3, X
} from "lucide-react";

const SECTION_ICONS: Record<string, any> = {
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  projects: FolderOpen,
  skills: Code2,
  achievements: Award,
  certificates: ShieldCheck,
  languages: Languages,
  interests: Heart,
  references: Users,
};

const SECTION_LABELS: Record<string, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  achievements: "Achievements",
  certificates: "Certifications",
  languages: "Languages",
  interests: "Interests",
  references: "References",
};

export default function ResumeBuilder() {
  const {
    resume,
    updatePersonalInfo,
    updateSummary,
    updateSectionOrder,
    removeEducation,
    removeExperience,
    removeProject,
    removeSkill,
    removeAchievement,
    removeCertificate,
    removeLanguage,
    removeInterest,
    removeReference,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useResumeStudioStore();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(resume.sectionOrder.map((s) => [s, true]))
  );
  const [editingField, setEditingField] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleReorder = (newOrder: string[]) => {
    updateSectionOrder(newOrder);
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Resume Builder</h2>
          <p className="text-sm text-muted-foreground mt-1">Drag sections to reorder. Click to edit inline. Auto-saved.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
            <Save className="h-3.5 w-3.5" />
            <span className="text-xs font-bold">Auto-saved</span>
          </div>
        </div>
      </div>

      {/* Personal Info Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-violet-500/[0.03] pointer-events-none" />
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {(Object.entries(resume.personalInfo) as [string, string][]).map(([key, val]) => (
              <div key={key}>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => updatePersonalInfo({ [key]: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Reorderable Sections */}
      <Reorder.Group axis="y" values={resume.sectionOrder} onReorder={handleReorder} className="space-y-4">
        {resume.sectionOrder.map((section, idx) => {
          const Icon = SECTION_ICONS[section] || FileText;
          const label = SECTION_LABELS[section] || section;
          const isExpanded = expandedSections[section] !== false;

          return (
            <Reorder.Item key={section} value={section}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Section Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none hover:bg-accent/30 transition-colors"
                    onClick={() => toggleSection(section)}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                        {section === "summary" ? "1 block" : `${(resume as any)[section]?.length ?? 0} items`}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-border"
                    >
                      <div className="p-5">
                        {section === "summary" && (
                          <textarea
                            value={resume.summary}
                            onChange={(e) => updateSummary(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                          />
                        )}

                        {section === "experience" && (
                          <div className="space-y-4">
                            {resume.experience.map((exp) => (
                              <div
                                key={exp.id}
                                className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group relative"
                              >
                                <button
                                  onClick={() => removeExperience(exp.id)}
                                  className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <div className="flex items-start justify-between pr-8">
                                  <div>
                                    <h4 className="font-bold text-foreground text-sm">{exp.role}</h4>
                                    <p className="text-xs text-primary font-semibold mt-0.5">{exp.company} · {exp.location}</p>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-2 py-1 rounded-lg shrink-0">
                                    {exp.startDate} — {exp.endDate}
                                  </span>
                                </div>
                                <ul className="mt-3 space-y-1.5">
                                  {exp.bullets.map((b, bi) => (
                                    <li key={bi} className="text-xs text-foreground/80 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-primary/40">
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {section === "education" && (
                          <div className="space-y-3">
                            {resume.education.map((edu) => (
                              <div
                                key={edu.id}
                                className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group relative"
                              >
                                <button
                                  onClick={() => removeEducation(edu.id)}
                                  className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <h4 className="font-bold text-foreground text-sm">{edu.degree} in {edu.field}</h4>
                                <p className="text-xs text-primary font-semibold mt-0.5">{edu.institution}</p>
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-semibold">
                                  <span>{edu.startDate} — {edu.endDate}</span>
                                  <span>GPA: {edu.gpa}</span>
                                </div>
                                {edu.description && (
                                  <p className="text-xs text-foreground/70 mt-2 leading-relaxed">{edu.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {section === "projects" && (
                          <div className="space-y-3">
                            {resume.projects.map((proj) => (
                              <div
                                key={proj.id}
                                className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group relative"
                              >
                                <button
                                  onClick={() => removeProject(proj.id)}
                                  className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <h4 className="font-bold text-foreground text-sm">{proj.name}</h4>
                                <p className="text-xs text-foreground/70 mt-1 leading-relaxed">{proj.description}</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {proj.tech.map((t) => (
                                    <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/15">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section === "skills" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {resume.skills.map((skill) => (
                              <div
                                key={skill.id}
                                className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-foreground">{skill.name}</span>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-bold">{skill.category}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${skill.level}%` }} />
                                  </div>
                                  <span className="text-xs font-bold text-foreground w-8 text-right">{skill.level}%</span>
                                  <button
                                    onClick={() => removeSkill(skill.id)}
                                    className="p-0.5 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section === "achievements" && (
                          <div className="space-y-2">
                            {resume.achievements.map((ach) => (
                              <div
                                key={ach.id}
                                className="flex items-start justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group"
                              >
                                <div>
                                  <h4 className="text-sm font-bold text-foreground">{ach.title}</h4>
                                  <p className="text-xs text-foreground/70 mt-0.5">{ach.description}</p>
                                </div>
                                <button
                                  onClick={() => removeAchievement(ach.id)}
                                  className="p-1 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all shrink-0"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {section === "certificates" && (
                          <div className="space-y-2">
                            {resume.certificates.map((cert) => (
                              <div
                                key={cert.id}
                                className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group"
                              >
                                <div>
                                  <h4 className="text-sm font-bold text-foreground">{cert.name}</h4>
                                  <p className="text-xs text-muted-foreground">{cert.issuer} · {cert.date}</p>
                                </div>
                                <button
                                  onClick={() => removeCertificate(cert.id)}
                                  className="p-1 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {section === "languages" && (
                          <div className="flex flex-wrap gap-2">
                            {resume.languages.map((lang) => (
                              <div
                                key={lang.id}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group"
                              >
                                <span className="text-sm font-bold text-foreground">{lang.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold">{lang.proficiency}</span>
                                <button
                                  onClick={() => removeLanguage(lang.id)}
                                  className="p-0.5 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {section === "interests" && (
                          <div className="flex flex-wrap gap-2">
                            {resume.interests.map((interest) => (
                              <div
                                key={interest.id}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group"
                              >
                                <span className="text-sm font-medium text-foreground">{interest.name}</span>
                                <button
                                  onClick={() => removeInterest(interest.id)}
                                  className="p-0.5 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {section === "references" && (
                          <div className="space-y-3">
                            {resume.references.map((ref) => (
                              <div
                                key={ref.id}
                                className="p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors group relative"
                              >
                                <button
                                  onClick={() => removeReference(ref.id)}
                                  className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <h4 className="font-bold text-foreground text-sm">{ref.name}</h4>
                                <p className="text-xs text-primary font-semibold">{ref.title} at {ref.company}</p>
                                <p className="text-xs text-muted-foreground mt-1">{ref.email} · {ref.relationship}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}
