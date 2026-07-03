import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Briefcase, MapPin, User, FileText, Sparkles, 
  Wand2, History, Eye, Download, Copy, Trash2, RotateCcw, 
  TrendingUp, CheckCircle2, AlertCircle, Info, Languages,
  Monitor, Smartphone, Printer, ChevronRight, Save, Layout,
  Type, MessageSquare, ListChecks, ArrowLeft, ArrowRight,
  ShieldCheck, FileCode, Check
} from 'lucide-react';
import { useCoverLetterStore, WritingStyle } from '@/store/coverLetterStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CoverLetterDashboard() {
  const {
    company, role, department, location, hiringManager, jobDescription,
    currentLetter, currentStyle, history, suggestions, reasoning,
    isGenerating, setField, setCurrentLetter, setStyle, generateLetter, 
    improveLetter, restoreVersion, deleteVersion
  } = useCoverLetterStore();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('editor');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'print'>('desktop');

  const handleGenerate = () => {
    toast.promise(generateLetter(), {
      loading: 'AI is crafting your personalized cover letter...',
      success: 'Cover letter generated successfully!',
      error: 'Failed to generate letter.'
    });
  };

  const handleImprove = (instruction: string) => {
    toast.promise(improveLetter(instruction), {
      loading: `AI is applying improvement: ${instruction}...`,
      success: 'Letter updated with AI suggestions!',
      error: 'Failed to apply improvement.'
    });
  };

  const styles: WritingStyle[] = ['Professional', 'Friendly', 'Corporate', 'Startup', 'Executive', 'Formal'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLetter);
    toast.success('Copied to clipboard!');
  };

  const analytics = history[0]?.analytics || {
    readability: 0, atsScore: 0, keywordDensity: 0, grammar: 0, length: 0, professionalScore: 0
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Wand2 className="h-7 w-7 text-indigo-500" />
            AI Cover Letter Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate high-conversion, company-specific cover letters tailored by AI.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-2 rounded-xl shadow-glow-violet transition-all"
          >
            {isGenerating ? <RotateCcw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {currentLetter ? 'Regenerate Letter' : 'Generate with AI'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config & Tools */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Target Company Section */}
          <section className="glassmorphism p-6 rounded-2xl border space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-white/5 pb-3">
              <Building2 className="h-4 w-4 text-indigo-500" />
              Target Company & Role
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Company</label>
                  <input 
                    value={company} 
                    onChange={(e) => setField('company', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Role</label>
                  <input 
                    value={role} 
                    onChange={(e) => setField('role', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Department</label>
                  <input 
                    value={department} 
                    onChange={(e) => setField('department', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hiring Manager</label>
                  <input 
                    value={hiringManager} 
                    onChange={(e) => setField('hiringManager', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Job Description Snippet</label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setField('jobDescription', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40 h-20 resize-none leading-relaxed" 
                />
              </div>
            </div>
          </section>

          {/* 4. Writing Style */}
          <section className="glassmorphism p-6 rounded-2xl border space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-white/5 pb-3">
              <Type className="h-4 w-4 text-indigo-500" />
              Tone & Writing Style
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => setStyle(style)}
                  className={`py-2 px-3 text-[11px] font-bold border rounded-xl transition-all ${
                    currentStyle === style 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                    : 'bg-transparent border-white/10 hover:bg-white/5 text-muted-foreground'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </section>

          {/* 3. AI Suggestions */}
          <section className="glassmorphism p-6 rounded-2xl border space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              AI Enhancement Tools
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Improve Tone', icon: Languages, inst: 'Make the tone more persuasive and enthusiastic.' },
                { label: 'Improve Technical Depth', icon: FileCode, inst: 'Add more specific technical details about React 19 and concurrent rendering.' },
                { label: 'Reduce Length', icon: ListChecks, inst: 'Condense the content to fit on a single page while keeping core impact.' },
                { label: 'Increase Impact', icon: TrendingUp, inst: 'Rewrite bullet points to focus on quantifiable results and business value.' },
              ].map((tool, i) => (
                <button
                  key={i}
                  onClick={() => handleImprove(tool.inst)}
                  disabled={!currentLetter || isGenerating}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-white/10 hover:border-indigo-500/40 group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-white/5 border border-white/10 group-hover:text-indigo-500 transition-colors">
                      <tool.icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-bold">{tool.label}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </section>

          {/* 10. Analytics */}
          <section className="glassmorphism p-6 rounded-2xl border space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-white/5 pb-3">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Real-time Analytics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Readability', value: analytics.readability, color: 'bg-blue-500' },
                { label: 'ATS Compliance', value: analytics.atsScore, color: 'bg-emerald-500' },
                { label: 'Grammar', value: analytics.grammar, color: 'bg-violet-500' },
                { label: 'Prof. Score', value: analytics.professionalScore, color: 'bg-indigo-500' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    <span>{stat.label}</span>
                    <span>{stat.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      className={`h-full ${stat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Word Count: <b className="text-foreground">{analytics.length}</b></span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Grammar verified</span>
            </div>
          </section>
        </div>

        {/* Middle/Right Column: Editor & Preview */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs Switcher */}
          <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-white/5 w-fit">
            {[
              { id: 'editor', label: 'Rich Editor', icon: FileText },
              { id: 'preview', label: 'Live Preview', icon: Eye },
              { id: 'history', label: 'Version History', icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 shadow-md text-indigo-500' 
                  : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'editor' && (
              <motion.div
                key="editor-pane"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* 2. Generated Cover Letter Editor */}
                <div className="glassmorphism rounded-2xl border flex flex-col h-[650px] relative overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/30 dark:bg-black/20 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        Letter Drafting
                      </h3>
                      <div className="h-4 w-px bg-white/10 hidden sm:block" />
                      <div className="hidden sm:flex gap-1.5">
                         {/* Mock Toolbar */}
                         {['B', 'I', 'U', 'S'].map(tool => (
                           <button key={tool} className="h-7 w-7 rounded bg-slate-50 dark:bg-white/5 border border-white/10 text-[10px] font-black hover:border-indigo-500 transition-colors">{tool}</button>
                         ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={handleCopy} variant="outline" size="sm" className="h-8 text-[10px] font-bold border-white/10">
                        <Copy className="h-3 w-3 mr-1.5" /> Copy Plaintext
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-white/10">
                        <Save className="h-3 w-3 mr-1.5" /> Auto-saved
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 relative">
                    {!currentLetter && !isGenerating ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-12 text-center">
                        <div className="p-4 rounded-full bg-slate-50 dark:bg-white/5 border border-dashed border-white/20">
                          <Wand2 className="h-12 w-12 text-muted-foreground animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold italic">Ready to craft your masterpiece?</h4>
                          <p className="text-xs text-muted-foreground max-w-sm">Fill in the target company details on the left and click "Generate with AI" to create a bespoke cover letter.</p>
                        </div>
                        <Button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-8">Magic Start</Button>
                      </div>
                    ) : isGenerating ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm z-20 space-y-4">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                          <Sparkles className="h-6 w-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <p className="text-sm font-black animate-pulse bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI IS THINKING...</p>
                      </div>
                    ) : null}

                    <textarea
                      value={currentLetter}
                      onChange={(e) => setCurrentLetter(e.target.value)}
                      className="w-full h-full p-8 bg-transparent text-sm leading-loose focus:outline-none resize-none font-serif placeholder:italic"
                      placeholder="Start typing or use AI generation..."
                    />
                  </div>

                  {/* 5. AI Reasoning Footer */}
                  <div className="px-6 py-4 border-t border-white/5 bg-slate-50/50 dark:bg-black/20 text-[11px]">
                     <div className="flex items-center gap-2 font-bold text-indigo-500 mb-2">
                       <ShieldCheck className="h-3.5 w-3.5" /> AI Construction Logic
                     </div>
                     <p className="text-muted-foreground italic leading-relaxed">
                       {reasoning[Math.floor(Math.random() * reasoning.length)].explanation}
                     </p>
                  </div>
                </div>

                {/* 6. Keyword Matching Section */}
                <div className="glassmorphism p-6 rounded-2xl border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Layout className="h-4 w-4 text-indigo-500" />
                      ATS Keyword Distribution
                    </h3>
                    <div className="flex gap-3 text-[10px] font-bold">
                       <span className="flex items-center gap-1.5 text-emerald-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Optimization</span>
                       <span className="flex items-center gap-1.5 text-blue-500"><span className="h-2 w-2 rounded-full bg-blue-500" /> Contextual</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['React 19', 'TypeScript', 'State Management', 'Concurrent Rendering', 'Performance', 'Architecture', 'UI Components', 'Linear', 'Engineering Culture'].map((kw, i) => (
                      <span key={i} className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all hover:scale-105 cursor-default ${
                        i < 6 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div
                key="preview-pane"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* 8. Live Preview Controls */}
                <div className="flex justify-between items-center px-2">
                  <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-lg border border-white/5">
                    {[
                      { id: 'desktop', icon: Monitor, label: 'Desktop' },
                      { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                      { id: 'print', icon: Printer, label: 'Print View' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setPreviewMode(mode.id as any)}
                        className={`p-2 rounded-md transition-all ${
                          previewMode === mode.id 
                          ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-500' 
                          : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title={mode.label}
                      >
                        <mode.icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs border-white/10 h-9 font-bold px-4">
                      <Download className="h-3.5 w-3.5 mr-2" /> Export PDF
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-white/10 h-9 font-bold px-4">
                      <FileCode className="h-3.5 w-3.5 mr-2" /> Markdown
                    </Button>
                  </div>
                </div>

                {/* 9. Preview Area */}
                <div className={`mx-auto bg-white shadow-2xl transition-all duration-500 ${
                  previewMode === 'mobile' ? 'max-w-[375px] aspect-[9/19]' : 'max-w-[800px] aspect-[1/1.4]'
                } p-12 text-black font-serif overflow-y-auto rounded-sm border border-slate-200`}>
                  <div className="whitespace-pre-wrap leading-relaxed text-sm">
                    {currentLetter || 'No content to preview yet.'}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history-pane"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* 7. Version History */}
                {history.length === 0 ? (
                  <div className="glassmorphism p-12 text-center rounded-2xl border flex flex-col items-center justify-center space-y-4">
                     <History className="h-12 w-12 text-muted-foreground opacity-20" />
                     <h4 className="text-lg font-bold italic">No snapshots yet</h4>
                     <p className="text-xs text-muted-foreground">Versions are created every time you generate or improve with AI.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((version) => (
                      <div key={version.id} className="glassmorphism p-5 rounded-2xl border flex items-center justify-between group hover:border-indigo-500/40 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                             <Check className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold flex items-center gap-2">
                              Version {version.timestamp}
                              <span className="px-2 py-0.5 text-[8px] bg-slate-100 dark:bg-white/5 rounded border border-white/10 uppercase tracking-tighter">{version.style}</span>
                            </h4>
                            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 max-w-md italic">{version.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button onClick={() => restoreVersion(version.id)} variant="outline" size="sm" className="h-8 text-[10px] font-bold border-white/10">
                            <RotateCcw className="h-3 w-3 mr-1.5" /> Restore
                          </Button>
                          <Button onClick={() => deleteVersion(version.id)} variant="outline" size="sm" className="h-8 text-[10px] font-bold border-white/10 text-rose-500 hover:text-rose-400">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}