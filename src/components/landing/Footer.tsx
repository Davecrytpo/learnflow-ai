import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => (
  <footer className="relative border-t border-border bg-background">
    <div className="container mx-auto px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-md shadow-primary/20">
              <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">Learnflow AI</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The enterprise-grade LMS built for modern education. Free for every student, every instructor, every institution.
          </p>
          <div className="mt-6 flex gap-3">
            {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">Platform</p>
          <ul className="mt-4 space-y-3">
            {[["Course Catalog", "/courses"], ["Student Portal", "/student"], ["Instructor Portal", "/instructor-portal"], ["About", "/about"]].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">Get Started</p>
          <ul className="mt-4 space-y-3">
            {[["Student Signup", "/signup?role=student"], ["Instructor Registration", "/signup?role=instructor"], ["Admin Portal", "/admin-portal"], ["Sign In", "/login"]].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">Legal</p>
          <ul className="mt-4 space-y-3">
            {["Privacy Policy", "Terms of Service", "Accessibility Statement", "FERPA Compliance"].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">Copyright {new Date().getFullYear()} Learnflow AI LMS. All rights reserved.</p>
        <p className="text-sm text-muted-foreground">Free for educational use worldwide - Built with care for educators.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
