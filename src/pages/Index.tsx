import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, Users, ArrowRight, Building2, 
  BookOpen, ShieldCheck, Globe, Award, 
  ChevronRight, Library, Microscope, Stethoscope, 
  Gavel, Code, Landmark, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const faculties = [
  { 
    title: "Faculty of Medicine", 
    icon: Stethoscope, 
    color: "text-rose-500", 
    bg: "bg-rose-50",
    depts: ["Neuroscience", "Cardiology", "Public Health", "Genetics"] 
  },
  { 
    title: "Faculty of Engineering & Computing", 
    icon: Code, 
    color: "text-blue-500", 
    bg: "bg-blue-50",
    depts: ["Artificial Intelligence", "Software Engineering", "Cybersecurity", "Robotics"] 
  },
  { 
    title: "Faculty of Law", 
    icon: Gavel, 
    color: "text-amber-600", 
    bg: "bg-amber-50",
    depts: ["International Law", "Corporate Governance", "Human Rights", "Constitutional Law"] 
  },
  { 
    title: "Faculty of Business & Economics", 
    icon: Landmark, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50",
    depts: ["Strategic Finance", "Global Markets", "MBA Programs", "Digital Economy"] 
  },
  { 
    title: "Faculty of Physical Sciences", 
    icon: Microscope, 
    color: "text-purple-600", 
    bg: "bg-purple-50",
    depts: ["Quantum Physics", "Astrophysics", "Chemical Engineering", "Mathematics"] 
  },
  { 
    title: "Faculty of Arts & Humanities", 
    icon: Library, 
    color: "text-indigo-600", 
    bg: "bg-indigo-50",
    depts: ["Digital Philosophy", "Global History", "Modern Literature", "Sociology"] 
  }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
      <Navbar />
      
      {/* 🏛️ Prestige Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,124,115,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-8 shadow-xl shadow-slate-900/20"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Institutional Excellence Since 1994</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-8 text-slate-950"
            >
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-emerald-600">Global Knowledge.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 mb-12 max-w-3xl leading-relaxed"
            >
              Global University Institute is a world-renowned academic hub where tradition 
              meets technological innovation. Join 12,000+ scholars in an environment 
              built for rigorous research and professional leadership.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-5"
            >
              <Button size="lg" className="h-14 px-10 rounded-2xl bg-primary text-white text-lg font-bold shadow-2xl shadow-primary/30 group hover:scale-[1.02] transition-all" onClick={() => navigate("/signup")}>
                Admission Portal <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-2 text-lg font-bold hover:bg-slate-50 transition-all" onClick={() => navigate("/login")}>
                Portal Login
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 📊 Academic Metrics */}
      <section className="py-12 bg-slate-950 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Faculty Members", val: "150+" },
              { label: "Research Citations", val: "45k" },
              { label: "Global Ranking", val: "#12" },
              { label: "Graduate Success", val: "98%" }
            ].map((m, i) => (
              <div key={i} className="text-center md:text-left space-y-1">
                <p className="text-3xl font-display font-bold text-primary">{m.val}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ The Faculties */}
      <section className="py-32 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Our Academic Divisions</h2>
            <p className="text-lg text-slate-600">
              Our 6 core faculties provide the foundation for specialized learning and cross-disciplinary research.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculties.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all group"
              >
                <div className={`h-14 w-14 rounded-2xl ${f.bg} flex items-center justify-center ${f.color} mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">{f.title}</h3>
                <div className="space-y-3 mb-8">
                  {f.depts.map(d => (
                    <div key={d} className="flex items-center gap-3 text-slate-500 text-sm">
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      {d}
                    </div>
                  ))}
                </div>
                <Button variant="link" className="p-0 h-auto text-primary font-bold text-base hover:no-underline group">
                  Learn More <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-all" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 Innovation & Research */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[48px] p-12 md:p-24 relative overflow-hidden text-white shadow-3xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">Leading the Global Research Agenda.</h2>
                <p className="text-xl text-white/80 mb-10 leading-relaxed">
                  From deep-sea exploration to the ethics of artificial intelligence, our researchers 
                  are tackling the most complex challenges of the 21st century.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <Globe className="h-6 w-6 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider">Global Reach</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <Microscope className="h-6 w-6 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider">High Impact</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8">
                <h4 className="text-2xl font-bold mb-6 italic">"The institute provides an unparalleled ecosystem for breakthrough innovation."</h4>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-200" />
                  <div>
                    <p className="font-bold">Prof. Alexander Voss</p>
                    <p className="text-xs text-white/60 uppercase tracking-widest">Dept. of Quantum Systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
