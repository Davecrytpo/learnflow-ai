import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, role, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard redirect logic - Loading:", loading, "User:", user?.id, "Role:", role);
    if (loading) return;
    
    if (!user) { 
      console.log("No user found, redirecting to login");
      navigate("/login", { replace: true }); 
      return; 
    }
    
    if (!role) { 
      console.log("No role found, redirecting to onboarding");
      navigate("/onboarding", { replace: true }); 
      return; 
    }

    console.log("Redirecting based on role:", role);
    if (role === "student") navigate("/dashboard/student", { replace: true });
    else if (role === "instructor") navigate("/instructor", { replace: true });
    else if (role === "admin") navigate("/admin/dashboard", { replace: true });
    else {
      console.warn("Unknown role, defaulting to onboarding:", role);
      navigate("/onboarding", { replace: true });
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Dashboard;
