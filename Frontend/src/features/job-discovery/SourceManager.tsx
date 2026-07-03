import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, Filter, ArrowUpDown, RefreshCw, Play, Settings, Shield,
  Activity, CheckCircle, XCircle, AlertTriangle, Clock, Percent,
  Cpu, Server, ToggleLeft, ToggleRight, X, Sliders, Info, Zap
} from 'lucide-react';
import { useSourceManagerStore, JobSource } from '@/store/sourceManagerStore';
import { sourceManagerService } from '@/services/sourceManagerService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SourceManager() {
  const queryClient = useQueryClient();
  const {
    sources,
    statusFilter,
    sortBy,
    searchQuery,
    selectedSource,
    isConfigDrawerOpen,
    isLoading: storeIsLoading,
    setStatusFilter,
    setSortBy,
    setSearchQuery,
    setSelectedSource,
    setConfigDrawerOpen,
    toggleSourceStatus,
    scanSource,
    updateSourceConfig
  } = useSourceManagerStore();

  const [refreshKey, setRefreshKey] = useState(0);

  // Use TanStack Query to wrap loading states and simulate API calls
  const { isLoading: queryIsLoading, refetch } = useQuery({
    queryKey: ['jobSources', refreshKey],
    queryFn: async () => {
      return await sourceManagerService.getSources();
    }
  });

  const handleRefreshAll = async () => {
    toast.promise(refetch(), {
      loading: 'Refreshing sources data...',
      success: 'All sources status synchronized.',
      error: 'Failed to refresh sources.'
    });
  };

  const scanMutation = useMutation({
    mutationFn: async (id: string) => {
      await scanSource(id);
    },
    onSuccess: (_, id) => {
      toast.success(`Successfully scanned ${id.toUpperCase()}! New jobs fetched.`);
    },
    onError: () => {
      toast.error('Failed to trigger scan.');
    }
  });

  // Calculate analytics
  const analytics = useMemo(() => {
    const total = sources.length;
    const running = sources.filter(s => s.status === 'Active').length;
    const disabled = sources.filter(s => s.status === 'Disabled').length;
    const jobsToday = sources.reduce((acc, curr) => acc + curr.jobsFoundToday, 0);
    
    // Average source health % mapping: Good -> 95%, Fair -> 70%, Poor -> 35%
    const healthScores = sources.map(s => {
      if (s.health === 'Good') return 95;
      if (s.health === 'Fair') return 70;
      return 35;
    });
    const avgHealth = healthScores.length > 0 
      ? Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length) 
      : 0;

    return { total, running, disabled, jobsToday, avgHealth };
  }, [sources]);

  // Filter sources
  const filteredSources = useMemo(() => {
    return sources.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sources, searchQuery, statusFilter]);

  // Sort sources
  const sortedSources = useMemo(() => {
    return [...filteredSources].sort((a, b) => {
      if (sortBy === 'Jobs Found') {
        return b.jobsFoundToday - a.jobsFoundToday;
      }
      if (sortBy === 'Health') {
        const healthWeight = { Good: 3, Fair: 2, Poor: 1 };
        return healthWeight[b.health] - healthWeight[a.health];
      }
      if (sortBy === 'Match Rate') {
        return b.averageMatchPercent - a.averageMatchPercent;
      }
      if (sortBy === 'Last Scan') {
        // Simple comparison of strings for standard last scan format
        return a.lastScanTime.localeCompare(b.lastScanTime);
      }
      return 0;
    });
  }, [filteredSources, sortBy]);

  const [localConfig, setLocalConfig] = useState<Partial<JobSource>>({});

  const handleOpenConfigure = (source: JobSource) => {
    setSelectedSource(source);
    setLocalConfig({
      scanFrequency: source.scanFrequency,
      priority: source.priority,
      retryAttempts: source.retryAttempts,
      requestDelay: source.requestDelay,
      status: source.status
    });
    setConfigDrawerOpen(true);
  };

  const handleSaveConfig = () => {
    if (selectedSource) {
      updateSourceConfig(selectedSource.id, localConfig);
      setConfigDrawerOpen(false);
      toast.success(`Configuration updated for ${selectedSource.name}.`);
    }
  };

  const handleResetConfig = () => {
    if (selectedSource) {
      setLocalConfig({
        scanFrequency: selectedSource.scanFrequency,
        priority: selectedSource.priority,
        retryAttempts: selectedSource.retryAttempts,
        requestDelay: selectedSource.requestDelay,
        status: selectedSource.status
      });
      toast.info('Configuration reset to original values.');
    }
  };

  // Helper for Status UI Badge
  const getStatusBadge = (status: 'Active' | 'Disabled' | 'Maintenance') => {
    switch (status) {
      case 'Active':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-3 w-3" />
            Active
          </span>
        );
      case 'Disabled':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20">
            <XCircle className="h-3 w-3" />
            Disabled
          </span>
        );
      case 'Maintenance':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            Maintenance
          </span>
        );
    }
  };

  const getHealthBadge = (health: 'Good' | 'Fair' | 'Poor') => {
    switch (health) {
      case 'Good':
        return <span className="text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-1"><Zap className="h-3.5 w-3.5 fill-emerald-500/20" /> Good</span>;
      case 'Fair':
        return <span className="text-amber-500 dark:text-amber-400 font-semibold flex items-center gap-1"><Info className="h-3.5 w-3.5 fill-amber-500/20" /> Fair</span>;
      case 'Poor':
        return <span className="text-rose-500 dark:text-rose-400 font-semibold flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 fill-rose-500/20" /> Poor</span>;
    }
  };

  const isLoading = queryIsLoading || storeIsLoading;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Source Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure, refresh, and monitor API scrapers and web crawlers indexers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefreshAll}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2 border-white/20 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { title: 'Total Sources', value: analytics.total, icon: Server, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
          { title: 'Running', value: analytics.running, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
          { title: 'Disabled', value: analytics.disabled, icon: XCircle, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
          { title: 'Jobs Found Today', value: analytics.jobsToday, icon: Cpu, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
          { title: 'Average Health', value: `${analytics.avgHealth}%`, icon: Activity, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="glassmorphism p-4 rounded-xl flex flex-col justify-between border relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black">{item.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glassmorphism p-4 rounded-xl border">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-transparent border border-white/10 dark:border-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/45 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent border border-white/10 dark:border-white/5 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/45 dark:bg-slate-900"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Disabled">Disabled Only</option>
              <option value="Maintenance">Maintenance Only</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 text-sm">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border border-white/10 dark:border-white/5 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/45 dark:bg-slate-900"
            >
              <option value="Jobs Found">Sort by Jobs Found</option>
              <option value="Health">Sort by Health</option>
              <option value="Match Rate">Sort by Match Rate</option>
              <option value="Last Scan">Sort by Last Scan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glassmorphism p-6 rounded-2xl border border-white/10 flex flex-col justify-between h-[280px] animate-pulse">
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-white/10"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-slate-200 dark:bg-white/10 rounded w-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : sortedSources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glassmorphism p-12 text-center rounded-2xl border flex flex-col items-center justify-center space-y-4"
          >
            <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-full border border-white/10">
              <Sliders className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No sources match your filters</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Try adjusting your query, clearing search, or selecting "All Statuses" to discover and index monitored job avenues.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedSources.map((source) => (
              <motion.div
                key={source.id}
                layoutId={`card-${source.id}`}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`glassmorphism rounded-2xl p-6 border flex flex-col justify-between h-full relative overflow-hidden group shadow-lg ${
                  source.status === 'Disabled' ? 'opacity-70' : ''
                }`}
              >
                {/* Top Source Logo and Badges */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-black text-xl text-indigo-500">
                        {source.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">
                          {source.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Scan frequency: {source.scanFrequency}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(source.status)}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]">
                    {source.description}
                  </p>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 py-3 px-4 bg-slate-100/5 dark:bg-white/5 rounded-xl border border-white/5 text-[11px]">
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Cpu className="h-3 w-3" /> Jobs Found Today
                      </div>
                      <div className="font-bold text-sm">{source.jobsFoundToday}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Percent className="h-3 w-3" /> Match Rate
                      </div>
                      <div className="font-bold text-sm text-indigo-500 dark:text-indigo-400">{source.averageMatchPercent}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Response Time
                      </div>
                      <div className="font-bold text-sm">{source.responseTime}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Activity className="h-3 w-3" /> Scraper Health
                      </div>
                      <div className="font-bold text-xs">{getHealthBadge(source.health)}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Controls */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-white/5 pt-3">
                    <span>Priority: <b className="text-foreground">{source.priority}</b></span>
                    <span>Last scan: <b className="text-foreground">{source.lastScanTime}</b></span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleSourceStatus(source.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-white/10 dark:hover:bg-white/10"
                    >
                      {source.status === 'Active' ? 'Disable' : 'Enable'}
                    </Button>

                    <Button
                      onClick={() => scanMutation.mutate(source.id)}
                      disabled={source.status !== 'Active' || scanMutation.isPending}
                      variant="outline"
                      size="sm"
                      className="text-xs border-white/10 hover:border-indigo-500 hover:text-indigo-500"
                    >
                      <Play className="h-3 w-3 mr-1" /> Scan
                    </Button>

                    <Button
                      onClick={() => handleOpenConfigure(source)}
                      variant="outline"
                      size="sm"
                      className="text-xs border-white/10 dark:hover:bg-white/10"
                    >
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Drawer */}
      <AnimatePresence>
        {isConfigDrawerOpen && selectedSource && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfigDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Sidebar/Drawer content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white dark:bg-slate-900 border-l border-white/10 z-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold flex items-center gap-2">
                      <Settings className="h-5 w-5 text-indigo-500" />
                      Configure Source
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Configure AI scraper settings for {selectedSource.name}.
                    </p>
                  </div>
                  <button 
                    onClick={() => setConfigDrawerOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Form Elements */}
                <div className="space-y-4">
                  {/* Source General Details readonly */}
                  <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Selected Avenue</span>
                    <h4 className="text-sm font-bold">{selectedSource.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{selectedSource.description}</p>
                  </div>

                  {/* Enabled State Switch toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-xs font-bold">Enabled Toggle</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Active monitoring status</p>
                    </div>
                    <button
                      onClick={() => setLocalConfig(prev => ({ 
                        ...prev, 
                        status: prev.status === 'Active' ? 'Disabled' : 'Active' 
                      }))}
                      className="text-indigo-500 hover:text-indigo-400 transition-colors"
                    >
                      {localConfig.status === 'Active' ? (
                        <ToggleRight className="h-8 w-8" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Scan Frequency Option dropdown */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">Scan Frequency</label>
                    <select
                      value={localConfig.scanFrequency}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, scanFrequency: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/45 dark:bg-slate-900 text-foreground"
                    >
                      <option value="Every 30 mins">Every 30 mins</option>
                      <option value="Every 1 hour">Every 1 hour</option>
                      <option value="Every 2 hours">Every 2 hours</option>
                      <option value="Every 4 hours">Every 4 hours</option>
                      <option value="Every 12 hours">Every 12 hours</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground block">Crawler Priority</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['High', 'Medium', 'Low'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setLocalConfig(prev => ({ ...prev, priority: p as any }))}
                          className={`py-2 text-xs font-bold border rounded-lg transition-colors ${
                            localConfig.priority === p 
                              ? 'bg-indigo-600 border-indigo-600 text-white' 
                              : 'bg-transparent border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-muted-foreground'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Retry Attempts slider/input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-muted-foreground">Retry Attempts</label>
                      <span className="font-semibold text-indigo-500">{localConfig.retryAttempts} trials</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={localConfig.retryAttempts || 3}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none h-1.5"
                    />
                  </div>

                  {/* Request Delay */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-muted-foreground">Crawler Request Delay (Rate limit)</label>
                      <span className="font-semibold text-indigo-500">{localConfig.requestDelay} ms</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={localConfig.requestDelay || 1000}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, requestDelay: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none h-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions Form drawer */}
              <div className="flex gap-3 border-t border-white/10 pt-4 mt-6">
                <Button
                  onClick={handleResetConfig}
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleSaveConfig}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold"
                >
                  Save Configuration
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}