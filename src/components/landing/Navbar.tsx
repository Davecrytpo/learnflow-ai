import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, BookOpen, GraduationCap, ArrowRight, Loader2, ChevronDown, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const academics = [
  { title: "Undergraduate", href: "/academics/undergraduate", description: "Bachelor's degree programs for aspiring leaders." },
  { title: "Graduate", href: "/academics/graduate", description: "Advanced degrees to specialize in your field." },
  { title: "Doctoral", href: "/academics/doctoral", description: "Research-focused programs for future scholars." },
  { title: "Online Learning", href: "/academics/online", description: "Flexible education from anywhere in the world." },
  { title: "Course Catalog", href: "/academics/catalog", description: "Browse our comprehensive list of courses." },
  { title: "Academic Calendar", href: "/academics/calendar", description: "Important dates and deadlines." },
];

const research = [
  { title: "Research Centers", href: "/research/centers", description: "Hubs of innovation and discovery." },
  { title: "Publications", href: "/research/publications", description: "Latest findings from our faculty and students." },
  { title: "Lab Facilities", href: "/research/labs", description: "State-of-the-art equipment for breakthrough research." },
  { title: "Grants & Funding", href: "/research/grants", description: "Support for your research initiatives." },
];

const admissions = [
  { title: "How to Apply", href: "/admissions/apply", description: "Step-by-step guide to joining our community." },
  { title: "Tuition & Aid", href: "/admissions/tuition", description: "Financial information and scholarship opportunities." },
  { title: "Visit Campus", href: "/admissions/visit", description: "Schedule a tour and see our facilities." },
  { title: "Contact Admissions", href: "/admissions/contact", description: "Get in touch with our admissions team." },
];

const campus = [
  { title: "News & Events", href: "/campus/news", description: "Stay updated with campus happenings." },
  { title: "Student Life", href: "/campus/student-life", description: "Clubs, organizations, and community activities." },
  { title: "Housing", href: "/campus/housing", description: "Residence halls and living accommodations." },
  { title: "Athletics", href: "/campus/athletics", description: "Varsity sports and intramural leagues." },
  { title: "Health Services", href: "/campus/health", description: "Wellness and medical support for students." },
  { title: "Discover Campus", href: "/campus/discover", description: "Explore our beautiful grounds and facilities." },
];

