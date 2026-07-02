import { useState } from "react";
import { Card } from "@/components/ui/card";
import { mockLearningPlanner } from "../mock/careerCoachData";
import { Map, Clock, CalendarDays, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LearningRoadmap() {
  const [activeView, setActiveView] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const toggleTask = (task: string) => {
    setCompletedTasks(prev => 
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "Daily":
        return (
          <div className="space-y-4">
            {mockLearningPlanner.dailySchedule.map((item, idx) => {
              const isDone = completedTasks.includes(item.task);
              return (
                <div key={idx} className={`relative pl-8 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] ${idx === mockLearningPlanner.dailySchedule.length - 1 ? 'before:bg-transparent' : 'before:bg-border'}`}>
                  <div className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 flex items-center justify-center bg-background cursor-pointer transition-colors ${
                    isDone ? "border-emerald-500 text-emerald-500" : "border-muted-foreground text-transparent hover:border-primary"
                  }`} onClick={() => toggleTask(item.task)}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                  </div>
                  <Card className={`p-4 border-border transition-all ${isDone ? 'opacity-60 bg-muted/30' : 'bg-card/60 backdrop-blur-sm hover:border-primary/30'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.time}</span>
                      <span className={`ml-auto text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        item.type === "Learning" ? "bg-blue-500/10 text-blue-500" :
                        item.type === "Practice" ? "bg-amber-500/10 text-amber-500" :
                        "bg-violet-500/10 text-violet-500"
                      }`}>{item.type}</span>
                    </div>
                    <p className={`text-sm font-semibold ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {item.task}
                    </p>
                  </Card>
                </div>
              );
            })}
          </div>
        );
      case "Weekly":
        return (
          <div className="space-y-4">
            {mockLearningPlanner.weeklySchedule.map((item, idx) => (
              <Card key={idx} className="p-4 border-border bg-card/60 backdrop-blur-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black shrink-0">
                  {idx + 1}
                </div>
                <p className="text-sm font-bold text-foreground">{item}</p>
              </Card>
            ))}
          </div>
        );
      case "Monthly":
        return (
          <div className="space-y-4">
            {mockLearningPlanner.monthlySchedule.map((item, idx) => (
              <Card key={idx} className="p-4 border-border bg-card/60 backdrop-blur-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 font-black shrink-0">
                  W{idx + 1}
                </div>
                <p className="text-sm font-bold text-foreground">{item}</p>
              </Card>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Map className="h-6 w-6 text-primary" />
            AI Learning Planner
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your personalized, auto-generated schedule to reach your career milestones efficiently.
          </p>
        </div>
        
        {/* Toggle View */}
        <div className="flex items-center p-1 bg-muted rounded-xl">
          {["Daily", "Weekly", "Monthly"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeView === view ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
