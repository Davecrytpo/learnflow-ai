import { motion } from "framer-motion";
import { 
  BookOpen, Sparkles, GraduationCap, 
  Target, Globe, ShieldCheck, Zap, 
  ArrowRight, CheckCircle2, Award,
  Users, BarChart, MessageSquare,
  ClipboardCheck, Clock, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";

const TeachAtGui = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      title: "Global Reach",
      description: "Instruct your curriculum to a diverse cohort of scholars across 120+ countries.",
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "AI Orchestration",
      description: "Utilize our proprietary AI engine to draft syllabi, grade assessments, and analyze student velocity.",
      icon: Sparkles,
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    },
    {
      title: "Institutional Merit",
      description: "Earn accredited recognition and competitive honorariums based on pedagogical excellence.",
      icon: Award,
      color: "text-amber-500",
      bg: "bg-amber-50"
    }
  ];

  const steps = [
    {
      title: "Pedagogical Vision",
      description: "Define your subject area and learning objectives. Our AI helps structure your vision into a rigorous academic framework.",
      icon: Target
    },
    {
      title: "Curriculum Architecture",
      description: "Build interactive modules, video lectures, and proctored assessments using our enterprise-grade toolkit.",
      icon: BookOpen
    },
    {
      title: "Institutional Review",
      description: "Your course undergoes a rigorous peer-review process to ensure it meets GUI's global accreditation standards.",
      icon: ShieldCheck
    },
    {
      title: "Global Launch",
      description: "Deploy your curriculum to our global registry and begin mentoring the next generation of leaders.",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center lg:text-left mb-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-100"
              >
                <GraduationCap className="h-4 w-4" /> Faculty Excellence Program
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-950 leading-[1.1]">
                Shape the future of <span className="text-indigo-600">Global Education.</span>
              </h1>
              
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                Join our elite faculty of visionaries, researchers, and industry leaders. 
                Global University Institute provides the platform and AI tools to transform 
                your expertise into a world-class accredited curriculum.
              </p>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <Button 
                  onClick={() => navigate("/instructor/register")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-16 px-12 rounded-2xl shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 text-lg"
                >
                  Apply to Faculty
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="h-16 px-12 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 transition-all text-lg"
                >
                  Portal Access
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative hidden lg:block">
              <div className="absolute inset-0 bg-indigo-100 rounded-[4rem] rotate-3 -z-10" />
              <div className="bg-white border-8 border-indigo-50 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="h-64 w-64 text-indigo-600" />
                 </div>
                 <div className="space-y-10 relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                          <BarChart className="h-7 w-7" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900">Faculty Impact Index</p>
                          <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Real-time metrics</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       {[
                         { label: "Global Reach", value: 94, color: "bg-indigo-500" },
                         { label: "Pedagogical Clarity", value: 88, color: "bg-blue-500" },
                         { label: "Scholar Engagement", value: 91, color: "bg-emerald-500" }
                       ].map((stat, i) => (
                         <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                               <span>{stat.label}</span>
                               <span className="text-slate-900">{stat.value}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${stat.value}%` }}
                                 transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                 className={`h-full ${stat.color} rounded-full`}
                               />
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="pt-4 flex items-center gap-4 text-xs font-bold text-slate-400">
                       <div className="flex -space-x-3">
                          {[1,2,3].map(x => <div key={x} className="h-8 w-8 rounded-full border-4 border-white bg-slate-100" />)}
                       </div>
                       <span>Join 4,200+ elite faculty members</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-50 py-32 border-y border-slate-100">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl font-display font-bold text-slate-950 tracking-tight">Everything you need to <span className="text-indigo-600">instruct at scale.</span></h2>
              <p className="text-lg text-slate-500 font-medium">Our enterprise-grade infrastructure handles the complexity, allowing you to focus on your research and pedagogy.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {benefits.map((benefit, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] bg-white overflow-hidden group">
                  <CardContent className="p-10 space-y-6">
                    <div className={`h-16 w-16 rounded-2xl ${benefit.bg} flex items-center justify-center transition-transform group-hover:rotate-6`}>
                      <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-950">{benefit.title}</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* The GUI Process */}
        <section className="py-32 container mx-auto px-6">
           <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="flex-1">
                 <h2 className="text-4xl font-display font-bold text-slate-950 mb-8 leading-tight">Your journey to becoming an <span className="text-indigo-600">Accredited Instructor.</span></h2>
                 <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed">
                    We maintain the highest academic standards. Our onboarding process ensures that every course in our registry provides substantial value to our global cohort of scholars.
                 </p>
                 
                 <div className="space-y-6">
                    {steps.map((step, i) => (
                      <div key={i} className="flex gap-6 group">
                         <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            {i + 1}
                         </div>
                         <div>
                            <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{step.title}</h4>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.description}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="flex-1 bg-indigo-600 rounded-[3.5rem] p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-10">
                    <MessageSquare className="h-48 w-48" />
                 </div>
                 <div className="relative z-10 space-y-8">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                       <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-4xl font-display font-bold">Ready to publish?</h3>
                    <p className="text-indigo-50/80 text-xl font-medium leading-relaxed">
                       Begin your tenure at Global University Institute today. Our faculty recruitment team is currently reviewing applications for the 2026 Academic Term.
                    </p>
                    <div className="space-y-4 pt-4">
                       {[
                         "Industry competitive honorariums",
                         "Proprietary AI instructional toolkit",
                         "Global peer-review community",
                         "Integrated research grant access"
                       ].map((item, i) => (
                         <div key={i} className="flex items-center gap-3 font-bold text-indigo-100">
                            <CheckCircle2 className="h-5 w-5 text-indigo-300" />
                            <span>{item}</span>
                         </div>
                       ))}
                    </div>
                    <Button 
                      onClick={() => navigate("/instructor/register")}
                      className="w-full h-16 bg-white text-indigo-600 hover:bg-indigo-50 font-black text-lg rounded-2xl shadow-2xl transition-all hover:scale-[1.02]"
                    >
                      Start Your Application <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-6 py-20 text-center bg-slate-950 rounded-[4rem] text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15),transparent)]" />
           <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                 Pedagogy at Scale
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold leading-tight">
                Empower the next <br/><span className="text-indigo-400">generation of scholars.</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-6 pt-6">
                 <Button 
                   onClick={() => navigate("/instructor/register")}
                   className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-black text-lg shadow-2xl shadow-indigo-500/20"
                 >
                   Become an Instructor
                 </Button>
                 <Button 
                   variant="ghost" 
                   onClick={() => navigate("/contact")}
                   className="h-16 px-12 rounded-2xl border border-white/10 font-bold hover:bg-white/5 transition-all text-lg"
                 >
                   Inquire for Department
                 </Button>
              </div>
           </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeachAtGui;
