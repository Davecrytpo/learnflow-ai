import { Link } from "react-router-dom";
import { GraduationCap, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Classroom</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A comprehensive, free learning management system designed for modern education and built to US educational standards.
            </p>
            <div className="mt-6 flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <ul className="mt-4 space-y-3">
              <li><Link to="/courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Course Catalog</Link></li>
              <li><a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a></li>
              <li><Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About Us</Link></li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Get Started</h4>
            <ul className="mt-4 space-y-3">
              <li><Link to="/signup" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Student Signup</Link></li>
              <li><Link to="/signup?role=instructor" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Instructor Registration</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sign In</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Classroom LMS. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Free for educational use worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
