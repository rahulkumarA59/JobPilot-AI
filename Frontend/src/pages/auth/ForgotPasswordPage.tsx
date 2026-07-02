import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Zap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";

const schema = z.object({ email: z.string().email("Invalid email address") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await authService.forgotPassword(data.email);
    setSent(true);
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
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">
                We sent a password reset link to <strong>{getValues("email")}</strong>. It expires in 15 minutes.
              </p>
              <Link to="/login"><Button variant="outline" className="w-full"><ArrowLeft className="h-4 w-4" /> Back to Login</Button></Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-7 w-7 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Forgot password?</h2>
                <p className="text-muted-foreground text-sm">No worries. Enter your email and we'll send a reset link.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="you@company.com" leftIcon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register("email")} />
                </div>
                <Button type="submit" variant="gradient" size="lg" className="w-full" loading={isSubmitting}>
                  Send Reset Link
                </Button>
              </form>
              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
