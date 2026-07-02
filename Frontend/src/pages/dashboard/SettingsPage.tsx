import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Bell, Lock, Globe, Shield, Trash2, Save, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useThemeStore } from "@/store/themeStore";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState("general");
  const [successMsg, setSuccessMsg] = useState("");
  const [generalSettings, setGeneralSettings] = useState({
    language: "English",
    timezone: "GMT+5:30 (IST)",
  });
  const [notifSettings, setNotifSettings] = useState({
    emailUpdates: true,
    emailNewJobs: true,
    emailInterviewReminders: true,
    pushNotifs: false,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showSalary: false,
    allowRecruiterContact: true,
  });

  const handleSave = () => {
    setSuccessMsg("Settings saved successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const sections = [
    { id: "general", label: "General & Theme", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "privacy", label: "Privacy & Visibility", icon: Shield },
    { id: "danger", label: "Danger Zone", icon: Trash2 },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your personal preferences and account safety.</p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl text-sm font-medium transition-all ${
                  activeSection === sec.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                } ${sec.id === "danger" ? "hover:text-destructive hover:bg-destructive/5" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-6">
              {activeSection === "general" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">General Settings</h3>
                    <p className="text-sm text-muted-foreground">Adjust language, time zones, and interface themes.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Theme Preference</label>
                      <div className="flex gap-2">
                        {(["light", "dark", "system"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                              theme === t
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:bg-accent"
                            }`}
                          >
                            <span className="capitalize">{t}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Language</label>
                      <select
                        value={generalSettings.language}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Time Zone</label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option>GMT+5:30 (IST)</option>
                        <option>GMT-5:00 (EST)</option>
                        <option>GMT+0:00 (UTC)</option>
                      </select>
                    </div>
                  </div>

                  <Button variant="gradient" onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Notification Preferences</h3>
                    <p className="text-sm text-muted-foreground">Manage which updates you receive and where.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "emailUpdates", label: "Email: Application Updates", desc: "Get emailed whenever your application status changes." },
                      { key: "emailNewJobs", label: "Email: New Matches", desc: "Receive updates when new AI jobs match your profile." },
                      { key: "emailInterviewReminders", label: "Email: Interview Reminders", desc: "Reminders for scheduled interviews." },
                      { key: "pushNotifs", label: "Browser Push Notifications", desc: "Real-time updates straight to your browser." },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between gap-4 p-3 rounded-xl border border-border/50">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifSettings[item.key as keyof typeof notifSettings]}
                          onChange={(e) => setNotifSettings({ ...notifSettings, [item.key]: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                        />
                      </div>
                    ))}
                  </div>

                  <Button variant="gradient" onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" /> Save Preferences
                  </Button>
                </div>
              )}

              {activeSection === "password" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    <p className="text-sm text-muted-foreground">Update your account credentials to keep them secure.</p>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">New Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                  </div>

                  <Button variant="gradient" onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" /> Update Password
                  </Button>
                </div>
              )}

              {activeSection === "privacy" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Privacy & Visibility</h3>
                    <p className="text-sm text-muted-foreground">Control how recruiters see your profile and applications.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "profileVisible", label: "Public Profile", desc: "Allow companies and recruiters to search and view your profile." },
                      { key: "showSalary", label: "Show Expected Salary", desc: "Display expected salary ranges on your public card." },
                      { key: "allowRecruiterContact", label: "Recruiter DMs", desc: "Allow recruiters to message you directly on the platform." },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between gap-4 p-3 rounded-xl border border-border/50">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacySettings[item.key as keyof typeof privacySettings]}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, [item.key]: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                        />
                      </div>
                    ))}
                  </div>

                  <Button variant="gradient" onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" /> Save Privacy Settings
                  </Button>
                </div>
              )}

              {activeSection === "danger" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground">Irreversible actions relating to your AutoHire AI account.</p>
                  </div>

                  <Card className="border-destructive/30 bg-destructive/5 p-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm">Delete Account</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Permanently delete your profile, resumes, applications, and all associated tracking data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" /> Delete Account
                    </Button>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
