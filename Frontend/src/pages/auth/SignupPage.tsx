import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { Progress } from "@/components/ui/progress";
import { getPasswordStrength } from "@/utils";
import { useThemeStore } from "@/store/themeStore";
import { Sun, Moon } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [watchedPassword, setWatchedPassword] = useState("");
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");
  const strength = getPasswordStrength(password);

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      await authService.signup(data);
      setSuccess(true);
      setTimeout(() => navigate("/verify-otp", { state: { email: data.email } }), 1500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 relative">
        <div className="absolute top-6 right-6">
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
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground mb-8">Start your AI-powered job search journey for free</p>

            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Account Created!</h3>
                <p className="text-muted-foreground">Redirecting to email verification...</p>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="John Doe" leftIcon={<User className="h-4 w-4" />} error={errors.name?.message} {...register("name")} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="you@company.com" leftIcon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register("email")} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
                      leftIcon={<Lock className="h-4 w-4" />}
                      rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                      error={errors.password?.message}
                      {...register("password")}
                    />
                    {password && (
                      <div className="space-y-1 mt-1">
                        <Progress value={(strength.score / 5) * 100} colorClass={strength.score >= 4 ? "bg-green-500" : strength.score >= 3 ? "bg-blue-500" : strength.score >= 2 ? "bg-yellow-500" : "bg-red-500"} />
                        <p className={`text-xs ${strength.color}`}>{strength.label}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input type="password" placeholder="Re-enter password" leftIcon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message} {...register("confirmPassword")} />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>

                  <Button type="submit" variant="gradient" size="lg" className="w-full" loading={isSubmitting}>
                    Create Free Account <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-violet-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative z-10 text-white p-12 max-w-md">
          <h2 className="text-3xl font-bold mb-6">What you get for free</h2>
          <div className="space-y-4">
            {[
              "5 AI-powered applications per month",
              "Resume ATS score checker",
              "Application tracking dashboard",
              "Job match recommendations",
              "Email notifications for updates",
              "Community support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-300 shrink-0" />
                <span className="text-blue-50">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
