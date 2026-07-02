import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/store/notificationStore";
import { timeAgo } from "@/utils";
import { cn } from "@/utils";
import type { NotificationType } from "@/types";

const typeConfig: Record<NotificationType, { label: string; color: string; emoji: string }> = {
  application_update: { label: "Update", color: "info", emoji: "📋" },
  new_job: { label: "New Job", color: "purple", emoji: "💼" },
  interview_reminder: { label: "Interview", color: "warning", emoji: "🎙️" },
  offer_received: { label: "Offer", color: "success", emoji: "🎉" },
  system: { label: "System", color: "secondary", emoji: "⚙️" },
  ai_insight: { label: "AI Insight", color: "info", emoji: "🤖" },
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, removeNotification, unreadCount } = useNotificationStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-4 text-4xl">🔔</div>
          <h3 className="font-semibold text-lg mb-2">No notifications</h3>
          <p className="text-muted-foreground text-sm">You're all caught up! Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => {
            const cfg = typeConfig[n.type];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={cn("transition-all duration-200 hover:shadow-sm", !n.isRead && "border-primary/30 bg-primary/5")}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                        {cfg.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold">{n.title}</p>
                            <Badge variant={cfg.color as "info" | "success" | "warning" | "purple" | "secondary"} className="text-[10px] h-5">
                              {cfg.label}
                            </Badge>
                            {!n.isRead && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {!n.isRead && (
                              <Button variant="ghost" size="icon-sm" onClick={() => markAsRead(n.id)} title="Mark as read">
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10" onClick={() => removeNotification(n.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground/60">{timeAgo(n.createdAt)}</p>
                          {n.actionUrl && (
                            <a href={n.actionUrl} className="text-xs text-primary hover:underline flex items-center gap-1">
                              View <ArrowRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
