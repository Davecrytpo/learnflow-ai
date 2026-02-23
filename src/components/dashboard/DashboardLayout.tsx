import { ReactNode, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { AppRole } from "@/hooks/useUserRole";
import { Loader2, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
  sidebar: ReactNode;
}

const DashboardLayout = ({ children, allowedRoles, sidebar }: DashboardLayoutProps) => {
  const { user, role, loading } = useAuthContext();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/login", { replace: true }); return; }
    if (!role) { navigate("/onboarding", { replace: true }); return; }
    if (allowedRoles && !allowedRoles.includes(role)) navigate("/dashboard", { replace: true });
  }, [user, role, loading, navigate, allowedRoles]);

  if (loading) {
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
      <div className="relative flex min-h-screen w-full bg-background">
        <div className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.02]" />
        {sidebar}
        <div className="flex flex-1 flex-col">
          <a
            href="#dashboard-main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-md bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-lg"
          >
            Skip to content
          </a>
          <header className="flex h-14 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur-sm">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex-1" />
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
                <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display text-sm font-bold text-foreground">Learnflow AI</span>
            </Link>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:block">{user?.email}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground" 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main id="dashboard-main" className="flex-1 overflow-auto p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
