import { motion, AnimatePresence } from 'framer-motion';
import { useBrowserAutomationStore } from '../store/browserAutomationStore';
import { CheckCircle2, XCircle, RotateCcw, FileText, Mail, Bell, X } from 'lucide-react';
import type { NotificationType } from '../types';

const notifConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string }> = {
  submitted: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  resume_uploaded: {
    icon: <FileText className="h-4 w-4" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  cover_letter_uploaded: {
    icon: <Mail className="h-4 w-4" />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  },
  failed: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
  retry: {
    icon: <RotateCcw className="h-4 w-4" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
};

export function NotificationsPanel() {
  const { notifications, markNotificationRead, clearNotifications } = useBrowserAutomationStore();

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="glassmorphism rounded-2xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" />
          Notifications
          {unread > 0 && (
            <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">
              {unread}
            </span>
          )}
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-2">
          <Bell className="h-8 w-8 text-muted-foreground opacity-20" />
          <p className="text-xs text-muted-foreground italic">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence>
            {notifications.map((notif, index) => {
              const cfg = notifConfig[notif.type];
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${cfg.bg} ${
                    !notif.read ? 'ring-1 ring-white/10' : 'opacity-60'
                  }`}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  )}

                  {/* Icon */}
                  <div className={`shrink-0 mt-0.5 ${cfg.color}`}>{cfg.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">{notif.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] font-mono text-muted-foreground">{notif.timestamp}</span>
                      {notif.company && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cfg.color} bg-current/10`}>
                          {notif.company}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
