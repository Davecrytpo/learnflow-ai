import { ReactNode, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, AppRole } from "@/hooks/useUserRole";
import { Loader2, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
  sidebar: ReactNode;
}

const DashboardLayout = ({ children, allowedRoles, sidebar }: DashboardLayoutProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) { navigate("/login"); return; }
    if (!role) { navigate("/onboarding"); return; }
    if (allowedRoles && !allowedRoles.includes(role)) navigate("/dashboard");
  }, [user, role, authLoading, roleLoading, navigate, allowedRoles]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand">
            <svg className="h-6 w-6 text-primary-foreground" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {sidebar}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="flex h-14 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur-sm">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex-1" />
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
                <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display text-sm font-bold text-foreground">MERIDIAN</span>
            </Link>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:block">{user?.email}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
