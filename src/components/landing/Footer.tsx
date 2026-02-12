import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Classroom</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The modern platform for creating and selling online courses.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
              <li><Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground">Course Catalog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Classroom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
