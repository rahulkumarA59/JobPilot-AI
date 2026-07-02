import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Award, ChevronRight, Mic, Play, Settings, RefreshCw, Star, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockQuestions = [
  { id: "q1", question: "Explain the virtual DOM concept in React and how it improves rendering performance.", role: "Frontend Developer" },
  { id: "q2", question: "How would you design a scalable notification system supporting millions of active daily users?", role: "Full Stack Engineer" },
  { id: "q3", question: "Describe a challenging bug you recently encountered and how you systematically resolved it.", role: "Software Engineer" },
];

export default function InterviewsPage() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; text: string; keywords: string[] } | null>(null);

  const startRecording = () => {
    setRecording(true);
    setRecorded(false);
    setFeedback(null);
  };

  const stopRecording = () => {
    setRecording(false);
    setRecorded(true);
  };

  const getAIFeedback = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setFeedback({
        score: 87,
        text: "Excellent answer structure! You successfully described reconciliation, diffing algorithms, and how virtual DOM updates minimize heavy browser paint operations. To improve, try speaking slightly slower and mention fiber architecture.",
        keywords: ["Reconciliation", "Diffing", "Repaint", "Fiber", "State Updates"],
      });
    }, 2000);
  };

  const currentQ = mockQuestions[activeQuestion] || mockQuestions[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Interview Prep AI</h1>
          <p className="text-muted-foreground mt-1">Practice interview questions and get detailed, real-time feedback using AI</p>
        </div>
        <Badge variant="info" className="gap-1.5 px-3 py-1 text-xs">
          <Zap className="h-3.5 w-3.5" /> Mic Ready
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Question List */}
        <div className="md:col-span-1 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Practice Questions</p>
          {mockQuestions.map((q, i) => (
            <div
              key={q.id}
              onClick={() => {
                setActiveQuestion(i);
                setRecorded(false);
                setFeedback(null);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer bg-card ${
                activeQuestion === i
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <p className="text-xs text-primary font-semibold">{q.role}</p>
              <p className="text-xs font-medium text-foreground line-clamp-2 mt-1 leading-relaxed">{q.question}</p>
            </div>
          ))}
        </div>

        {/* Right Side: Recording Screen */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <span className="text-xs font-semibold text-primary">{currentQ.role}</span>
              <CardTitle className="text-lg leading-relaxed mt-1">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              {/* Virtual Recording Screen */}
              <div className="relative h-44 rounded-2xl bg-muted/60 border border-border flex flex-col items-center justify-center overflow-hidden">
                {recording ? (
                  <div className="text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto text-red-500 animate-ping">
                      <Mic className="h-6 w-6" />
                    </div>
                    <p className="text-xs text-red-500 font-semibold animate-pulse">Recording Answer... Speak now</p>
                  </div>
                ) : recorded ? (
                  <div className="text-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Answer Recorded (1m 12s)</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Video className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-xs text-muted-foreground">Ready to record audio response</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {recording ? (
                  <Button variant="destructive" onClick={stopRecording} className="gap-2 w-full">
                    Stop Recording
                  </Button>
                ) : (
                  <Button variant="outline" onClick={startRecording} className="gap-2 w-full">
                    <Mic className="h-4 w-4" /> Start Recording
                  </Button>
                )}

                {recorded && !feedback && (
                  <Button variant="gradient" onClick={getAIFeedback} loading={analyzing} className="gap-2 w-full">
                    Get AI Feedback
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Feedback Panel */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
              >
                <Card className="p-6 space-y-4 border-green-500/30 bg-green-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <h3 className="font-semibold text-base">AI Assessment</h3>
                    </div>
                    <Badge variant="success" className="text-xs font-bold px-2.5 py-1">
                      Score: {feedback.score}/100
                    </Badge>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">{feedback.text}</p>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Used Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {feedback.keywords.map((kw) => (
                        <Badge key={kw} variant="secondary" className="text-[10px]">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

