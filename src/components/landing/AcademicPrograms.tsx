import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Stethoscope, Code, Gavel, Landmark, Microscope, Library, 
  Palette, Brain, ChevronRight 
} from "lucide-react";

const faculties = [
  { 
    title: "Medicine & Health Sciences", 
    icon: Stethoscope, 
    color: "text-rose-600", 
    bg: "bg-rose-50 dark:bg-rose-950/30",
    programs: 24,
    students: "2,400+",
    depts: ["Neuroscience", "Cardiology", "Public Health", "Genetics", "Pharmacology"] 
  },
  { 
    title: "Engineering & Computing", 
    icon: Code, 
    color: "text-blue-600", 
    bg: "bg-blue-50 dark:bg-blue-950/30",
    programs: 31,
    students: "3,100+",
    depts: ["Artificial Intelligence", "Software Engineering", "Cybersecurity", "Robotics", "Data Science"] 
  },
  { 
    title: "Law & Governance", 
    icon: Gavel, 
    color: "text-amber-600", 
    bg: "bg-amber-50 dark:bg-amber-950/30",
    programs: 16,
    students: "1,800+",
    depts: ["International Law", "Corporate Governance", "Human Rights", "Constitutional Law"] 
  },
  { 
    title: "Business & Economics", 
    icon: Landmark, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    programs: 22,
    students: "2,600+",
    depts: ["Strategic Finance", "Global Markets", "MBA Programs", "Digital Economy", "Entrepreneurship"] 
  },
  { 
    title: "Physical Sciences", 
    icon: Microscope, 
    color: "text-purple-600", 
    bg: "bg-purple-50 dark:bg-purple-950/30",
    programs: 19,
    students: "1,500+",
    depts: ["Quantum Physics", "Astrophysics", "Chemical Engineering", "Mathematics"] 
  },
  { 
    title: "Arts & Humanities", 
    icon: Library, 
    color: "text-indigo-600", 
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    programs: 28,
    students: "2,200+",
    depts: ["Philosophy", "Global History", "Modern Literature", "Sociology", "Cultural Studies"] 
  },
  { 
    title: "Creative Arts & Design", 
    icon: Palette, 
    color: "text-pink-600", 
    bg: "bg-pink-50 dark:bg-pink-950/30",
    programs: 15,
    students: "1,100+",
    depts: ["Architecture", "Visual Arts", "Music", "Film Studies", "Digital Media"] 
  },
  { 
    title: "Psychology & Education", 
    icon: Brain, 
    color: "text-teal-600", 
    bg: "bg-teal-50 dark:bg-teal-950/30",
    programs: 20,
    students: "1,900+",
    depts: ["Clinical Psychology", "Educational Leadership", "Cognitive Science", "Counseling"] 
  },
];

const AcademicPrograms = () => (
  <section className="py-28 bg-secondary/30">
    <div className="container mx-auto px-6">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Academic Excellence</p>
        <h2 className="text-4xl font-bold text-foreground md:text-5xl mb-6">
          Our Faculties & Programs
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          8 world-class faculties offering over 175 programs across undergraduate, graduate,
          and doctoral levels, supported by cutting-edge research facilities.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {faculties.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group rounded-2xl bg-card border border-border p-6 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className={`h-12 w-12 rounded-xl ${f.bg} flex items-center justify-center ${f.color} mb-5 group-hover:scale-110 transition-transform`}>
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <div className="flex gap-4 mb-4">
              <span className="text-xs text-muted-foreground"><strong className="text-foreground">{f.programs}</strong> Programs</span>
              <span className="text-xs text-muted-foreground"><strong className="text-foreground">{f.students}</strong> Students</span>
            </div>
            <div className="space-y-1.5 mb-5">
              {f.depts.slice(0, 4).map(d => (
                <div key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-1 w-1 rounded-full bg-primary/50" />
                  {d}
                </div>
              ))}
            </div>
            <Link
              to="/academics/undergraduate"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline group"
            >
              Explore Faculty <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AcademicPrograms;
