import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  User, MapPin, Mail, Phone, Globe, Edit3,
  Plus, Briefcase, GraduationCap, FolderOpen, Award, Languages,
  Upload, Brain, Target, Download, ExternalLink
} from "lucide-react";
import { Linkedin, Github } from "@/components/common/BrandIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { ProfileSkeleton } from "@/components/ui/skeleton";
import { profileService } from "@/services/profile.service";
import { formatDate } from "@/utils";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
  });

  const { data: scores } = useQuery({
    queryKey: ["resume-scores"],
    queryFn: () => profileService.getResumeScore(),
  });

  if (isLoading) return <div className="max-w-5xl"><ProfileSkeleton /></div>;
  if (!profile) return null;

  const tabs = ["Overview", "Experience", "Education", "Projects", "Skills", "Certificates"];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your professional profile and resume</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Download Resume</Button>
          <Button variant="gradient" size="sm" className="gap-2"><Edit3 className="h-4 w-4" /> Edit Profile</Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative">
            <Avatar src={profile.avatar} name={`${profile.firstName} ${profile.lastName}`} size="xl" />
            <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors">
              <Upload className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
                <p className="text-muted-foreground">{profile.headline}</p>
              </div>
              <Badge variant="success" className="text-xs">Open to Work</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">{profile.bio}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              {profile.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{profile.location}</span>}
              {profile.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{profile.phone}</span>}
              {profile.socialLinks.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Linkedin className="h-4 w-4" />LinkedIn</a>}
              {profile.socialLinks.github && <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Github className="h-4 w-4" />GitHub</a>}
              {profile.socialLinks.portfolio && <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Globe className="h-4 w-4" />Portfolio</a>}
            </div>
          </div>
        </div>
      </Card>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Profile Completion", value: profile.profileCompletion, color: "from-blue-600 to-violet-600", icon: Target },
          { label: "ATS Score", value: profile.atsScore, color: "from-green-600 to-emerald-500", icon: Brain },
          { label: "Resume Score", value: profile.resumeScore, color: "from-amber-500 to-orange-400", icon: Award },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="h-4 w-4 text-white" />
              </div>
              <p className="font-medium text-sm">{s.label}</p>
            </div>
            <div className="text-3xl font-bold mb-2">{s.value}<span className="text-base text-muted-foreground">/100</span></div>
            <Progress value={s.value} />
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.toLowerCase()
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Languages className="h-4 w-4 text-primary" />Languages</h3>
            <div className="flex flex-wrap gap-2">{profile.languages.map(l => <Badge key={l} variant="secondary">{l}</Badge>)}</div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Preferred Locations</h3>
            <div className="flex flex-wrap gap-2">{profile.preferredLocations.map(l => <Badge key={l} variant="info">{l}</Badge>)}</div>
          </Card>
          <Card className="p-5 sm:col-span-2">
            <h3 className="font-semibold mb-3">Expected Salary</h3>
            <p className="text-2xl font-bold gradient-text">
              ₹{(profile.expectedSalary.min / 100000).toFixed(1)}L – ₹{(profile.expectedSalary.max / 100000).toFixed(1)}L
            </p>
            <p className="text-sm text-muted-foreground mt-1">Per annum ({profile.expectedSalary.currency})</p>
          </Card>
          {scores && (
            <Card className="p-5 sm:col-span-2">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Brain className="h-4 w-4 text-primary" />AI Resume Suggestions</h3>
              <ul className="space-y-2">
                {scores.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-500 mt-0.5">💡</span>{s}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {activeTab === "experience" && (
        <div className="space-y-4">
          {profile.experience.map((exp) => (
            <Card key={exp.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company} · {exp.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                    </p>
                    <p className="text-sm mt-3 leading-relaxed">{exp.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                    </div>
                  </div>
                </div>
                {exp.isCurrent && <Badge variant="success" className="shrink-0">Current</Badge>}
              </div>
            </Card>
          ))}
          <Button variant="outline" className="gap-2 w-full"><Plus className="h-4 w-4" />Add Experience</Button>
        </div>
      )}

      {activeTab === "education" && (
        <div className="space-y-4">
          {profile.education.map((edu) => (
            <Card key={edu.id} className="p-5">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground mt-1">{edu.startYear} – {edu.endYear}</p>
                  {edu.grade && <p className="text-sm mt-1">Grade: <strong>{edu.grade}</strong></p>}
                  {edu.description && <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>}
                </div>
              </div>
            </Card>
          ))}
          <Button variant="outline" className="gap-2 w-full"><Plus className="h-4 w-4" />Add Education</Button>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="space-y-4">
          {profile.projects.map((proj) => (
            <Card key={proj.id} className="p-5">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <FolderOpen className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{proj.name}</h3>
                    <p className="text-sm text-muted-foreground">{proj.startDate} – {proj.endDate ?? "Present"}</p>
                    <p className="text-sm mt-2 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.techStack.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm" className="gap-1 text-xs"><ExternalLink className="h-3.5 w-3.5" />Live</Button></a>}
                  {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm" className="gap-1 text-xs"><Github className="h-3.5 w-3.5" />GitHub</Button></a>}
                </div>
              </div>
            </Card>
          ))}
          <Button variant="outline" className="gap-2 w-full"><Plus className="h-4 w-4" />Add Project</Button>
        </div>
      )}

      {activeTab === "skills" && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Technical Skills</h3>
            <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" />Add Skill</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm">{skill}</Badge>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "certificates" && (
        <div className="space-y-4">
          {profile.certificates.map((cert) => (
            <Card key={cert.id} className="p-5">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Issued {cert.issueDate}{cert.expiryDate && ` · Expires ${cert.expiryDate}`}
                  </p>
                  {cert.credentialId && <p className="text-xs text-muted-foreground mt-0.5">ID: {cert.credentialId}</p>}
                </div>
                {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button></a>}
              </div>
            </Card>
          ))}
          <Button variant="outline" className="gap-2 w-full"><Plus className="h-4 w-4" />Add Certificate</Button>
        </div>
      )}
    </div>
  );
}
