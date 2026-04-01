import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { AppRole } from "@/hooks/useUserRole";
import { Loader2, LogOut, Moon, Sun, Bell, Search, Settings, BookOpen, Shield, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
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
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/login", { replace: true }); return; }
    if (!role) { navigate("/onboarding", { replace: true }); return; }
    if (allowedRoles && !allowedRoles.includes(role)) navigate("/dashboard", { replace: true });
  }, [user, role, loading, navigate, allowedRoles]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await apiClient.db
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)
          .execute();

        setNotifications(response.data || []);
      } catch {
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [user]);

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

  const handleLogout = () => {
    apiClient.auth.logout();
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
          <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-card/60 px-3 backdrop-blur-sm sm:px-4 md:px-6">
            <div className="flex items-center gap-2 md:gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="h-6 w-px bg-border hidden md:block" />
              
              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="relative hidden max-w-sm lg:max-w-md flex-1 md:flex">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search platform..." 
                  className="pl-10 h-10 bg-background/50 border-border focus:border-primary w-full transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Mobile Search Trigger */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="pt-12">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search platform..." 
                      className="pl-10 h-12 bg-background border-border focus:border-primary w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </form>
                </SheetContent>
              </Sheet>
            </div>
            
            <Link to="/" className="hidden items-center gap-2 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand shadow-lg shadow-primary/20 shrink-0">
                <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display text-base font-bold text-foreground hidden lg:block truncate max-w-[120px] xl:max-w-none">Global University Institute</span>
              <span className="font-display text-base font-bold text-foreground lg:hidden">GUI</span>
            </Link>
            
            <div className="flex items-center gap-1 sm:gap-3">
              <Link to="/" className="flex items-center gap-2 md:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand shadow-lg shadow-primary/20 shrink-0">
                  <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-display text-sm font-bold text-foreground">GUI</span>
              </Link>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-muted-foreground hover:text-foreground hidden xs:flex" 
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
                <SheetContent className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="pb-4 border-b border-border">
                    <SheetTitle className="text-xl font-bold text-left">Notifications</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {notifications.length === 0 ? (
                      <div className="rounded-xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">
                        No notifications yet.
                      </div>
                    ) : notifications.map((n, i) => {
                      const icon = i % 3 === 0 ? Shield : i % 3 === 1 ? BookOpen : CalendarClock;
                      return (
                      <div key={n.id || i} className="flex gap-3 p-3 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all cursor-pointer group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {icon === Shield ? <Shield className="h-5 w-5" /> : icon === BookOpen ? <BookOpen className="h-5 w-5" /> : <CalendarClock className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{n.title || "Notification"}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message || "Platform update"}</p>
                          <p className="text-[10px] font-medium text-primary mt-2 uppercase tracking-wider">
                            {n.created_at ? new Date(n.created_at).toLocaleString() : "Recent"}
                          </p>
                        </div>
                      </div>
                    )})}
                    <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/dashboard/notifications")}>View all notifications</Button>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="h-8 w-px bg-border mx-1 hidden xs:block" />

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

