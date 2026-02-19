import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
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
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  // If user already has a role, redirect them immediately
  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) { navigate("/login"); return; }
    if (role === "student") navigate("/dashboard/student", { replace: true });
    else if (role === "instructor") navigate("/instructor", { replace: true });
    else if (role === "admin") navigate("/admin", { replace: true });
  }, [user, role, authLoading, roleLoading, navigate]);

  const handleContinue = async () => {
    if (!selected || !user) return;
    setSaving(true);

    // Use upsert to handle cases where role might already exist
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: user.id, role: selected }, { onConflict: "user_id,role" });

    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
          <GraduationCap className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">How will you use Classroom?</h1>
        <p className="mt-2 text-muted-foreground">Select your role to personalize your experience.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {roles.map((role) => (
            <motion.button
              key={role.value}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(role.value)}
              className={`rounded-xl border p-6 text-left transition-all ${
                selected === role.value
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <role.icon className={`mb-3 h-6 w-6 ${selected === role.value ? "text-primary" : "text-muted-foreground"}`} />
              <h3 className="font-semibold text-foreground">{role.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
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
