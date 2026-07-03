import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Sparkles, Award, ShieldAlert, Cpu, CheckCircle2, ChevronRight,
  TrendingUp, GraduationCap, MapPin, DollarSign, HelpCircle, ArrowRight,
  RefreshCw, ListPlus, Flame, PlayCircle, BookOpen, Clock, AlertTriangle, FileText, Info
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useMatchingEngineStore, SkillMatchInfo, AISuggestion } from '@/store/matchingEngineStore';
import { matchingEngineService } from '@/services/matchingEngineService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MatchingDashboard() {
  const {
    currentMatch,
    history,
    isLoading,
    calculateMatch,
    applySuggestion,
    resetMatch
  } = useMatchingEngineStore();

  const [resumeInput, setResumeInput] = useState(`John Doe
Senior Frontend Engineer

PROFESSIONAL EXPERIENCE:
- Engineered high performance enterprise applications using React 19, TypeScript, and state manager Zustand.
- Designed premium animated interfaces with Framer Motion and optimized utility styles using Tailwind CSS.
- Implemented state architecture patterns with Redux Toolkit to reduce prop-drilling by 45%.`);

  const [jdInput, setJdInput] = useState(`Job Description: Senior Full-Stack React Engineer

REQUIREMENTS:
- Core proficiency in React 19 framework features and concurrent rendering pipeline.
- Strong typed codebase development using TypeScript & Tailwind CSS.
- Professional experience containerizing frontend and backend microservices using Docker.
- Advanced routing layouts and static generation mechanisms in Next.js 15.
- Familiarity building federated client caching topologies using GraphQL endpoints.`);

  const handleCalculateMatch = () => {
    toast.promise(calculateMatch(resumeInput, jdInput), {
      loading: 'Analyzing resume vs job description with mock matching engine...',
      success: 'ATS score and compliance matrix calculated!',
      error: 'Calculation failed.'
    });
  };

  // Prepare chart data for skill distribution
  const skillCountData = [
    { name: 'Matched', value: currentMatch?.skillsList.filter(s => s.status === 'matched').length || 0, fill: '#10b981' },
    { name: 'Missing', value: currentMatch?.skillsList.filter(s => s.status === 'missing').length || 0, fill: '#ef4444' },
    { name: 'Extra', value: currentMatch?.skillsList.filter(s => s.status === 'extra').length || 0, fill: '#8b5cf6' },
  ];

  const skillRadarData = [
    { subject: 'Technical Skills', A: currentMatch?.skillMatchScore || 0, B: 90, fullMark: 100 },
    { subject: 'Experience', A: currentMatch?.experienceMatchScore || 0, B: 85, fullMark: 100 },
    { subject: 'Education', A: currentMatch?.educationMatchScore || 0, B: 80, fullMark: 100 },
    { subject: 'Location', A: currentMatch?.locationMatchScore || 0, B: 100, fullMark: 100 },
    { subject: 'Salary Expectations', A: currentMatch?.salaryMatchScore || 0, B: 90, fullMark: 100 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-emerald-500 animate-pulse" />
            AI Matching Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare resumes against job requirements and run simulated ATS assessments in real-time.
          </p>
        </div>
        {currentMatch && (
          <Button onClick={resetMatch} variant="outline" className="border-white/20 hover:bg-white/10 text-xs font-bold">
            Start New Evaluation
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!currentMatch ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left Resume Input */}
            <div className="glassmorphism p-6 rounded-2xl border flex flex-col justify-between h-[520px]">
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    Paste Resume Plaintext
                  </h3>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded border border-indigo-500/20">Parsed Engine Mock</span>
                </div>
                <textarea
                  value={resumeInput}
                  onChange={(e) => setResumeInput(e.target.value)}
                  placeholder="Paste your resume content..."
                  className="flex-1 w-full bg-slate-50 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-xl p-4 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-mono resize-none"
                />
              </div>
              <div className="mt-4 text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Include technical highlights, certifications, and project descriptions.
              </div>
            </div>

            {/* Right Job Description Input */}
            <div className="glassmorphism p-6 rounded-2xl border flex flex-col justify-between h-[520px]">
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-emerald-500" />
                    Paste Job Description (JD)
                  </h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded border border-emerald-500/20">Target Role</span>
                </div>
                <textarea
                  value={jdInput}
                  onChange={(e) => setJdInput(e.target.value)}
                  placeholder="Paste company job requirements, specifications, and expectations..."
                  className="flex-1 w-full bg-slate-50 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-xl p-4 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-mono resize-none"
                />
              </div>
              <Button
                onClick={handleCalculateMatch}
                disabled={isLoading}
                className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-glow-violet"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    AI Scrutinizing Keywords...
                  </>
                ) : (
                  <>
                    Run AI Matching Analysis <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results-dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* 1. Match Summary Dashboard Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                { title: 'Overall Match', value: `${currentMatch.overallMatchPercent}%`, desc: 'Compliance Rate', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
                { title: 'ATS Score', value: `${currentMatch.atsScore}/100`, desc: 'Ats Optimization', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
                { title: 'Skill Match', value: `${currentMatch.skillMatchScore}%`, desc: 'Technical Alignment', color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' },
                { title: 'Experience', value: `${currentMatch.experienceMatchScore}%`, desc: 'Seniority Level', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
                { title: 'Education Match', value: `${currentMatch.educationMatchScore}%`, desc: 'Academic Degrees', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
                { title: 'Location Match', value: `${currentMatch.locationMatchScore}%`, desc: 'Remote / On-site', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
                { title: 'Salary Match', value: `${currentMatch.salaryMatchScore}%`, desc: 'Candidate Budget', color: 'text-pink-500 bg-pink-500/10 border-pink-500/20' },
                { title: 'Confidence Score', value: `${currentMatch.confidenceScore}%`, desc: 'Accuracy Rate', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glassmorphism p-4 rounded-xl flex flex-col justify-between border relative overflow-hidden"
                >
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</span>
                  <div className="mt-3">
                    <span className="text-xl font-black block">{stat.value}</span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">{stat.desc}</span>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color.split(' ')[0]}`} />
                </motion.div>
              ))}
            </div>

            {/* Split resume & Job comparison + radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 2. Resume vs Job Comparison */}
              <div className="lg:col-span-2 glassmorphism rounded-2xl border p-6 flex flex-col justify-between h-[480px]">
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <ListPlus className="h-4.5 w-4.5 text-indigo-500" />
                    Keywords Compliance Matrix
                  </h3>
                  <div className="flex gap-3 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-emerald-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Match</span>
                    <span className="flex items-center gap-1 text-amber-500"><span className="h-2 w-2 rounded-full bg-amber-500" /> Partial</span>
                    <span className="flex items-center gap-1 text-rose-500"><span className="h-2 w-2 rounded-full bg-rose-500" /> Missing</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden h-full">
                  {/* Left Resume Compliance */}
                  <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-white/5 overflow-y-auto text-xs leading-relaxed font-mono">
                    <div className="font-bold text-muted-foreground border-b border-white/5 pb-1 mb-2">Resume Keywords Highlights</div>
                    <p>John Doe - Senior Frontend Engineer.</p>
                    <p>Engineered enterprise systems with <span className="bg-emerald-500/20 text-emerald-500 px-1 py-0.5 rounded font-bold">React 19</span>, <span className="bg-emerald-500/20 text-emerald-500 px-1 py-0.5 rounded font-bold">TypeScript</span>, and state manager <span className="bg-emerald-500/20 text-emerald-500 px-1 py-0.5 rounded font-bold">Zustand</span>.</p>
                    <p>Crafted animations utilizing <span className="bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded font-bold">Framer Motion</span> alongside <span className="bg-emerald-500/20 text-emerald-500 px-1 py-0.5 rounded font-bold">Tailwind CSS</span>.</p>
                    <p>Configured state with <span className="bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded font-bold">Redux Toolkit</span>.</p>
                  </div>

                  {/* Right JD Compliance */}
                  <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-white/5 overflow-y-auto text-xs leading-relaxed font-mono">
                    <div className="font-bold text-muted-foreground border-b border-white/5 pb-1 mb-2">Required Core Compliance (JD)</div>
                    <p>Requirements:</p>
                    <p>- Master core <span className="bg-emerald-500/20 text-emerald-500 px-1 py-0.5 rounded font-bold">React 19</span> features.</p>
                    <p>- Strong development via <span className="bg-emerald-500/20 text-emerald-500 px-1 py-0.5 rounded font-bold">TypeScript</span> & <span className="bg-emerald-500/20 text-emerald-500 px-1 py-0.5 rounded font-bold">Tailwind CSS</span>.</p>
                    <p>- Professional configurations with <span className="bg-rose-500/20 text-rose-500 px-1 py-0.5 rounded font-bold">Docker containerization</span>.</p>
                    <p>- Scaled routing layers inside <span className="bg-rose-500/20 text-rose-500 px-1 py-0.5 rounded font-bold">Next.js 15 App Router</span>.</p>
                    <p>- Query optimizations on <span className="bg-amber-500/20 text-amber-500 px-1 py-0.5 rounded font-bold">GraphQL servers</span>.</p>
                  </div>
                </div>
              </div>

              {/* 9. AI Confidence Radar & reasoning */}
              <div className="glassmorphism rounded-2xl border p-6 flex flex-col justify-between h-[480px]">
                <h3 className="text-sm font-bold border-b border-white/5 pb-3">AI Engine Evaluation Core</h3>
              <div className="flex-1 w-full min-h-0 py-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillRadarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" fontSize={9} stroke="#8b9bb4" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={8} stroke="#8b9bb4" />
                    <Radar name="Candidate" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Radar name="Benchmark" dataKey="B" stroke="#6366f1" fill="#6366f1" fillOpacity={0.0} strokeDasharray="3 3" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
                {/* Reasoning Panel */}
                <div className="bg-slate-50 dark:bg-white/5 p-3.5 rounded-xl border border-white/5 text-[11px] leading-relaxed text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5 mb-1.5">
                    <Award className="h-4 w-4 text-indigo-500" />
                    Confidence Key Insights
                  </div>
                  <ul className="space-y-1 list-disc list-inside">
                    {currentMatch.confidenceReasoning.map((reason, idx) => (
                      <li key={idx} className="line-clamp-1">{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Skill Matching chart & missing skills */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Skill charts */}
              <div className="glassmorphism rounded-2xl border p-6 h-[400px] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold">Avenue Compliance Distribution</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Distribution of candidate core technologies vs specifications.</p>
                </div>
                <div className="flex-1 w-full min-h-0 py-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillCountData} layout="vertical" margin={{ left: -10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis type="number" fontSize={10} stroke="#8b9bb4" />
                      <YAxis dataKey="name" type="category" fontSize={10} stroke="#8b9bb4" />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[11px] text-muted-foreground border-t border-white/5 pt-3">
                  Matching Rate: <b className="text-indigo-500 dark:text-indigo-400">9 matched</b> vs <b className="text-rose-500">3 missing requirements</b>.
                </div>
              </div>

              {/* 4. Missing Skills Cards */}
              <div className="lg:col-span-2 glassmorphism rounded-2xl border p-6 h-[400px] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <ShieldAlert className="h-4.5 w-4.5 text-rose-500 animate-bounce" />
                    Urgent Missing Skills & Upgrading Pathways
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Identified skill discrepancies on your profile with training resources.</p>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 scrollbar-thin">
                  {currentMatch.skillsList.filter(s => s.status === 'missing').map((skill, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-indigo-500/30 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{skill.name}</span>
                          <span className="px-2 py-0.5 text-[9px] rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">High Importance</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Difficulty: {skill.difficulty} | Estimate: {skill.learningTime}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 md:max-w-[300px]">
                        {skill.resources.map((res, ridx) => (
                          <span key={ridx} className="flex items-center gap-1 text-[10px] bg-indigo-500/5 text-indigo-500 dark:text-indigo-400 font-bold px-2 py-1 rounded border border-indigo-500/15">
                            <BookOpen className="h-3 w-3" /> {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 border-t border-white/5 pt-3">
                  <Clock className="h-3.5 w-3.5" /> Acquire these skills to increase compliance score by ~23% immediately.
                </div>
              </div>
            </div>

            {/* 5. AI Suggestions for ATS Improvement */}
            <div className="glassmorphism rounded-2xl border p-6">
              <h3 className="text-sm font-bold flex items-center gap-1.5 mb-4">
                <Flame className="h-4.5 w-4.5 text-amber-500" />
                AI Optimization Actions (ATS Compliance Maximizer)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentMatch.aiSuggestions.map((sug) => (
                  <div key={sug.id} className="bg-slate-50 dark:bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col justify-between h-[190px] relative overflow-hidden group hover:border-indigo-500/20 transition-all">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{sug.category}</span>
                        <span className={`px-2 py-0.5 text-[8px] rounded-full font-bold border ${
                          sug.applied ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {sug.applied ? 'Applied' : `+${sug.expectedAtsIncrease}% ATS`}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold line-clamp-1 group-hover:text-indigo-400 transition-colors">{sug.title}</h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">{sug.suggestion}</p>
                    </div>
                    <Button
                      onClick={() => applySuggestion(sug.id)}
                      disabled={sug.applied}
                      size="sm"
                      variant="outline"
                      className={`w-full mt-3 text-[10px] font-bold border-white/10 ${
                        sug.applied ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10' : 'dark:hover:bg-white/5'
                      }`}
                    >
                      {sug.applied ? 'Applied to Resume' : 'Apply Mock Suggestion'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Match Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glassmorphism rounded-2xl border p-6 flex flex-col justify-between h-[360px]">
                <h3 className="text-sm font-bold border-b border-white/5 pb-3">ATS Compliance Segment Breakdown</h3>
                <div className="flex-1 py-4 space-y-4 overflow-y-auto scrollbar-none">
                  {[
                    { label: 'Technical Core Competencies', value: currentMatch.skillMatchScore, color: 'bg-emerald-500' },
                    { label: 'Professional Experience Mapping', value: currentMatch.experienceMatchScore, color: 'bg-indigo-500' },
                    { label: 'Academic Education Assessment', value: currentMatch.educationMatchScore, color: 'bg-violet-500' },
                    { label: 'Geographical Constraints (Location)', value: currentMatch.locationMatchScore, color: 'bg-amber-500' },
                    { label: 'Salary Budget Compatibility', value: currentMatch.salaryMatchScore, color: 'bg-rose-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Similar Jobs recommended */}
              <div className="glassmorphism rounded-2xl border p-6 flex flex-col justify-between h-[360px]">
                <h3 className="text-sm font-bold border-b border-white/5 pb-3">Similar Highly-Aligned Jobs Recommendations</h3>
                <div className="flex-1 space-y-3 overflow-y-auto py-3 scrollbar-none pr-1">
                  {currentMatch.similarJobs.map((job) => (
                    <div key={job.id} className="bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center group hover:border-indigo-500/25 transition">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold">{job.title}</h4>
                        <p className="text-[10px] text-muted-foreground">{job.company} | {job.location} | {job.salary}</p>
                        <p className="text-[9px] text-indigo-500 font-semibold italic">{job.reason}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">{job.matchPercent}% Match</span>
                        <Button size="sm" variant="outline" className="text-[9px] font-bold h-7 border-white/10 dark:hover:bg-white/10 px-2.5">Apply Status</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 8. Matching History & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glassmorphism rounded-2xl border p-6 h-[340px] flex flex-col justify-between">
                <h3 className="text-sm font-bold border-b border-white/5 pb-3">ATS Performance Improvement Timeline</h3>
                <div className="flex-1 relative pl-8 py-4 overflow-y-auto scrollbar-none">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-indigo-500/20" />
                  {history.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="relative mb-6 last:mb-0">
                      <div className={`absolute -left-[24.5px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-slate-900 border-indigo-500 ${
                        item.isBest ? 'border-emerald-500' : ''
                      }`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{item.role}</span>
                          <span className="text-[9px] text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{item.company} | Overall: {item.matchPercent}% | ATS Score: {item.atsScore}/100</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10. Analytics charts */}
              <div className="glassmorphism rounded-2xl border p-6 h-[340px] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold">ATS Historical Analytics</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">ATS compliance growth trajectory over subsequent runs.</p>
                </div>
                <div className="flex-1 w-full min-h-0 py-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={history.slice(0, 5).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                      <XAxis dataKey="company" fontSize={8} stroke="#8b9bb4" tickLine={false} />
                      <YAxis fontSize={9} stroke="#8b9bb4" />
                      <Tooltip />
                      <Bar dataKey="matchPercent" fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={30} name="Compliance %" />
                      <Bar dataKey="atsScore" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={30} name="ATS Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}