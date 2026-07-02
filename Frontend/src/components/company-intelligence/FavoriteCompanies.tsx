import { useCompanyIntelligenceStore } from "@/store/companyIntelligenceStore";
import { mockCompanies } from "@/services/companyIntelligenceData";
import { Card } from "@/components/ui/card";
import {
  Bookmark, FolderHeart, History, ArrowRight,
  MapPin, Trash2
} from "lucide-react";
import { toast } from "sonner";

export default function FavoriteCompanies() {
  const {
    bookmarkedCompanyIds,
    toggleBookmark,
    collections,
    removeFromCollection,
    viewedCompanyIds,
    clearViewedHistory,
    setSelectedCompanyId,
    setActiveTab
  } = useCompanyIntelligenceStore();

  const handleSelect = (id: string) => {
    setSelectedCompanyId(id);
    setActiveTab("details");
  };

  const getCompany = (id: string) => mockCompanies.find((c) => c.id === id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Favorites & History</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your saved bookmarks, targeted collections, and recently viewed company profiles.
        </p>
      </div>

      {/* General Bookmarks */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">All Bookmarks</h3>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
            {bookmarkedCompanyIds.length}
          </span>
        </div>

        {bookmarkedCompanyIds.length === 0 ? (
          <div className="p-8 text-center border-dashed border-2 rounded-xl border-border bg-card/20">
            <p className="text-sm text-muted-foreground">No bookmarks saved yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookmarkedCompanyIds.map((id) => {
              const comp = getCompany(id);
              if (!comp) return null;
              return (
                <Card key={id} className="p-4 border-border bg-card/60 backdrop-blur-sm group hover:border-primary/30 transition-all cursor-pointer" onClick={() => handleSelect(id)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-white border border-border p-1">
                      <img src={comp.logo} alt={comp.name} className="h-full w-full object-contain" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(id);
                        toast("Removed from bookmarks");
                      }}
                      className="text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <Bookmark className="h-4 w-4" fill="currentColor" />
                    </button>
                  </div>
                  <h4 className="font-extrabold text-foreground text-sm">{comp.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">{comp.industry}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{comp.headquarters}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Collections */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <FolderHeart className="h-5 w-5 text-rose-500" />
          <h3 className="text-lg font-bold text-foreground">My Collections</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(collections).map(([name, ids]) => (
            <Card key={name} className="p-5 border-border bg-card/60 backdrop-blur-sm">
              <h4 className="font-bold text-foreground mb-4">{name} <span className="text-xs text-muted-foreground font-normal">({ids.length})</span></h4>
              
              {ids.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Collection is empty.</p>
              ) : (
                <div className="space-y-2">
                  {ids.map(id => {
                    const comp = getCompany(id);
                    if (!comp) return null;
                    return (
                      <div key={id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50 group-hover:bg-muted/80">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded bg-white p-0.5 border border-border shrink-0">
                            <img src={comp.logo} alt={comp.name} className="h-full w-full object-contain" />
                          </div>
                          <span className="text-xs font-bold text-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSelect(id)}>{comp.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCollection(name, id);
                            toast.success(`Removed ${comp.name} from ${name}`);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">Recently Viewed</h3>
          </div>
          {viewedCompanyIds.length > 0 && (
            <button
              onClick={() => {
                clearViewedHistory();
                toast("View history cleared");
              }}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {viewedCompanyIds.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No browsing history yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {viewedCompanyIds.map((id) => {
              const comp = getCompany(id);
              if (!comp) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-card border border-border hover:border-primary/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="h-5 w-5 rounded-full bg-white p-0.5 shrink-0">
                    <img src={comp.logo} alt={comp.name} className="h-full w-full object-contain" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{comp.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
