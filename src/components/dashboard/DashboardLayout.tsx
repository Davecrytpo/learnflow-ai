import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { AppRole } from "@/hooks/useUserRole";
import { Loader2, LogOut, Moon, Sun, Bell, Search, Settings, User, BookOpen, Award, Shield } from "lucide-react";
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
          <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card/60 px-6 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="h-6 w-px bg-border hidden md:block" />
              <form onSubmit={handleSearch} className="relative hidden max-w-sm lg:max-w-md flex-1 md:flex">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search platform..." 
                  className="pl-10 h-10 bg-background/50 border-border focus:border-primary w-full transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            
            <Link to="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand shadow-lg shadow-primary/20">
                <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display text-base font-bold text-foreground hidden sm:block">Learnflow AI</span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent" 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 relative hover:bg-accent">
                      <Bell className="h-[1.1rem] w-[1.1rem] text-muted-foreground" />
                      <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[350px] sm:w-[400px]">
                    <SheetHeader className="pb-4 border-b border-border">
                      <SheetTitle className="text-xl font-bold">Notifications</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {[
                        { t: "New assignment", d: "Introduction to Calculus - Due Friday", time: "2h ago", icon: BookOpen },
                        { t: "Grade posted", d: "Quiz 4: You scored 92%", time: "5h ago", icon: Award },
                        { t: "Academy update", d: "Mastery badge earned", time: "1d ago", icon: Shield },
                      ].map((n, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all cursor-pointer group">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <n.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{n.t}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.d}</p>
                            <p className="text-[10px] font-medium text-primary mt-2 uppercase tracking-wider">{n.time}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/dashboard/notifications")}>View all notifications</Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={handleLogout}>
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

