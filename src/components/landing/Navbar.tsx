import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Classroom</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/courses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Courses</Link>
          <Link to="/features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/courses" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Courses</Link>
            <Link to="/features" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Features</Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>About</Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" asChild><Link to="/login">Log in</Link></Button>
              <Button asChild><Link to="/signup">Get Started Free</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
