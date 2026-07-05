import { motion } from 'framer-motion';
import { useBrowserAutomationStore } from '../store/browserAutomationStore';
import { Cpu, LayersIcon, TrendingUp, Timer } from 'lucide-react';

export function SystemStatusPanel() {
  const { systemStatus } = useBrowserAutomationStore();

  const stats = [
    {
      label: 'Workers',
      value: `${systemStatus.activeWorkers}/${systemStatus.workers}`,
      icon: Cpu,
      color: 'text-blue-400',
      bg: 'from-blue-600/10 to-transparent',
      border: 'border-blue-500/20',
      sub: 'Active / Total',
    },
    {
      label: 'Queue Size',
      value: systemStatus.queueSize,
      icon: LayersIcon,
      color: 'text-violet-400',
      bg: 'from-violet-600/10 to-transparent',
      border: 'border-violet-500/20',
      sub: 'Pending items',
    },
    {
      label: 'Success Rate',
      value: `${systemStatus.successRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'from-emerald-600/10 to-transparent',
      border: 'border-emerald-500/20',
      sub: 'All time',
    },
    {
      label: 'Avg Time',
      value: systemStatus.averageTime,
      icon: Timer,
      color: 'text-amber-400',
      bg: 'from-amber-600/10 to-transparent',
      border: 'border-amber-500/20',
      sub: 'Per application',
    },
  ];

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="text-base">⚙️</span> System Status
        </h3>
        <span className="text-[10px] text-muted-foreground">
          {systemStatus.totalProcessed} total processed
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`p-4 rounded-xl border ${stat.border} bg-gradient-to-br ${stat.bg} relative overflow-hidden`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>

              {/* Decorative bg glow */}
              <div className={`absolute -right-4 -bottom-4 h-12 w-12 rounded-full opacity-20 blur-xl ${stat.color} bg-current`} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
