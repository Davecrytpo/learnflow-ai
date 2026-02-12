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
    if (!user) {
      navigate("/login");
      return;
    }
    if (!role) {
      navigate("/onboarding");
      return;
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Welcome to your Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          You're signed in as <span className="font-semibold capitalize text-primary">{role}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
      </div>
    </div>
  );
};

export default Dashboard;
