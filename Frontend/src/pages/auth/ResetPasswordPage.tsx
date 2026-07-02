import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { authService } from "@/services/auth.service";
import { getPasswordStrength } from "@/utils";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const password = watch("password", "");
  const strength = getPasswordStrength(password);

  const onSubmit = async (data: FormData) => {
    await authService.resetPassword("mock_token", data.password);
    setSuccess(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-glow">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">AutoHire AI</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-8 shadow-premium">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
              <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-7 w-7 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Set new password</h2>
                <p className="text-muted-foreground text-sm">Create a strong password for your account</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">New Password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
                    error={errors.password?.message}
                    {...register("password")}
                  />
                  {password && (
                    <div className="space-y-1">
                      <Progress value={(strength.score / 5) * 100} colorClass={strength.score >= 4 ? "bg-green-500" : strength.score >= 2 ? "bg-yellow-500" : "bg-red-500"} />
                      <p className={`text-xs ${strength.color}`}>{strength.label}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input type="password" placeholder="Re-enter password" leftIcon={<Lock className="h-4 w-4" />} error={errors.confirmPassword?.message} {...register("confirmPassword")} />
                </div>
                <Button type="submit" variant="gradient" size="lg" className="w-full" loading={isSubmitting}>
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
