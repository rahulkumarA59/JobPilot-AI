import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  Zap, ArrowRight, CheckCircle2, Star, ChevronDown, Sparkles,
  Target, BarChart3, Brain, FileSearch, Clock, Shield,
  TrendingUp, Users, Briefcase, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PRICING_PLANS } from "@/constants";
import { cn, formatNumber } from "@/utils";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge variant="info" className="mb-6 px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Job Search Platform
            <ArrowRight className="h-3.5 w-3.5" />
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          Land Your Dream Job
          <br />
          <span className="gradient-text">10× Faster with AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          AutoHire AI automates your job applications, optimizes your resume for ATS, tracks every opportunity, and uses AI to help you ace interviews — all in one platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link to="/signup">
            <Button variant="gradient" size="xl" className="w-full sm:w-auto gap-2">
              Start for Free <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="xl" className="w-full sm:w-auto">
              See How It Works
            </Button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {[
            { value: "50K+", label: "Active Users" },
            { value: "2.4M+", label: "Applications Sent" },
            { value: "94%", label: "Success Rate" },
            { value: "10×", label: "Faster Hiring" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Floating Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="glass-card rounded-2xl p-4 max-w-5xl mx-auto">
            {/* Mock Dashboard UI */}
            <div className="bg-card rounded-xl overflow-hidden border border-border">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="flex-1 bg-background rounded-md h-5 mx-4" />
              </div>
              <div className="p-4 grid grid-cols-4 gap-3">
                {[
                  { label: "Applications", value: "48", icon: Briefcase, color: "from-blue-600 to-blue-400" },
                  { label: "Interviews", value: "12", icon: Users, color: "from-violet-600 to-violet-400" },
                  { label: "Offers", value: "3", icon: Trophy, color: "from-green-600 to-green-400" },
                  { label: "AI Score", value: "94%", icon: Brain, color: "from-amber-500 to-orange-400" },
                ].map((s) => (
                  <div key={s.label} className="bg-muted/50 rounded-xl p-3">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
                      <s.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-lg font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3 h-24">
                  <div className="text-xs font-medium mb-2">Weekly Applications</div>
                  <div className="flex items-end gap-1 h-12">
                    {[4, 7, 3, 9, 6, 2, 1].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500/20 rounded-sm" style={{ height: `${(h / 9) * 100}%` }} />
                    ))}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 h-24 space-y-1.5">
                  <div className="text-xs font-medium mb-2">Recent Activity</div>
                  {["Interview at Stripe 🎉", "Applied to Notion", "Resume Score: 94"].map((a) => (
                    <div key={a} className="text-[10px] text-muted-foreground bg-background/50 rounded-lg px-2 py-1 truncate">{a}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const features = [
  { icon: Brain, title: "AI Resume Optimizer", description: "Our AI analyzes your resume against job descriptions and suggests targeted improvements to maximize your ATS score and interview rate.", color: "from-blue-600 to-blue-400" },
  { icon: Zap, title: "1-Click Auto Apply", description: "AutoHire AI fills out job applications automatically using your profile. Apply to 100+ jobs per day while you sleep.", color: "from-violet-600 to-violet-400" },
  { icon: Target, title: "Smart Job Matching", description: "Get matched with jobs that align with your skills, experience, and preferences using our proprietary ML matching engine.", color: "from-pink-600 to-pink-400" },
  { icon: BarChart3, title: "Application Analytics", description: "Track your entire job search with detailed analytics. See which applications get responses and optimize your strategy.", color: "from-green-600 to-green-400" },
  { icon: FileSearch, title: "ATS Score Checker", description: "Instantly check how well your resume passes Applicant Tracking Systems before applying to any job.", color: "from-amber-500 to-orange-400" },
  { icon: Clock, title: "Interview Prep AI", description: "Practice with AI-generated interview questions tailored to each company and role. Get real-time feedback on your answers.", color: "from-cyan-600 to-cyan-400" },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <motion.div variants={fadeUp}>
            <Badge variant="purple" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to
              <span className="gradient-text"> win the job search</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI-powered resume optimization to automated applications and interview prep — AutoHire AI is your complete job search platform.
            </p>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp}>
              <Card className="p-6 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full">
                <CardContent className="p-0">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <motion.div variants={fadeUp}>
            <Badge variant="success" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">Start free. Upgrade when you're ready. Cancel anytime.</p>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => (
            <motion.div key={plan.id} variants={fadeUp}>
              <div className={cn("relative rounded-2xl p-6 h-full flex flex-col", plan.highlighted ? "bg-gradient-to-b from-blue-600 to-violet-600 text-white shadow-glow" : "bg-card border border-border")}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={cn("font-bold text-xl mb-1", plan.highlighted ? "text-white" : "")}>{plan.name}</h3>
                  <p className={cn("text-sm mb-4", plan.highlighted ? "text-blue-100" : "text-muted-foreground")}>{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className={cn("text-sm", plan.highlighted ? "text-blue-100" : "text-muted-foreground")}>/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className={cn("h-4 w-4 mt-0.5 shrink-0", plan.highlighted ? "text-blue-200" : "text-green-500")} />
                      <span className={plan.highlighted ? "text-blue-50" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button variant={plan.highlighted ? "glass" : "outline"} className={cn("w-full", plan.highlighted && "border-white/30 text-white hover:bg-white/20")}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  { name: "Sarah Chen", role: "Software Engineer at Google", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", text: "AutoHire AI helped me land my dream job at Google in just 6 weeks. The ATS optimizer boosted my resume score from 62 to 94 and I started getting responses immediately.", rating: 5 },
  { name: "Marcus Johnson", role: "Product Manager at Meta", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", text: "I applied to 200+ jobs in a month without lifting a finger. The auto-apply feature is game-changing. Got 12 interviews and 3 offers.", rating: 5 },
  { name: "Priya Patel", role: "Data Scientist at Netflix", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", text: "The interview prep AI is incredible. It asked me the exact questions I got in my Netflix interview. Went from 0 offers to a $180K package.", rating: 5 },
  { name: "Alex Rivera", role: "DevOps Engineer at Stripe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", text: "Went from 2 years unemployed to landing at Stripe. AutoHire AI's job matching found opportunities I never would have found manually.", rating: 5 },
  { name: "Emma Watson", role: "UX Designer at Figma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", text: "The resume score went from 54 to 91. Figma reached out to me within a week! This platform is worth every penny.", rating: 5 },
  { name: "David Kim", role: "Backend Engineer at Notion", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", text: "As an international student, job searching was brutal. AutoHire AI automated everything and I landed 6 offers in 2 months.", rating: 5 },
];

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <motion.div variants={fadeUp}>
            <Badge variant="warning" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">50,000+ job seekers</span>
            </h2>
            <p className="text-lg text-muted-foreground">Real stories from people who landed their dream jobs with AutoHire AI.</p>
          </motion.div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 h-full">
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full bg-muted" />
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  { q: "Is AutoHire AI free to use?", a: "Yes! Our Free plan includes 5 applications per month, basic resume scoring, and application tracking. Upgrade to Pro for unlimited applications and advanced AI features." },
  { q: "How does the AI resume optimizer work?", a: "Our AI analyzes your resume against thousands of successful resumes and the specific job description you're targeting. It identifies keyword gaps, formatting issues, and suggests specific improvements to maximize your ATS score." },
  { q: "Can AutoHire AI really auto-apply to jobs?", a: "Yes! Our 1-click apply feature uses your profile data to automatically fill out job applications on major platforms. You can set daily limits and filters to ensure quality applications." },
  { q: "How accurate is the ATS score checker?", a: "Our ATS simulator is trained on data from 200+ real ATS systems including Taleo, Greenhouse, Lever, and Workday. It has a 94% accuracy rate compared to actual ATS outcomes." },
  { q: "Can I cancel my subscription anytime?", a: "Absolutely. Cancel anytime with no questions asked. Your data remains accessible for 30 days after cancellation." },
  { q: "Is my data safe and private?", a: "Yes. We use bank-level encryption (AES-256), never sell your data to third parties, and you can delete your account and all data at any time." },
];

function FAQSection() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <motion.div variants={fadeUp}>
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about AutoHire AI.</p>
          </motion.div>
        </AnimatedSection>
        <AnimatedSection className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-medium text-sm hover:bg-accent/50 transition-colors">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </div>
                </details>
              </Card>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-violet-700 p-12 text-white"
        >
          <div className="absolute inset-0 dot-pattern opacity-10" />
          <div className="relative z-10">
            <Badge className="bg-white/20 text-white border-white/30 mb-6">Get Started Today</Badge>
            <h2 className="text-4xl font-bold mb-4">Ready to land your dream job?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ job seekers using AutoHire AI to automate their job search. Free forever, upgrade when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50 font-bold">
                  Start for Free — No Credit Card <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
