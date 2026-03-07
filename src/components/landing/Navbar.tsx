import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  {
    label: "Academics",
    children: [
      { label: "Undergraduate Programs", href: "/courses" },
      { label: "Graduate Programs", href: "/courses" },
      { label: "Doctoral Programs", href: "/courses" },
      { label: "Online Learning", href: "/courses" },
      { label: "Course Catalog", href: "/courses" },
    ],
  },
  {
    label: "Research",
    children: [
      { label: "Research Centers", href: "/about" },
      { label: "Publications", href: "/about" },
      { label: "Labs & Facilities", href: "/about" },
      { label: "Grants & Funding", href: "/about" },
    ],
  },
  {
    label: "Admissions",
    children: [
      { label: "How to Apply", href: "/signup" },
      { label: "Tuition & Aid", href: "/about" },
      { label: "Visit Campus", href: "/about" },
      { label: "Contact Admissions", href: "/about" },
    ],
  },
  { label: "Campus Life", href: "/about" },
  { label: "News & Events", href: "/news" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? "bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm" 
        : "bg-transparent"
    }`}>
      {/* Top utility bar */}
      <div className={`hidden lg:block transition-all duration-300 ${scrolled ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"}`}>
        <div className="container mx-auto flex items-center justify-between px-6 py-2 text-[11px]">
          <div className="flex items-center gap-6">
            <span className={`${scrolled ? "text-muted-foreground" : "text-white/60"}`}>Students</span>
            <span className={`${scrolled ? "text-muted-foreground" : "text-white/60"}`}>Faculty & Staff</span>
            <span className={`${scrolled ? "text-muted-foreground" : "text-white/60"}`}>Alumni</span>
            <span className={`${scrolled ? "text-muted-foreground" : "text-white/60"}`}>Parents</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/news" className={`${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/60 hover:text-white"} transition-colors`}>Events</Link>
            <Link to="/about" className={`${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/60 hover:text-white"} transition-colors`}>Careers</Link>
            <Link to="/about" className={`${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/60 hover:text-white"} transition-colors`}>Give</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container mx-auto flex h-16 items-center justify-between px-6 lg:h-[72px]">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-primary" />
            <svg className="relative h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className={`font-display text-lg font-bold tracking-tight ${scrolled ? "text-foreground" : "text-white"}`}>
              Global University
            </span>
            <span className={`block text-[9px] uppercase tracking-[0.15em] ${scrolled ? "text-muted-foreground" : "text-white/60"}`}>
              Institute
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && handleMouseEnter(link.label)}
              onMouseLeave={handleMouseLeave}
            >
              {link.children ? (
                <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
                  scrolled ? "text-foreground/80 hover:text-foreground" : "text-white/80 hover:text-white"
                }`}>
                  {link.label}
                  <ChevronDown className="h-3 w-3" />
                </button>
              ) : (
                <Link
                  to={link.href!}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    scrolled ? "text-foreground/80 hover:text-foreground" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )}

              <AnimatePresence>
                {link.children && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-border bg-card p-2 shadow-xl"
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block rounded-lg px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            scrolled ? "text-foreground hover:bg-secondary" : "text-white hover:bg-white/10"
          }`}>
            <Search className="h-5 w-5" />
          </button>
          <Button
            variant="ghost"
            className={`text-sm ${scrolled ? "text-foreground" : "text-white hover:bg-white/10 hover:text-white"}`}
            onClick={() => navigate("/login")}
          >
            Portal Login
          </Button>
          <Button
            className="bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90"
            onClick={() => navigate("/signup")}
          >
            Apply Now
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden ${scrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background/98 backdrop-blur-xl px-6 pb-8 pt-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <p className="px-2 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{link.label}</p>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block rounded-lg px-4 py-2 text-sm text-foreground hover:bg-secondary"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={link.href!}
                      className="block rounded-lg px-2 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-border">
                <Button variant="outline" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Portal Login</Button>
                <Button className="bg-primary text-primary-foreground" onClick={() => { navigate("/signup"); setMobileOpen(false); }}>Apply Now</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
