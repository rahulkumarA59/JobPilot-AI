import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { Sun, Moon } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      const res = await authService.login(data);
      login(res.user, res.token);
      navigate("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 relative">
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={toggleTheme}>
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-glow">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">AutoHire AI</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground mb-8">Sign in to continue your job search journey</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register("password")}
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="rememberMe" {...register("rememberMe")} className="rounded" />
                <label htmlFor="rememberMe" className="text-sm text-muted-foreground">Remember me for 30 days</label>
              </div>

              <Button type="submit" variant="gradient" size="lg" className="w-full" loading={isSubmitting}>
                Sign In <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs text-muted-foreground bg-background px-4">or continue with</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {["Google", "LinkedIn"].map((provider) => (
                <Button key={provider} variant="outline" size="default" onClick={() => { login({ id:"u1",email:"rahul@autohire.ai",name:"Rahul Kumar",avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",role:"user",plan:"pro",emailVerified:true,createdAt:"2024-01-15T00:00:00Z",lastLogin:new Date().toISOString() }, "mock_token"); navigate("/dashboard"); }}>
                  {provider}
                </Button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">Create one free</Link>
            </p>

            <p className="text-center text-xs text-muted-foreground mt-4 opacity-60">
              Demo: any email + password (6+ chars)
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative z-10 text-white text-center p-12 max-w-md">
          <div className="mb-8">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-premium">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Land jobs 10× faster</h2>
            <p className="text-blue-100 leading-relaxed">
              AutoHire AI applies to hundreds of jobs on your behalf, optimizes your resume with AI, and preps you for every interview.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { metric: "50K+", label: "Active Users" },
              { metric: "94%", label: "Success Rate" },
              { metric: "2.4M+", label: "Applications" },
              { metric: "10×", label: "Faster Hiring" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{s.metric}</div>
                <div className="text-sm text-blue-100">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
