import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Users, 
  ArrowRight, 
  Building2, 
  BookOpen, 
  ShieldCheck,
  Globe,
  Award,
  ChevronRight,
  Library
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6"
            >
              <Globe className="h-3 w-3" />
              <span>World-Class Academic Excellence</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.1] mb-6"
            >
              Global University <br />
              <span className="text-primary">Institute</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            >
              Empowering the next generation of leaders through rigorous academic programs, 
              innovative research, and a global network of scholars.
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-12 px-8 rounded-full shadow-lg shadow-primary/20" onClick={() => navigate("/login")}>
                Student Portal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full" onClick={() => navigate("/login")}>
                Staff Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">About the University</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Established with a vision to democratize elite education, Global University Institute 
                stands at the intersection of tradition and technology. Our institutional mission 
                is to provide a scalable, high-integrity learning environment for students worldwide.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">150+</p>
                  <p className="text-sm text-muted-foreground font-medium">Expert Faculty</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">12k+</p>
                  <p className="text-sm text-muted-foreground font-medium">Global Students</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background p-6 rounded-2xl border border-border shadow-sm">
                <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                <h4 className="font-bold mb-2">Accredited</h4>
                <p className="text-xs text-muted-foreground">Internationally recognized degrees and certifications.</p>
              </div>
              <div className="bg-background p-6 rounded-2xl border border-border shadow-sm mt-8">
                <Award className="h-8 w-8 text-accent mb-4" />
                <h4 className="font-bold mb-2">Excellence</h4>
                <p className="text-xs text-muted-foreground">Consistently ranked in the top 5% for student outcomes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculties & Departments */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Faculties & Departments</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Explore our diverse range of academic divisions and specialized research areas.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Faculty of Engineering", icon: Building2, depts: ["Computer Science", "Mechanical Engineering", "Electrical Systems"] },
              { title: "Faculty of Business", icon: BookOpen, depts: ["Strategic Management", "Finance & Accounting", "Global Logistics"] },
              { title: "Faculty of Humanities", icon: Library, depts: ["Political Science", "Digital Arts", "Institutional Ethics"] },
            ].map((f, i) => (
              <Card key={i} className="p-8 hover:border-primary/50 transition-colors group cursor-pointer">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <ul className="space-y-2 mb-6">
                  {f.depts.map(d => (
                    <li key={d} className="text-sm text-muted-foreground flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-primary" /> {d}
                    </li>
                  ))}
                </ul>
                <Button variant="link" className="p-0 h-auto text-primary font-bold">Explore Faculty</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Access Portals */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold mb-12">Institutional Access</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/login" className="group">
              <div className="text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <GraduationCap className="h-10 w-10" />
                </div>
                <p className="font-bold">Student Portal</p>
              </div>
            </Link>
            <Link to="/login" className="group">
              <div className="text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <Users className="h-10 w-10" />
                </div>
                <p className="font-bold">Staff Login</p>
              </div>
            </Link>
            <Link to="/admin" className="group">
              <div className="text-center space-y-4">
                <div className="h-20 w-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                  <Building2 className="h-10 w-10" />
                </div>
                <p className="font-bold">Administration</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Card = ({ children, className = "", ...props }: any) => (
  <div className={`bg-card rounded-3xl border border-border shadow-sm transition-all ${className}`} {...props}>
    {children}
  </div>
);

export default Index;
