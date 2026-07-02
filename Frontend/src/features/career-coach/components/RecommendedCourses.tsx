import { useState } from "react";
import { Card } from "@/components/ui/card";
import { mockResources } from "../mock/careerCoachData";
import { useCareerCoachStore } from "../store/careerCoachStore";
import { BookMarked, PlayCircle, BookOpen, FileText, Bookmark, ExternalLink } from "lucide-react";

export function RecommendedCourses() {
  const { resources, toggleResourceBookmark } = useCareerCoachStore();
  const [filter, setFilter] = useState<string>("All");

  const filters = ["All", "Video", "Book", "Article"];

  const filteredResources = filter === "All" 
    ? resources 
    : resources.filter(r => r.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case "Video": return <PlayCircle className="h-5 w-5 text-rose-500" />;
      case "Book": return <BookOpen className="h-5 w-5 text-amber-500" />;
      case "Article": return <FileText className="h-5 w-5 text-blue-500" />;
      default: return <BookMarked className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BookMarked className="h-6 w-6 text-primary" />
            Resource Library
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Curated books, articles, and courses tailored to fill your specific skill gaps.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar mask-linear-fade">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="flex flex-col overflow-hidden border-border bg-card/60 backdrop-blur-sm group hover:border-primary/40 transition-colors">
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-muted flex items-center justify-center">
                  {getIcon(resource.type)}
                </div>
                <button 
                  onClick={() => toggleResourceBookmark(resource.id)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Bookmark className={`h-5 w-5 ${resource.bookmarked ? "text-primary fill-primary" : "text-muted-foreground"}`} fill={resource.bookmarked ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              </div>
              <h3 className="text-base font-extrabold text-foreground mb-1 line-clamp-2">
                {resource.title}
              </h3>
              <p className="text-xs text-muted-foreground font-semibold mb-3">
                by {resource.provider}
              </p>
              <p className="text-xs text-foreground/80 leading-relaxed font-medium mb-4 flex-1">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {resource.type}
                </span>
                <a href={resource.url} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
