import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Stethoscope, Code, Gavel, Landmark, Microscope, Library, 
  Palette, Brain, ChevronRight, Users, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

const faculties = [
  { 
    title: "School of Engineering", 
    icon: Code, 
    color: "text-blue-600", 
    bg: "bg-blue-50 dark:bg-blue-950/30",
    programs: 31,
    desc: "Innovative programs in AI, Software Engineering, and Robotics.",
    category: "Engineering"
  },
  { 
    title: "Business & Management", 
    icon: Landmark, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    programs: 22,
    desc: "Leadership and finance training for the next generation of CEOs.",
    category: "Business"
  },
  { 
    title: "Medicine & Health", 
    icon: Stethoscope, 
    color: "text-rose-600", 
    bg: "bg-rose-50 dark:bg-rose-950/30",
    programs: 24,
    desc: "Advanced medical training and cutting-edge health research.",
    category: "Medicine"
  },
  { 
    title: "Arts & Humanities", 
    icon: Library, 
    color: "text-indigo-600", 
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    programs: 28,
    desc: "Exploring global history, culture, and creative expression.",
    category: "Arts & Humanities"
  }
];

const AcademicPrograms = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Academic Excellence</p>
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl mb-6">
            Our Faculties & Programs
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Explore our world-class faculties offering over 175 programs across all academic levels.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {faculties.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 cursor-pointer"
              onClick={() => navigate(`/academics/catalog?category=${encodeURIComponent(f.category)}`)}
            >
              <div className={`h-16 w-16 rounded-2xl ${f.bg} flex items-center justify-center ${f.color} mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
                <f.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {f.desc}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <BookOpen className="h-4 w-4" />
                  {f.programs} Programs
                </div>
                <Button variant="ghost" className="text-primary font-bold group/btn p-0 h-auto hover:bg-transparent">
                  View Program <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="h-14 px-10 rounded-full font-bold shadow-xl hover:scale-105 transition-transform" asChild>
            <Link to="/academics/catalog">Explore All Faculties</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AcademicPrograms;
