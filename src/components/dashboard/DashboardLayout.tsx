import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { AppRole } from "@/hooks/useUserRole";
import { Loader2, LogOut, Moon, Sun, Bell, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
  sidebar: ReactNode;
}

const DashboardLayout = ({ children, allowedRoles, sidebar }: DashboardLayoutProps) => {
  const { user, role, loading } = useAuthContext();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({ title: "Searching...", description: `Searching for "${searchQuery}" across your courses.` });
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
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
          <header className="flex h-16 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur-sm sticky top-0 z-40">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            
            <form onSubmit={handleSearch} className="relative hidden max-w-md flex-1 md:flex">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search courses, lessons, people..." 
                className="pl-10 h-10 bg-background/50 border-border focus:border-primary w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="flex-1 md:hidden" />
            
            <Link to="/" className="flex items-center gap-2 md:absolute md:left-1/2 md:-translate-x-1/2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
                <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display text-sm font-bold text-foreground">Learnflow AI</span>
            </Link>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                    <Bell className="h-[1.1rem] w-[1.1rem] text-muted-foreground" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader><SheetTitle>Notifications</SheetTitle></SheetHeader>
                  <div className="mt-6 space-y-4">
                    {[
                      { t: "New assignment", d: "Introduction to Calculus - Due Friday", time: "2h ago" },
                      { t: "Grade posted", d: "Quiz 4: You scored 92%", time: "5h ago" },
                      { t: "Academy update", d: "Mastery badge earned", time: "1d ago" },
                    ].map((n, i) => (
                      <div key={i} className="p-3 rounded-lg border border-border bg-card/50 hover:bg-accent/5 transition-colors cursor-pointer">
                        <p className="text-sm font-semibold">{n.t}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.d}</p>
                        <p className="text-[10px] text-primary mt-2">{n.time}</p>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full text-xs" onClick={() => navigate("/dashboard/notifications")}>View all notifications</Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-muted-foreground hover:text-foreground hidden sm:flex" 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main id="dashboard-main" className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

