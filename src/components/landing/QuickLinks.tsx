import { Link } from "react-router-dom";
import { BookOpen, Microscope, MapPin, Calendar, Users } from "lucide-react";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";

const links = [
  { label: "How to Apply", href: "/admissions/apply", icon: GraduationCapIcon, desc: "Admissions & Requirements" },

  { label: "Programs", href: "/academics/catalog", icon: BookOpen, desc: "Undergraduate & Graduate" },
  { label: "Research", href: "/research/centers", icon: Microscope, desc: "Labs & Publications" },
  { label: "Campus Visit", href: "/admissions/visit", icon: MapPin, desc: "Tours & Open Days" },
  { label: "Events", href: "/campus/events", icon: Calendar, desc: "Upcoming Activities" },
  { label: "Student Life", href: "/campus/student-life", icon: Users, desc: "Clubs & Organizations" },
];

const QuickLinks = () => (
  <section className="relative z-10 -mt-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-2xl bg-card shadow-2xl shadow-foreground/5 md:grid-cols-3 lg:grid-cols-6">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="group flex flex-col items-center gap-2 border-r border-b border-border/50 px-4 py-6 text-center transition-all hover:bg-primary hover:text-primary-foreground last:border-r-0"
          >
            <link.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
            <span className="text-sm font-bold text-foreground group-hover:text-primary-foreground transition-colors">{link.label}</span>
            <span className="text-[10px] text-muted-foreground group-hover:text-primary-foreground/70 transition-colors">{link.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default QuickLinks;
