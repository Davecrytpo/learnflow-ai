import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) { navigate("/login", { replace: true }); return; }

    // Only redirect to onboarding if loading is fully complete and still no role
    if (!role) { navigate("/onboarding", { replace: true }); return; }

    // Redirect to role-specific dashboard
    if (role === "student") navigate("/dashboard/student", { replace: true });
    else if (role === "instructor") navigate("/instructor", { replace: true });
    else if (role === "admin") navigate("/admin", { replace: true });
    else navigate("/onboarding", { replace: true });
  }, [user, role, authLoading, roleLoading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Dashboard;
