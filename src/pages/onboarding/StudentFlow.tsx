import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, Sparkles, Brain, BookOpen, Target, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const questions = [
  {
    id: "goal",
    question: "What is your primary goal?",
    icon: Target,
    options: ["Get a job", "Upgrade skills", "Academic degree", "Learn for fun"]
  },
  {
    id: "style",
    question: "How do you prefer to learn?",
    icon: Brain,
    options: ["Video-based", "Live classes", "Reading materials", "Practice-based", "All of the above"]
  },
  {
    id: "level",
    question: "What is your current proficiency?",
    icon: BookOpen,
    options: ["Beginner", "Intermediate", "Advanced"]
  }
];

const StudentFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleOptionSelect = (option: string) => {
    setAnswers({ ...answers, [questions[step].id]: option });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      analyzeProfile();
    }
  };

  const analyzeProfile = async () => {
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(r => setTimeout(r, 2000));
    setAnalyzing(false);
    setStep(questions.length); // Move to recommendation step
  };

  const handleSignup = async () => {
    // Redirect to signup page with pre-filled role and intent
    // We'll pass the profile data via state or query params, but here we'll just go to signup
    // In a real app, we might create the user here if we had auth providers integrated directly
    navigate(`/signup?role=student&goal=${answers.goal}&style=${answers.style}&level=${answers.level}`);
  };

  const currentQ = questions[step];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-lg z-10">
        <AnimatePresence mode="wait">
          {analyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <div className="mx-auto w-24 h-24 relative mb-6">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-primary animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Analyzing your profile...</h2>
              <p className="text-muted-foreground">Building your personalized curriculum.</p>
            </motion.div>
          ) : step < questions.length ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Step {step + 1} of {questions.length}
                </span>
                <h1 className="text-3xl font-display font-bold mb-3">{currentQ.question}</h1>
                <p className="text-muted-foreground">Help us tailor the experience to you.</p>
              </div>

              <div className="grid gap-3">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(opt)}
                    className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">{opt}</span>
                    <div className="h-6 w-6 rounded-full border border-border group-hover:border-primary flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-8">
                <div className="h-16 w-16 mx-auto bg-gradient-brand rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">We found a match!</h1>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Based on your goal to <strong>{answers.goal}</strong> via <strong>{answers.style}</strong>, we've curated a learning path for you.
                </p>
              </div>

              <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm border-primary/20 text-left">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" /> Recommended Path
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border">
                    <div className="h-10 w-10 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">1</div>
                    <div>
                      <p className="font-medium text-sm">Foundations of {answers.goal}</p>
                      <p className="text-xs text-muted-foreground">2 weeks • Beginner</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border">
                    <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">2</div>
                    <div>
                      <p className="font-medium text-sm">Advanced Applications</p>
                      <p className="text-xs text-muted-foreground">4 weeks • Project-based</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Button size="lg" className="w-full h-12 text-lg bg-gradient-brand shadow-lg shadow-primary/20" onClick={handleSignup}>
                Create Your Personalized Space <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                Join 15,000+ learners achieving their goals.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentFlow;
