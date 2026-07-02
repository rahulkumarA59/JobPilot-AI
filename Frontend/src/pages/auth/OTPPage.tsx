import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = (state as { email?: string })?.email ?? "your email";

  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v;
    setOtp(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return setError("Enter all 6 digits");
    setLoading(true); setError("");
    try {
      await authService.verifyOTP(email, code);
      navigate("/login", { state: { verified: true } });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid OTP");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    await authService.sendOTP(email);
    setError(""); setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-8 shadow-premium text-center">
          <div className="h-14 w-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📬</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-muted-foreground text-sm mb-8">
            We sent a 6-digit code to <strong className="text-foreground">{email}</strong>.<br />
            <span className="text-xs opacity-70">(Demo: use 123456)</span>
          </p>

          {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>}

          <div className="flex gap-3 justify-center mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-14 w-11 text-center text-xl font-bold border-2 border-border rounded-xl bg-background focus:border-primary focus:outline-none transition-colors"
              />
            ))}
          </div>

          <Button variant="gradient" size="lg" className="w-full mb-4" loading={loading} onClick={handleVerify}>
            Verify Email
          </Button>

          <button onClick={handleResend} className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mx-auto transition-colors">
            <RefreshCw className="h-4 w-4" /> Resend code
          </button>

          <div className="mt-4">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