const staticPages = [
  ...academics,
  ...research,
  ...admissions,
  ...campus,
  { title: "Faculty Recruitment", href: "/instructor/register", description: "Join our teaching staff" },
  { title: "Giving", href: "/giving", description: "Support the university" },
  { title: "Contact Us", href: "/contact", description: "Get in touch" },
  { title: "Login", href: "/login", description: "Access your portal" },
  { title: "Apply Now", href: "/signup", description: "Start your student application" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      
      // 1. Search Static Pages
      const pageResults = staticPages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(p => ({ ...p, type: 'page' })).slice(0, 3);

      try {
        // 2. Search Courses via MongoDB API
        const { data } = await api.get("/courses", {
          params: { search: searchQuery }
        });
        
        const courseResults = (data || []).map((c: any) => ({ ...c, type: 'course' })).slice(0, 3);
        setSuggestions([...pageResults, ...courseResults]);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Navbar Search Error:", err);
        setSuggestions(pageResults);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/academics/catalog?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm" : "bg-transparent"}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-md bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-lg"
      >
        Skip to content
      </a>

      {/* Top utility bar - Harvard/Stanford Standard */}
      <div className={`hidden lg:block transition-all duration-300 overflow-hidden ${scrolled ? "h-0 opacity-0" : "h-10 opacity-100 border-b border-white/10"}`}>
        <div className="container mx-auto flex h-full items-center justify-between px-6 text-[11px] font-semibold tracking-wide">
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-white/60 hover:text-white transition-colors cursor-pointer">Student Portal</Link>
            <Link to="/instructor/login" className="text-white/60 hover:text-white transition-colors cursor-pointer">Faculty Portal</Link>
            <span className="text-white/60 hover:text-white transition-colors cursor-pointer">Alumni</span>
            <span className="text-white/60 hover:text-white transition-colors cursor-pointer">Parents</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/campus/events" className="text-white/60 hover:text-white transition-colors">Events</Link>
            <Link to="/instructor/register" className="text-white/60 hover:text-white transition-colors font-bold text-primary-foreground/90">Teach at GUI</Link>
            <Link to="/giving" className="text-white/60 hover:text-white transition-colors">Give</Link>
            <Link to="/contact" className="text-white/60 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      <nav className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-brand opacity-90" />
              <div className="absolute inset-0 rounded-lg bg-gradient-brand opacity-0 blur-md transition-opacity group-hover:opacity-60" />
              <svg className="relative h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className={`font-display text-lg font-bold tracking-tight block leading-tight ${scrolled ? "text-foreground" : "text-white"}`}>Global University</span>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold block ${scrolled ? "text-muted-foreground" : "text-white/60"}`}>Institute</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground xl:hidden block sm:hidden">GUI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn("bg-transparent hover:bg-white/10", scrolled ? "text-foreground" : "text-white")}>Academics</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover">
                      {academics.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-bold leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn("bg-transparent hover:bg-white/10", scrolled ? "text-foreground" : "text-white")}>Research</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-popover">
                      {research.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-bold leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn("bg-transparent hover:bg-white/10", scrolled ? "text-foreground" : "text-white")}>Admissions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-popover">
                      {admissions.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-bold leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn("bg-transparent hover:bg-white/10", scrolled ? "text-foreground" : "text-white")}>Campus Life</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover">
                      {campus.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-bold leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Functional Search Bar */}
          <div className="relative hidden xl:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-64">
              <Search className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", scrolled ? "text-muted-foreground" : "text-white/60")} />
              <Input
                type="text"
                placeholder="Search..."
                className={cn(
                  "h-10 pl-10 border-transparent transition-all rounded-full",
                  scrolled ? "bg-secondary focus:bg-background focus:border-primary" : "bg-white/10 text-white placeholder:text-white/60 focus:bg-white/20"
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                </div>
              )}
            </form>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 rounded-xl border border-border bg-background shadow-2xl overflow-hidden"
                >
                  <div className="p-2 border-b border-border bg-secondary/20">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Suggestions</p>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {suggestions.map((s, i) => (
                      <button
                        key={`${s.type}-${s._id || s.title}-${i}`}
                        onClick={() => {
                          navigate(s.type === 'course' ? `/course/${s._id}` : s.href);
                          setShowSuggestions(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition-colors border-b border-border/40 last:border-0"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {s.type === 'course' ? <BookOpen className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold truncate text-foreground">{s.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">
                            {s.type === 'course' ? (s.category || "Course") : "Page"}
                          </p>
                        </div>
                      </button>
                    ))}
                    {suggestions.length === 0 && !isSearching && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No matches found.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Button 
              variant="ghost" 
              className={cn("text-sm font-semibold", scrolled ? "text-foreground" : "text-white hover:bg-white/10 hover:text-white")}
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
            <Button 
              className="bg-gradient-brand font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
              onClick={() => navigate("/signup")}
            >
              Apply Now
            </Button>
          </div>

          <button className={cn("lg:hidden", scrolled ? "text-foreground" : "text-white")} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background/95 backdrop-blur-xl px-4 pb-10 pt-6 lg:hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search GUI..."
                  className="pl-10 h-12 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       navigate(`/academics/catalog?search=${encodeURIComponent(searchQuery)}`);
                       setMobileOpen(false);
                    }
                  }}
                />
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Academics</h4>
                  <div className="grid gap-2 pl-2 border-l-2 border-primary/10 ml-2">
                    {academics.map(item => (
                       <Link key={item.title} to={item.href} className="text-base font-bold text-foreground py-2" onClick={() => setMobileOpen(false)}>{item.title}</Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Research</h4>
                  <div className="grid gap-2 pl-2 border-l-2 border-primary/10 ml-2">
                    {research.map(item => (
                       <Link key={item.title} to={item.href} className="text-base font-bold text-foreground py-2" onClick={() => setMobileOpen(false)}>{item.title}</Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Admissions</h4>
                  <div className="grid gap-2 pl-2 border-l-2 border-primary/10 ml-2">
                    {admissions.map(item => (
                       <Link key={item.title} to={item.href} className="text-base font-bold text-foreground py-2" onClick={() => setMobileOpen(false)}>{item.title}</Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Campus Life</h4>
                  <div className="grid gap-2 pl-2 border-l-2 border-primary/10 ml-2">
                    {campus.map(item => (
                       <Link key={item.title} to={item.href} className="text-base font-bold text-foreground py-2" onClick={() => setMobileOpen(false)}>{item.title}</Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-border mt-4">
                <Button variant="outline" className="h-12 rounded-xl font-bold" onClick={() => navigate("/login")}>Portal Login</Button>
                <Button className="bg-gradient-brand text-primary-foreground h-12 rounded-xl font-bold" onClick={() => navigate("/signup")}>Apply Now</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
