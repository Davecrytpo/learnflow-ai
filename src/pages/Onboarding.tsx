import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const roles = [
  {
    value: "student" as const,
    icon: BookOpen,
    title: "I'm a Student",
    description: "I want to enroll in courses and learn new skills.",
  },
  {
    value: "instructor" as const,
    icon: Users,
    title: "I'm an Instructor",
    description: "I want to create courses and teach students.",
  },
];

const Onboarding = () => {
  const [selected, setSelected] = useState<"student" | "instructor" | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, loading, refreshRole } = useAuthContext();

  // Redirect logic - runs only when the single shared state is fully loaded
  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/login", { replace: true }); return; }
    if (role === "student") { navigate("/dashboard/student", { replace: true }); return; }
    if (role === "instructor") { navigate("/instructor", { replace: true }); return; }
    if (role === "admin") { navigate("/admin", { replace: true }); return; }
  }, [user, role, loading, navigate]);

  const handleContinue = async () => {
    if (!selected || !user) return;
    setSaving(true);

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: selected });

    if (error) {
      setSaving(false);
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // Refresh shared context so redirect useEffect fires with the new role
    await refreshRole();
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render the form if the user already has a role (redirect is imminent)
  if (role) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
          <GraduationCap className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">How will you use Learnflow AI?</h1>
        <p className="mt-2 text-muted-foreground">Select your role to personalize your experience.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {roles.map((r) => (
            <motion.button
              key={r.value}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(r.value)}
              className={`rounded-xl border p-6 text-left transition-all ${
                selected === r.value
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <r.icon className={`mb-3 h-6 w-6 ${selected === r.value ? "text-primary" : "text-muted-foreground"}`} />
              <h3 className="font-semibold text-foreground">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
            </motion.button>
          ))}
        </div>

        <Button onClick={handleContinue} disabled={!selected || saving} className="mt-8 w-full" size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;



