import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Building2, FlaskConical, Briefcase, Globe } from "lucide-react";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const programs = [
  { 
    name: "Computer Science", 
    desc: "Study software engineering, AI, and systems design.",
    category: "Engineering"
  },
  { 
    name: "Business Administration", 
    desc: "Learn modern management, finance, and entrepreneurship.",
    category: "Business"
  },
  { 
    name: "Biomedical Sciences", 
    desc: "Explore the intersection of biology and medicine.",
    category: "Medicine"
  },
  { 
    name: "Digital Arts & Design", 
    desc: "Master visual communication in the digital age.",
    category: "Arts & Humanities"
  },
  { 
    name: "International Relations", 
    desc: "Understand global politics, economics, and law.",
    category: "Humanities"
  },
  { 
    name: "Mechanical Engineering", 
    desc: "Design and build the future of robotics and machinery.",
    category: "Engineering"
  }
];

const faculties = [
  { name: "School of Engineering", icon: Building2, count: "12 Programs" },
  { name: "Business & Management", icon: Briefcase, count: "8 Programs" },
  { name: "Health & Medicine", icon: FlaskConical, count: "6 Programs" },
  { name: "Arts & Humanities", icon: GraduationCapIcon, count: "10 Programs" }

];

const Undergraduate = () => {
  return (
    <PageLayout 
      title="Undergraduate Programs" 
      description="Launch your future with world-class bachelor's degrees designed for tomorrow's leaders."
      backgroundImage="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            
            {/* Faculties Section */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-8">Academic Schools</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {faculties.map((faculty, i) => (
                  <Card key={i} className="group hover:border-primary/50 transition-colors">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <faculty.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold">{faculty.name}</h3>
                        <p className="text-sm text-muted-foreground">{faculty.count}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto" asChild>
                        <Link to={`/academics/catalog?category=${encodeURIComponent(faculty.name.split(' & ')[0])}`}><ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Featured Programs */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold">Popular Majors</h2>
                  <p className="text-muted-foreground">Most-applied programs for the 2026 academic year.</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/academics/catalog">View All Programs</Link>
                </Button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {programs.map((program, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{program.category}</div>
                        <CardTitle className="mb-2 text-xl">{program.name}</CardTitle>
                        <p className="text-muted-foreground mb-6 text-sm">{program.desc}</p>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link to={`/academics/catalog?search=${encodeURIComponent(program.name)}`}>Learn More</Link>
                          </Button>
                          <Button className="flex-1" asChild>
                            <Link to={`/admissions/apply-form?program=${encodeURIComponent(program.name)}`}>Apply Now</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Admissions Information</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex justify-between text-sm">
                  <span className="text-slate-400">Application Deadline</span>
                  <span className="font-medium">Jan 15, 2027</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-slate-400">Early Decision</span>
                  <span className="font-medium">Nov 1, 2026</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-slate-400">Acceptance Rate</span>
                  <span className="font-medium">12%</span>
                </li>
              </ul>
              <div className="space-y-3">
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100" asChild>
                  <Link to="/admissions/apply-form">Start Your Application</Link>
                </Button>
                <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800" asChild>
                  <Link to="/admissions/contact">Contact Admissions</Link>
                </Button>
              </div>
              <p className="text-xs text-center text-slate-500 mt-6 italic">
                GUI is committed to providing accessible education to all qualified students.
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
              <BookOpen className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Academic Resources</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Explore our digital catalog and learning resources.
              </p>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-3" asChild>
                  <Link to="/academics/calendar">
                    <div className="h-8 w-8 rounded bg-white flex items-center justify-center text-primary shadow-sm"><Users className="h-4 w-4" /></div>
                    <span>Academic Calendar</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-3" asChild>
                  <Link to="/contact">
                    <div className="h-8 w-8 rounded bg-white flex items-center justify-center text-primary shadow-sm"><Globe className="h-4 w-4" /></div>
                    <span>International Student Info</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Undergraduate;
