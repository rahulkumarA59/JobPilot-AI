import { motion } from "framer-motion";
import { useResumeStudioStore } from "@/store/resumeStudioStore";
import { Card } from "@/components/ui/card";
import {
  ZoomIn, ZoomOut, Download, Printer, Maximize2, FileText,
  Mail, Phone, MapPin, Globe
} from "lucide-react";
import { Linkedin, Github } from "@/components/common/BrandIcons";

interface TemplateStyle {
  paperClass: string;
  headerClass: string;
  nameClass: string;
  titleClass: string;
  contactContainerClass: string;
  sectionTitleClass: string;
  textClass: string;
  boldTextClass: string;
  bulletClass: string;
  accentTextClass: string;
  dividerColor: string;
}

const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  minimal: {
    paperClass: "bg-white text-slate-900 font-sans",
    headerClass: "text-center border-b pb-4 mb-4 border-slate-300",
    nameClass: "text-2xl font-bold tracking-tight text-slate-900",
    titleClass: "text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1",
    contactContainerClass: "flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-500",
    sectionTitleClass: "text-[10px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-1 mb-2.5",
    textClass: "text-[10px] leading-relaxed text-slate-600",
    boldTextClass: "font-semibold text-slate-800",
    bulletClass: "before:bg-slate-400",
    accentTextClass: "text-slate-700",
    dividerColor: "border-slate-200"
  },
  professional: {
    paperClass: "bg-white text-gray-900 font-sans",
    headerClass: "text-left border-b-2 border-indigo-600 pb-4 mb-4",
    nameClass: "text-2xl font-extrabold tracking-tight text-gray-900",
    titleClass: "text-sm text-indigo-600 font-bold mt-0.5",
    contactContainerClass: "flex items-center justify-start flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-gray-500",
    sectionTitleClass: "text-[10px] font-bold uppercase tracking-widest text-indigo-600 border-b border-gray-200 pb-1 mb-2.5",
    textClass: "text-[10px] leading-relaxed text-gray-700",
    boldTextClass: "font-bold text-gray-900",
    bulletClass: "before:bg-indigo-400",
    accentTextClass: "text-indigo-600 font-semibold",
    dividerColor: "border-gray-200"
  },
  google: {
    paperClass: "bg-white text-gray-900 font-sans",
    headerClass: "text-center pb-3 mb-4",
    nameClass: "text-3xl font-normal tracking-tight text-gray-950",
    titleClass: "text-xs text-blue-600 font-medium mt-1",
    contactContainerClass: "flex items-center justify-center flex-wrap gap-x-3 gap-y-1 mt-1 text-[10px] text-gray-500",
    sectionTitleClass: "text-[10px] font-bold uppercase tracking-wide text-gray-800 border-b border-gray-300 pb-0.5 mb-2",
    textClass: "text-[10px] leading-relaxed text-gray-600",
    boldTextClass: "font-bold text-gray-800",
    bulletClass: "before:bg-gray-400",
    accentTextClass: "text-blue-600",
    dividerColor: "border-gray-300"
  },
  microsoft: {
    paperClass: "bg-neutral-50 text-neutral-900 font-sans",
    headerClass: "text-left bg-neutral-900 text-white p-5 rounded-sm -mx-5 -mt-5 mb-5",
    nameClass: "text-2xl font-bold tracking-tight text-white",
    titleClass: "text-xs text-neutral-300 font-semibold mt-1",
    contactContainerClass: "flex items-center justify-start flex-wrap gap-x-4 gap-y-1 mt-2 text-[9px] text-neutral-300",
    sectionTitleClass: "text-[10px] font-bold uppercase tracking-widest text-neutral-800 border-l-4 border-blue-600 pl-2 pb-0.5 mb-2.5",
    textClass: "text-[10px] leading-relaxed text-neutral-600",
    boldTextClass: "font-bold text-neutral-800",
    bulletClass: "before:bg-blue-500",
    accentTextClass: "text-blue-600 font-bold",
    dividerColor: "border-neutral-200"
  },
  startup: {
    paperClass: "bg-white text-slate-900 font-sans",
    headerClass: "text-left p-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg mb-5 shadow-sm",
    nameClass: "text-2xl font-black tracking-tight text-white",
    titleClass: "text-xs text-violet-200 font-bold uppercase tracking-wider mt-1",
    contactContainerClass: "flex items-center justify-start flex-wrap gap-x-4 gap-y-1 mt-3 text-[9px] text-violet-100/90",
    sectionTitleClass: "text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50/70 px-2 py-1 rounded mb-2.5",
    textClass: "text-[10px] leading-relaxed text-slate-600",
    boldTextClass: "font-extrabold text-slate-900",
    bulletClass: "before:bg-indigo-500",
    accentTextClass: "text-indigo-600 font-bold",
    dividerColor: "border-slate-100"
  },
  executive: {
    paperClass: "bg-[#fafaf9] text-stone-900 font-serif",
    headerClass: "text-center border-b-2 border-amber-800 pb-4 mb-4",
    nameClass: "text-2xl font-bold tracking-tight text-stone-900",
    titleClass: "text-xs italic text-amber-800 mt-1 font-semibold",
    contactContainerClass: "flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-stone-500",
    sectionTitleClass: "text-[10px] font-bold uppercase tracking-widest text-amber-800 border-b border-stone-300 pb-1 mb-2.5",
    textClass: "text-[10px] leading-relaxed text-stone-700",
    boldTextClass: "font-bold text-stone-900",
    bulletClass: "before:bg-amber-700",
    accentTextClass: "text-amber-800 font-semibold",
    dividerColor: "border-stone-200"
  },
  dark: {
    paperClass: "bg-zinc-950 text-zinc-100 font-sans",
    headerClass: "text-center border-b border-zinc-800 pb-4 mb-4",
    nameClass: "text-2xl font-extrabold tracking-tight text-white",
    titleClass: "text-xs text-purple-400 font-bold tracking-wider mt-1 uppercase",
    contactContainerClass: "flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-zinc-400",
    sectionTitleClass: "text-[10px] font-bold uppercase tracking-widest text-purple-400 border-b border-zinc-800 pb-1 mb-2.5",
    textClass: "text-[10px] leading-relaxed text-zinc-450",
    boldTextClass: "font-bold text-white",
    bulletClass: "before:bg-purple-500",
    accentTextClass: "text-purple-400 font-medium",
    dividerColor: "border-zinc-800"
  },
  academic: {
    paperClass: "bg-white text-gray-900 font-serif",
    headerClass: "text-center border-b-2 border-gray-900 pb-3 mb-5",
    nameClass: "text-2xl font-medium tracking-tight text-gray-950",
    titleClass: "text-xs text-gray-500 mt-1 uppercase tracking-widest",
    contactContainerClass: "flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-gray-600",
    sectionTitleClass: "text-[10px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-400 pb-0.5 mb-3",
    textClass: "text-[10px] leading-relaxed text-gray-800",
    boldTextClass: "font-semibold text-gray-950",
    bulletClass: "before:bg-gray-500",
    accentTextClass: "text-gray-950 font-semibold",
    dividerColor: "border-gray-300"
  },
  creative: {
    paperClass: "bg-[#fffaf0] text-[#1c1917] font-sans",
    headerClass: "text-left border-l-8 border-rose-500 pl-4 py-1 mb-5",
    nameClass: "text-3xl font-black tracking-tighter text-[#1c1917]",
    titleClass: "text-sm text-rose-500 font-black uppercase tracking-widest mt-0.5",
    contactContainerClass: "flex items-center justify-start flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-stone-500",
    sectionTitleClass: "text-[10px] font-bold uppercase tracking-widest text-[#1c1917] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full inline-block mb-3",
    textClass: "text-[10px] leading-relaxed text-stone-700",
    boldTextClass: "font-extrabold text-[#1c1917]",
    bulletClass: "before:bg-rose-400",
    accentTextClass: "text-rose-500 font-bold",
    dividerColor: "border-rose-200"
  }
};

