import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, role, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/login", { replace: true }); return; }
    if (!role) { navigate("/onboarding", { replace: true }); return; }
    if (role === "student") navigate("/dashboard/student", { replace: true });
    else if (role === "instructor") navigate("/instructor", { replace: true });
    else if (role === "admin") navigate("/admin", { replace: true });
    else navigate("/onboarding", { replace: true });
  }, [user, role, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Dashboard;
