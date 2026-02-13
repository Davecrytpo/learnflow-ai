import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2, BookOpen, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "instructor" ? "instructor" : "student";
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "instructor">(initialRole as "student" | "instructor");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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

    // If the user was created and auto-confirmed, assign role immediately
    if (authData.user && authData.session) {
      await supabase.from("user_roles").insert({ user_id: authData.user.id, role: selectedRole });
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
      <div className="hidden w-1/2 bg-gradient-to-br from-primary to-accent lg:flex lg:items-center lg:justify-center">
        <div className="max-w-md px-8 text-primary-foreground">
          <GraduationCap className="mb-6 h-12 w-12" />
          <h2 className="text-3xl font-bold">
            {selectedRole === "instructor" ? "Start teaching today" : "Start your journey"}
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {selectedRole === "instructor"
              ? "Create courses, grow your audience, and earn from your expertise."
              : "Join thousands of students building knowledge together."}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center px-4 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Classroom</span>
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
              className={`flex flex-col items-center rounded-lg border p-4 transition-all ${
                selectedRole === "student"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <BookOpen className={`h-5 w-5 ${selectedRole === "student" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="mt-1 text-sm font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("instructor")}
              className={`flex flex-col items-center rounded-lg border p-4 transition-all ${
                selectedRole === "instructor"
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <Users className={`h-5 w-5 ${selectedRole === "instructor" ? "text-accent" : "text-muted-foreground"}`} />
              <span className="mt-1 text-sm font-medium">Instructor</span>
            </button>
          </div>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
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
