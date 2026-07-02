import { sleep } from "./api";
import type { LoginPayload, SignupPayload, User } from "@/types";
import { TOKEN_KEY, USER_KEY } from "@/constants";

const MOCK_USER: User = {
  id: "u1", email: "rahul@autohire.ai", name: "Rahul Kumar",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
  role: "user", plan: "pro", emailVerified: true,
  createdAt: "2024-01-15T00:00:00Z", lastLogin: new Date().toISOString(),
};

export const authService = {
  async login(payload: LoginPayload) {
    await sleep(1200);
    if (payload.email && payload.password.length >= 6) {
      const token = "mock_jwt_token_" + Date.now();
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));
      return { user: MOCK_USER, token };
    }
    throw new Error("Invalid email or password");
  },

  async signup(payload: SignupPayload) {
    await sleep(1500);
    if (payload.email && payload.password === payload.confirmPassword) {
      return { message: "Account created. Please verify your email." };
    }
    throw new Error("Signup failed. Please check your details.");
  },

  async sendOTP(email: string) {
    await sleep(1000);
    return { message: `OTP sent to ${email}` };
  },

  async verifyOTP(email: string, otp: string) {
    await sleep(1000);
    if (otp === "123456") {
      return { verified: true, message: "Email verified successfully" };
    }
    throw new Error("Invalid OTP. Please try again.");
  },

  async forgotPassword(email: string) {
    await sleep(1000);
    return { message: `Password reset link sent to ${email}` };
  },

  async resetPassword(token: string, password: string) {
    await sleep(1000);
    if (token && password.length >= 8) {
      return { message: "Password reset successfully. Please login." };
    }
    throw new Error("Invalid or expired reset token");
  },

  async getMe(): Promise<User> {
    await sleep(500);
    const stored = localStorage.getItem(USER_KEY);
    if (stored) return JSON.parse(stored) as User;
    throw new Error("Not authenticated");
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
