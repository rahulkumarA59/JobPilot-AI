import { motion } from 'framer-motion';
import { useBrowserAutomationStore } from '../store/browserAutomationStore';
import { ExternalLink, FileText, Mail, Target } from 'lucide-react';

export function CurrentApplicationPanel() {
  const { currentApplication } = useBrowserAutomationStore();

  if (!currentApplication) {
    return (
      <div className="glassmorphism rounded-2xl border border-white/10 p-5 flex items-center justify-center min-h-[180px]">
        <p className="text-sm text-muted-foreground italic">No active application</p>
      </div>
    );
  }

  const { company, role, matchPercent, resumeVersion, coverLetterVersion, applicationStatus, url } =
    currentApplication;

  const matchColor =
    matchPercent >= 90
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : matchPercent >= 75
      ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="text-base">🏢</span> Current Application
        </h3>
        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20 animate-pulse">
          {applicationStatus}
        </span>
      </div>

      <div className="space-y-3">
        {/* Company + Role */}
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/20 flex items-center justify-center text-xl shrink-0">
            🔵
          </div>
          <div>
            <h4 className="font-extrabold text-foreground text-sm">{company}</h4>
            <p className="text-xs text-muted-foreground">{role}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors mt-0.5"
            >
              {url} <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>

        {/* Match % */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Target className="h-3 w-3" /> Match Score
            </span>
            <span className={`px-2 py-0.5 rounded-full border font-black ${matchColor}`}>
              {matchPercent}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${matchPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                matchPercent >= 90 ? 'bg-emerald-500' : matchPercent >= 75 ? 'bg-blue-500' : 'bg-amber-500'
              }`}
            />
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-white/3 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <FileText className="h-3 w-3 text-violet-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Resume</span>
            </div>
            <p className="text-xs font-bold text-foreground">{resumeVersion}</p>
          </div>
          <div className="bg-white/3 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Mail className="h-3 w-3 text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Cover Letter</span>
            </div>
            <p className="text-xs font-bold text-foreground">{coverLetterVersion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
