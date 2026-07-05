import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

import { BrowserPreview } from './components/BrowserPreview';
import { LiveAutomationSteps } from './components/LiveAutomationSteps';
import { MouseSimulation } from './components/MouseSimulation';
import { AutomationTimeline } from './components/AutomationTimeline';
import { CurrentApplicationPanel } from './components/CurrentApplicationPanel';
import { ApplicationQueue } from './components/ApplicationQueue';
import { AutomationControls } from './components/AutomationControls';
import { SystemStatusPanel } from './components/SystemStatusPanel';
import { NotificationsPanel } from './components/NotificationsPanel';
import { useBrowserAutomationStore } from './store/browserAutomationStore';

export default function BrowserAutomationDashboard() {
  const { automationStatus, queue, notifications } = useBrowserAutomationStore();

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const runningCount = queue.filter((q) => q.status === 'running').length;
  const completedCount = queue.filter((q) => q.status === 'completed').length;
  const failedCount = queue.filter((q) => q.status === 'failed').length;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-foreground">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent flex items-center gap-3">
            <Bot className="h-8 w-8 text-indigo-500" />
            Browser Automation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live AI agent submitting job applications autonomously — watch it work in real-time.
          </p>
        </div>

        {/* Quick stats row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
            automationStatus === 'running'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : automationStatus === 'paused'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : automationStatus === 'completed'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
          }`}>
            <div className={`h-2 w-2 rounded-full ${
              automationStatus === 'running' ? 'bg-emerald-500 animate-pulse' :
              automationStatus === 'paused' ? 'bg-amber-500' :
              automationStatus === 'completed' ? 'bg-blue-500' :
              'bg-slate-500'
            }`} />
            {automationStatus.charAt(0).toUpperCase() + automationStatus.slice(1)}
          </div>
          <span className="text-xs font-bold text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            🏃 {runningCount} Running
          </span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            ✅ {completedCount} Done
          </span>
          {failedCount > 0 && (
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
              ❌ {failedCount} Failed
            </span>
          )}
          {unreadNotifications > 0 && (
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
              🔔 {unreadNotifications} New
            </span>
          )}
        </div>
      </motion.div>

      {/* ─── Controls ─── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <AutomationControls />
      </motion.div>

      {/* ─── System Status ─── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SystemStatusPanel />
      </motion.div>

      {/* ─── Main Grid ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left column: Browser Preview + Mouse Sim */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="xl:col-span-5 space-y-6"
        >
          <BrowserPreview />
          <MouseSimulation />
          <CurrentApplicationPanel />
        </motion.div>

        {/* Right column: Steps + Queue + Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-7 space-y-6"
        >
          <LiveAutomationSteps />
          <AutomationTimeline />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ApplicationQueue />
            <NotificationsPanel />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
