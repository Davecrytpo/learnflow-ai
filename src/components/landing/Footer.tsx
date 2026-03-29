import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="relative border-t border-border bg-foreground text-background">
    <div className="container mx-auto px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-6">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md">
              <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-background">Global University Institute</span>
              <span className="block text-[9px] uppercase tracking-[0.15em] text-background/50">Est. 1994</span>
            </div>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-background/50">
            A world-renowned academic institution dedicated to research excellence,
            innovative teaching, and preparing leaders for a changing world.
          </p>
          <div className="mt-6 space-y-2 text-sm text-background/50">
            <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> 1 University Drive, Cambridge, MA 02138</p>
            <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +1 (800) 555-0199</p>
            <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> admissions@gui.edu</p>
          </div>
          <div className="mt-6 flex gap-3">
            {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-background/10 text-background/40 transition-all hover:border-primary/40 hover:text-primary"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Academics */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-background/70">Academics</p>
          <ul className="mt-4 space-y-3">
            {[
              ["Undergraduate", "/academics/undergraduate"],
              ["Graduate", "/academics/graduate"],
              ["Doctoral", "/academics/doctoral"],
              ["Online Programs", "/academics/online"],
              ["Course Catalog", "/academics/catalog"],
              ["Academic Calendar", "/academics/calendar"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-sm text-background/40 transition-colors hover:text-background">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Research */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-background/70">Research</p>
          <ul className="mt-4 space-y-3">
            {[
              ["Research Centers", "/research/centers"],
              ["Publications", "/research/publications"],
              ["Labs & Facilities", "/research/labs"],
              ["Grants & Funding", "/research/grants"],
              ["Library Services", "/about"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-sm text-background/40 transition-colors hover:text-background">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Campus */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-background/70">Campus</p>
          <ul className="mt-4 space-y-3">
            {[
              ["Student Life", "/campus/student-life"],
              ["Housing", "/campus/housing"],
              ["Athletics", "/campus/athletics"],
              ["Health Services", "/campus/health"],
              ["Safety & Security", "/about"],
              ["Discover Campus", "/campus/discover"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-sm text-background/40 transition-colors hover:text-background">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-background/70">Quick Links</p>
          <ul className="mt-4 space-y-3">
            {[
              ["Apply Now", "/signup"],
              ["Student Portal", "/login"],
              ["Contact Us", "/contact"],
              ["About the Institute", "/about"],
              ["Giving to GUI", "/giving"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-sm text-background/40 transition-colors hover:text-background">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 sm:flex-row">
        <p className="text-xs text-background/30">
          © {new Date().getFullYear()} Global University Institute. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-6 text-xs text-background/30">
          <a href="#" className="hover:text-background/60 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-background/60 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-background/60 transition-colors">Accessibility</a>
          <a href="#" className="hover:text-background/60 transition-colors">FERPA</a>
          <a href="#" className="hover:text-background/60 transition-colors">Title IX</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