export default function ResumePreview() {
  const { resume, zoomLevel, setZoomLevel, selectedTemplate } = useResumeStudioStore();
  const { personalInfo, summary, experience, education, projects, skills, achievements, certificates } = resume;

  const style = TEMPLATE_STYLES[selectedTemplate] || TEMPLATE_STYLES.minimal;

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Resume Preview</h2>
          <p className="text-sm text-muted-foreground mt-1">Template: <span className="font-bold text-foreground capitalize">{selectedTemplate}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} className="p-2 rounded-lg hover:bg-card transition-colors">
              <ZoomOut className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="px-3 text-xs font-bold text-foreground min-w-[3rem] text-center">{zoomLevel}%</span>
            <button onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))} className="p-2 rounded-lg hover:bg-card transition-colors">
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <button className="p-2 rounded-lg border border-border hover:bg-accent transition-colors" title="Download PDF">
            <Download className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg border border-border hover:bg-accent transition-colors" title="Print">
            <Printer className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-lg border border-border hover:bg-accent transition-colors" title="Fullscreen">
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Preview Paper */}
      <div className="flex justify-center overflow-auto py-8 bg-muted/30 rounded-2xl border border-border min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`shadow-2xl rounded-sm origin-top transition-colors duration-300 ${style.paperClass}`}
          style={{
            width: `${8.5 * (zoomLevel / 100)}in`,
            minHeight: `${11 * (zoomLevel / 100)}in`,
            padding: `${0.6 * (zoomLevel / 100)}in`,
            fontSize: `${(zoomLevel / 100) * 100}%`,
          }}
        >
          {/* Header */}
          <div className={style.headerClass}>
            <h1 className={style.nameClass}>{personalInfo.fullName}</h1>
            <p className={style.titleClass}>{personalInfo.title}</p>
            <div className={style.contactContainerClass}>
              <span className="flex items-center gap-1"><Mail className="h-3 w-3 shrink-0" /> {personalInfo.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3 w-3 shrink-0" /> {personalInfo.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /> {personalInfo.location}</span>
              <span className="flex items-center gap-1"><Globe className="h-3 w-3 shrink-0" /> {personalInfo.website}</span>
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1"><Linkedin size={12} className="h-3 w-3 shrink-0" /> {personalInfo.linkedin}</span>
              )}
              {personalInfo.github && (
                <span className="flex items-center gap-1"><Github size={12} className="h-3 w-3 shrink-0" /> {personalInfo.github}</span>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-4">
            <h2 className={style.sectionTitleClass}>Professional Summary</h2>
            <p className={style.textClass}>{summary}</p>
          </div>

          {/* Experience */}
          <div className="mb-4">
            <h2 className={style.sectionTitleClass}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className={`text-xs ${style.boldTextClass}`}>{exp.role}</span>
                    <span className={style.textClass}> — {exp.company}, {exp.location}</span>
                  </div>
                  <span className="text-[9px] opacity-70 shrink-0">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="mt-1 space-y-0.5">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} className={`text-[10px] leading-relaxed pl-3 relative before:absolute before:left-0 before:top-[6px] before:h-1 before:w-1 before:rounded-full ${style.bulletClass} ${style.textClass}`}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="mb-4">
            <h2 className={style.sectionTitleClass}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className={`text-xs ${style.boldTextClass}`}>{edu.degree} in {edu.field}</span>
                    <span className={style.textClass}> — {edu.institution}</span>
                  </div>
                  <span className="text-[9px] opacity-70 shrink-0">{edu.startDate} – {edu.endDate}</span>
                </div>
                <p className={`text-[9px] opacity-70 mt-0.5 ${style.textClass}`}>GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="mb-4">
            <h2 className={style.sectionTitleClass}>Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <span className={`text-xs ${style.boldTextClass}`}>{proj.name}</span>
                <p className={style.textClass}>{proj.description}</p>
                <p className={`text-[9px] mt-0.5 ${style.accentTextClass}`}>{proj.tech.join(" · ")}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mb-4">
            <h2 className={style.sectionTitleClass}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="px-2 py-0.5 rounded text-[9px] font-semibold bg-black/5 dark:bg-white/5 text-inherit border border-black/10 dark:border-white/10">
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {certificates.length > 0 && (
            <div className="mb-4">
              <h2 className={style.sectionTitleClass}>Certifications</h2>
              {certificates.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline mb-1">
                  <span className={`text-xs ${style.textClass}`}><span className={style.boldTextClass}>{cert.name}</span> — {cert.issuer}</span>
                  <span className="text-[9px] opacity-70">{cert.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <h2 className={style.sectionTitleClass}>Achievements</h2>
              {achievements.map((ach) => (
                <div key={ach.id} className="mb-1">
                  <span className={`text-xs ${style.boldTextClass}`}>{ach.title}</span>
                  <span className={`text-xs ${style.textClass}`}> — {ach.description}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
