import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Classroom</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A comprehensive, free learning management system designed for modern education. 
              Built to US educational standards for K-12 and higher education.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Course Catalog</Link></li>
              <li><a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Get Started</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Student Signup</Link></li>
              <li><Link to="/signup?role=instructor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Instructor Registration</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Classroom LMS. All rights reserved. Free for educational use.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
