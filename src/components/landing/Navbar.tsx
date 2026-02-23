import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/60" : "bg-transparent"}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-md bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-lg"
      >
        Skip to content
      </a>
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-brand opacity-90" />
            <div className="absolute inset-0 rounded-lg bg-gradient-brand opacity-0 blur-md transition-opacity group-hover:opacity-60" />
            <svg className="relative h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">Learnflow AI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/student" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Student</Link>
          <Link to="/instructor-portal" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Instructor</Link>
          <Link to="/courses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Courses</Link>
          <a href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
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
              <Link to="/student" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Student</Link>
              <Link to="/instructor-portal" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Instructor</Link>
              <Link to="/courses" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Courses</Link>
              <a href="/#features" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Features</a>
              <Link to="/about" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>About</Link>
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
