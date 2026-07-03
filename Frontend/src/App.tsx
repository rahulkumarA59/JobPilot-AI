import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PublicLayout } from "@/layouts/PublicLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Toaster } from "sonner";

// Lazy Pages
import { lazy, Suspense } from "react";
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const OTPPage = lazy(() => import("@/pages/auth/OTPPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));

const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const AIAgentPage = lazy(() => import("@/pages/dashboard/AIAgentPage"));
const AIResumeStudioPage = lazy(() => import("@/pages/dashboard/AIResumeStudioPage"));
const CompanyIntelligencePage = lazy(() => import("@/pages/dashboard/CompanyIntelligencePage"));
const ApplicationsPage = lazy(() => import("@/pages/dashboard/ApplicationsPage"));
const JobSearchPage = lazy(() => import("@/pages/dashboard/JobSearchPage"));
const ResumePage = lazy(() => import("@/pages/dashboard/ResumePage"));
const InterviewsPage = lazy(() => import("@/pages/dashboard/InterviewsPage"));
const NotificationsPage = lazy(() => import("@/pages/dashboard/NotificationsPage"));
const ProfilePage = lazy(() => import("@/pages/dashboard/ProfilePage"));
const SettingsPage = lazy(() => import("@/pages/dashboard/SettingsPage"));
const JobDiscoveryDashboard = lazy(() => import("@/features/job-discovery/JobDiscoveryDashboard"));
const SourceManager = lazy(() => import("@/features/job-discovery/SourceManager"));
const MatchingDashboard = lazy(() => import("@/features/matching-engine/MatchingDashboard"));
const CoverLetterDashboard = lazy(() => import("@/features/cover-letter/CoverLetterDashboard"));

const NotFoundPage = lazy(() => import("@/pages/errors/NotFoundPage"));
const ServerErrorPage = lazy(() => import("@/pages/errors/ServerErrorPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function LoadingScreen() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading AutoHire AI...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
            </Route>

            {/* Auth Pages (no header/footer layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<OTPPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Dashboard Layout */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="agent" element={<AIAgentPage />} />
              <Route path="resume-studio" element={<AIResumeStudioPage />} />
              <Route path="company-intelligence" element={<CompanyIntelligencePage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="jobs" element={<JobSearchPage />} />
              <Route path="resume" element={<ResumePage />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="job-discovery" element={<JobDiscoveryDashboard />} />
              <Route path="source-manager" element={<SourceManager />} />
              <Route path="matching-engine" element={<MatchingDashboard />} />
              <Route path="cover-letter" element={<CoverLetterDashboard />} />
            </Route>

            {/* Error Pages */}
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
