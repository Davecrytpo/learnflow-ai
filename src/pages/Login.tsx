import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ArrowRight, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "instructor" ? "instructor" : "student";
  const [selectedRole, setSelectedRole] = useState<"student" | "instructor">(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-gradient-brand" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md px-10 text-primary-foreground"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <svg className="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold">Global Institute</span>
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            {selectedRole === "instructor" ? "Welcome back, instructor" : "Welcome back to your learning journey"}
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/70">
            {selectedRole === "instructor"
              ? "Sign in to manage courses, assessments, and your teaching workflow."
              : "Sign in to access your courses, track your progress, and continue earning certificates."}
          </p>
          <div className="mt-10 space-y-3">
            {(selectedRole === "instructor"
              ? ["Build course curriculum", "Grade assessments faster", "Track learner progress"]
              : ["Access 2,800+ courses", "Track your progress in real-time", "Download your certificates"]
            ).map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20">
                  <ArrowRight className="h-3 w-3" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Learnflow AI</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            New to Learnflow AI?{" "}
            <Link to={`/signup?role=${selectedRole}`} className="text-primary hover:underline">Create an account</Link>
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`flex flex-col items-center rounded-xl border p-4 transition-all ${
                selectedRole === "student"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <span className="text-sm font-medium">Student</span>
              <span className="text-xs text-muted-foreground">I want to learn</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("instructor")}
              className={`flex flex-col items-center rounded-xl border p-4 transition-all ${
                selectedRole === "instructor"
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <span className="text-sm font-medium">Instructor</span>
              <span className="text-xs text-muted-foreground">I want to teach</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 bg-card border-border" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Input id="password" type={showPass ? "text" : "password"} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 bg-card border-border pr-10 focus:border-primary" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="h-12 w-full bg-gradient-brand text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in to Learnflow AI
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="hover:text-foreground underline">Terms of Service</a> and{" "}
            <a href="#" className="hover:text-foreground underline">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
