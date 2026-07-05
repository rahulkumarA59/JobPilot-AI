import { motion, AnimatePresence } from 'framer-motion';
import { useBrowserAutomationStore } from '../store/browserAutomationStore';
import { RotateCcw, X, ChevronRight } from 'lucide-react';

const tabColors: Record<string, string> = {
  '🔵': 'from-blue-600 to-blue-400',
  '🟢': 'from-emerald-600 to-emerald-400',
  '🟡': 'from-amber-600 to-amber-400',
};

export function BrowserPreview() {
  const {
    tabs, activeTabId, setActiveTab,
    currentUrl, currentPage, currentWebsite,
    isLoading, currentApplication,
    automationStatus,
  } = useBrowserAutomationStore();

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 overflow-hidden flex flex-col">
      {/* Chrome window chrome */}
      <div className="bg-slate-900/80 px-3 py-2 flex items-center gap-2 border-b border-white/10">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-3 w-3 rounded-full bg-rose-500 hover:bg-rose-400 cursor-pointer transition-colors" />
          <div className="h-3 w-3 rounded-full bg-amber-500 hover:bg-amber-400 cursor-pointer transition-colors" />
          <div className="h-3 w-3 rounded-full bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-colors" />
        </div>

        {/* Tabs */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none ml-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-[11px] font-medium shrink-0 max-w-[160px] transition-all ${
                tab.active
                  ? 'bg-slate-800 text-white border border-b-0 border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-[10px]">{tab.favicon}</span>
              <span className="truncate">{tab.title}</span>
              {tab.active && (
                <X className="h-2.5 w-2.5 ml-auto shrink-0 opacity-50 hover:opacity-100" />
              )}
            </button>
          ))}
          <button className="text-slate-400 hover:text-slate-200 px-2 text-xs shrink-0">+</button>
        </div>
      </div>

      {/* Address bar */}
      <div className="bg-slate-800/60 px-3 py-2 flex items-center gap-2 border-b border-white/10">
        <button className="text-slate-400 hover:text-slate-200 transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <button className="text-slate-400 hover:text-slate-200 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button className="text-slate-400 hover:text-slate-200 transition-colors">
          <RotateCcw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 bg-slate-900/60 rounded-full px-3 py-1.5 border border-white/10">
          <div className="h-3 w-3 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-[11px] text-slate-300 font-mono truncate flex-1">{currentUrl}</span>
          {automationStatus === 'running' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-3 w-3 rounded-full border-2 border-blue-500/40 border-t-blue-500 shrink-0"
            />
          )}
        </div>
      </div>

      {/* Browser content area */}
      <div className="relative flex-1 min-h-[340px] bg-slate-950/40 overflow-hidden">
        {/* Loading bar */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{ transformOrigin: 'left' }}
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 z-10"
            />
          )}
        </AnimatePresence>

        {/* Mock webpage content */}
        <div className="absolute inset-0 p-4 overflow-hidden">
          {/* Mock LinkedIn header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">in</span>
              </div>
              <div className="h-6 w-28 bg-white/5 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-white/5 rounded-full" />
              <div className="h-6 w-16 bg-blue-600/30 rounded-full" />
            </div>
          </div>

          {/* Mock job listing content */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 shrink-0 flex items-center justify-center text-lg">
                {currentApplication?.logo ? '🔵' : '🏢'}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-white/80 rounded w-3/4 text-[10px] font-bold text-slate-900 px-1 flex items-center">
                  <span className="truncate">{currentApplication?.role ?? 'Senior Frontend Engineer'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-white/30 rounded w-24" />
                  <div className="h-3 bg-white/20 rounded w-16" />
                </div>
                <div className="flex gap-1">
                  {['React', 'TypeScript', 'Remote'].map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 text-[9px] rounded font-bold">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 bg-white/3 rounded-xl border border-white/5 ${i === 0 ? 'opacity-60' : 'opacity-30'}`}>
                <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-white/20 rounded" style={{ width: `${70 + i * 5}%` }} />
                  <div className="h-2.5 bg-white/10 rounded w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>

          {/* Page info overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
              <div className={`h-2 w-2 rounded-full ${automationStatus === 'running' ? 'bg-emerald-500 animate-pulse' : automationStatus === 'paused' ? 'bg-amber-500' : 'bg-slate-500'}`} />
              <span className="text-[10px] font-bold text-slate-300">{currentPage}</span>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
              <span className="text-[10px] font-bold text-blue-400">{currentWebsite}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
