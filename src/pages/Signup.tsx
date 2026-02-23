import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Loader2, BookOpen, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const gradeOptions = [
  "Elementary (K-5)",
  "Middle School (6-8)",
  "High School (9-12)",
  "Undergraduate",
  "Graduate",
  "Professional Development",
];

const subjectOptions = [
  "Mathematics", "Science", "English/Language Arts", "Social Studies",
  "Computer Science", "Foreign Languages", "Arts", "Physical Education",
  "Business", "Engineering", "Health Sciences", "Other",
];

const stateOptions = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const Signup = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "instructor" ? "instructor" : "student";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "instructor">(initialRole);
  const [institution, setInstitution] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subjectArea, setSubjectArea] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });

    if (authError) {
      toast({ title: "Signup failed", description: authError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (authData.user && authData.session) {
      // Assign role
      await supabase.from("user_roles").insert({ user_id: authData.user.id, role: selectedRole });

      // Update profile with education fields
      await supabase.from("profiles").update({
        institution: institution || null,
        grade_level: gradeLevel || null,
        subject_areas: subjectArea ? [subjectArea] : null,
        state: state || null,
        phone: phone || null,
      }).eq("user_id", authData.user.id);

      setLoading(false);
      navigate("/dashboard");
    } else {
      setLoading(false);
      toast({ title: "Check your email", description: "We sent you a confirmation link. Please verify your email to continue." });
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-primary via-primary to-accent">
        <div className="max-w-md px-8 text-primary-foreground">
          <GraduationCap className="mb-6 h-12 w-12" />
          <h2 className="text-3xl font-bold">
            {selectedRole === "instructor" ? "Empower your students" : "Start your learning journey"}
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {selectedRole === "instructor"
              ? "Create courses with AI assistance, manage assessments, track student progress, and issue certificates - all completely free."
              : "Access quality courses, track your progress, earn certificates, and build knowledge that matters."}
          </p>
          <div className="mt-8 space-y-3 text-sm text-primary-foreground/70">
            <p>OK 100% Free - No hidden costs</p>
            <p>OK US Education Standards compliant</p>
            <p>OK Certificates upon completion</p>
            <p>OK AI-powered learning tools</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center overflow-auto px-4 py-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Learnflow AI</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>

          {/* Role selector */}
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
              <BookOpen className={`h-5 w-5 ${selectedRole === "student" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="mt-1 text-sm font-medium">Student</span>
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
              <Users className={`h-5 w-5 ${selectedRole === "instructor" ? "text-accent" : "text-muted-foreground"}`} />
              <span className="mt-1 text-sm font-medium">Instructor</span>
              <span className="text-xs text-muted-foreground">I want to teach</span>
            </button>
          </div>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="you@school.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input id="confirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/50 p-4 space-y-4">
              <p className="text-sm font-medium text-foreground">Educational Information</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="institution">School / Institution</Label>
                  <Input id="institution" placeholder="e.g. Springfield High School" value={institution} onChange={(e) => setInstitution(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Grade Level</Label>
                  <Select value={gradeLevel} onValueChange={setGradeLevel}>
                    <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{selectedRole === "instructor" ? "Teaching Subject" : "Area of Interest"}</Label>
                  <Select value={subjectArea} onValueChange={setSubjectArea}>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {stateOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedRole === "instructor" ? "Register as Instructor" : "Create Student Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;



