import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, BookOpen, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

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
      const { data } = await supabase
        .from("courses")
        .select("id, title, category, slug")
        .ilike("title", `%${searchQuery}%`)
        .limit(5);
      
      setSuggestions(data || []);
      setIsSearching(false);
      setShowSuggestions(true);
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/60" : "bg-transparent"}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-md bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-lg"
      >
        Skip to content
      </a>
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-brand opacity-90" />
              <div className="absolute inset-0 rounded-lg bg-gradient-brand opacity-0 blur-md transition-opacity group-hover:opacity-60" />
              <svg className="relative h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground hidden sm:block">Learnflow AI</span>
          </Link>

          {/* Functional Search Bar */}
          <div className="relative hidden lg:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-64 xl:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses, paths..."
                className="h-10 pl-10 bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all"
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
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          navigate(`/course/${s.id}`);
                          setShowSuggestions(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate text-foreground">{s.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{s.category}</p>
                        </div>
                      </button>
                    ))}
                    {suggestions.length === 0 && !isSearching && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No matches found.
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSearchSubmit}
                    className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10"
                  >
                    <span>View all results</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/student" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Student</Link>
          <Link to="/instructor-portal" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Instructor</Link>
          <Link to="/academy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Academy</Link>
          <Link to="/news" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">News</Link>
          <div className="h-4 w-px bg-border" />
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button className="bg-gradient-brand font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90" asChild>
            <Link to="/signup">Start Free</Link>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background/95 backdrop-blur-xl px-4 pb-6 pt-4 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/student" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Student</Link>
              <Link to="/instructor-portal" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Instructor</Link>
              <Link to="/academy" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Academy</Link>
              <Link to="/news" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>News</Link>
              <Link to="/webinars" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Webinars</Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Button variant="outline" asChild><Link to="/login">Sign in</Link></Button>
                <Button className="bg-gradient-brand text-primary-foreground" asChild><Link to="/signup">Start Free</Link></Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
