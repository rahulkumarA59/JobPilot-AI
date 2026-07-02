import React from "react";
import { useAgentStore, QueueItem } from "@/store/agentStore";
import { Briefcase, ArrowRight, Layers, HelpCircle, CheckCircle, Ban, Award, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ColumnStatus = QueueItem["status"];

const COLUMNS: Array<{ label: string; status: ColumnStatus; color: string; icon: any }> = [
  { label: "Queued", status: "Queued", color: "bg-blue-500", icon: Layers },
  { label: "Preparing", status: "Preparing", color: "bg-purple-500", icon: HelpCircle },
  { label: "Applying", status: "Applying", color: "bg-amber-500", icon: Star },
  { label: "Submitted", status: "Submitted", color: "bg-green-500", icon: CheckCircle },
  { label: "Interview", status: "Interview", color: "bg-teal-500", icon: Award },
  { label: "Offer", status: "Offer", color: "bg-emerald-500", icon: Award }
];

export default function QueueBoard() {
  const { queue, updateQueueItemStatus } = useAgentStore();

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ColumnStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      updateQueueItemStatus(id, targetStatus);
    }
  };

  const getStatusBadgeClass = (status: ColumnStatus) => {
    switch (status) {
      case "Submitted":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Applying":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Preparing":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Interview":
        return "bg-teal-500/10 text-teal-500 border-teal-500/20";
      case "Offer":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-230px)] min-h-[500px] flex flex-col">
      <div>
        <h2 className="text-xl font-bold text-foreground">Interactive Application Queue</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Drag and drop cards manually to override automation stages or track applications offline.
        </p>
      </div>

      {/* Columns Container */}
      <div className="flex-1 overflow-x-auto flex gap-4 pb-4 select-none scrollbar-thin scrollbar-thumb-border">
        {COLUMNS.map((col) => {
          const items = queue.filter((item) => item.status === col.status);
          return (
            <div
              key={col.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.status)}
              className="flex-1 min-w-[240px] max-w-[280px] bg-muted/40 rounded-2xl p-4 flex flex-col border border-border/60 hover:bg-muted/60 transition duration-200"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.color}`} />
                  <span className="text-xs font-bold text-foreground">{col.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-card border border-border/80 text-muted-foreground">
                  {items.length}
                </span>
              </div>

              {/* Column Cards Area */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-30 border-2 border-dashed border-border/60 rounded-xl">
                    <span className="text-[10px] font-semibold text-muted-foreground">Empty column</span>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className="p-4 bg-card border border-border/80 rounded-xl shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing hover:border-primary/40 transition duration-200 space-y-3 group relative overflow-hidden"
                    >
                      {/* Drag handles indicator */}
                      <div className="absolute top-2 right-2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-40 transition">
                        <div className="h-0.5 w-3 bg-muted-foreground" />
                        <div className="h-0.5 w-3 bg-muted-foreground" />
                        <div className="h-0.5 w-3 bg-muted-foreground" />
                      </div>

                      <div className="space-y-1 pr-4">
                        <h4 className="font-bold text-foreground text-xs leading-normal truncate group-hover:text-primary transition">
                          {item.role}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-semibold truncate">{item.company}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[10px] font-semibold text-muted-foreground">
                        <span className={`px-2 py-0.5 rounded-md border text-[9px] font-extrabold ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                        <span className="font-bold text-foreground/80">{item.matchScore}% Match</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
