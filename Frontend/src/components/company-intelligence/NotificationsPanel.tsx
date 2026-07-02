import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { Card } from "@/components/ui/card";
import {
  Bell, CheckCircle2, Circle, Briefcase, Network, DollarSign, Repeat, ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { CompanyNotification } from "@/types/companyIntelligence";

export default function NotificationsPanel() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setSelectedCompanyId, setActiveTab } = useCompanyIntelligenceStore();

  const handleAction = (n: CompanyNotification) => {
    markNotificationAsRead(n.id);
    setSelectedCompanyId(n.companyId);
    
    if (n.type === "new_hiring" || n.type === "hiring_again") setActiveTab("hiring");
    else if (n.type === "salary_updated") setActiveTab("salary");
    else if (n.type === "interview_pattern") setActiveTab("interview");
    else setActiveTab("details");
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "new_hiring": return <Briefcase className="h-5 w-5 text-blue-500" />;
      case "referral": return <Network className="h-5 w-5 text-emerald-500" />;
      case "hiring_again": return <Repeat className="h-5 w-5 text-violet-500" />;
      case "salary_updated": return <DollarSign className="h-5 w-5 text-amber-500" />;
      case "interview_pattern": return <ShieldAlert className="h-5 w-5 text-rose-500" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Company Alerts
            {unreadCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time insights on hiring pattern shifts, newly opened roles, and salary band updates.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => {
              markAllNotificationsAsRead();
              toast.success("All alerts marked as read");
            }}
            className="text-xs font-bold text-primary hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 bg-card/40">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground">You're all caught up!</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            We will notify you when tracked companies change their hiring pipelines or adjust compensations.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              onClick={() => handleAction(n)}
              className={`p-4 border-border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-start gap-4 group ${
                n.isRead ? "bg-card/40 hover:bg-card/60" : "bg-card/80 hover:bg-card shadow-sm border-l-4 border-l-primary"
              }`}
            >
              <div className="flex-1 flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-white border border-border p-1.5 shrink-0 shadow-sm self-start">
                  <img src={n.companyLogo} alt={n.companyName} className="h-full w-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm ${n.isRead ? "font-semibold text-foreground/80" : "font-extrabold text-foreground"}`}>
                      {n.title}
                    </h3>
                  </div>
                  <p className={`text-xs leading-relaxed ${n.isRead ? "text-muted-foreground" : "text-foreground/90 font-medium"}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                      {getIcon(n.type)}
                      <span className="ml-1">{n.type.replace("_", " ")}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">{n.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="sm:pl-4 sm:border-l border-border flex items-center shrink-0">
                {n.isRead ? (
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground/40" />
                ) : (
                  <Circle className="h-5 w-5 text-primary fill-primary/10" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
