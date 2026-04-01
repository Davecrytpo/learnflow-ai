import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, Globe, Briefcase, Award, MessageSquare, 
  Search, BookOpen, ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AlumniNetwork = () => {
  const stats = [
    { label: "Global Alumni", value: "45,000+" },
    { label: "Countries", value: "120+" },
    { label: "Mentors", value: "2,500+" },
    { label: "Job Placements", value: "94%" }
  ];

  return (
    <PageLayout 
      title="Alumni Network" 
      description="Stay connected with a global community of leaders, innovators, and changemakers."
      backgroundImage="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-10 md:py-20">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-24">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4 md:p-8 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100">
                <p className="text-2xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight">
                A lifelong <span className="text-primary italic">connection</span> to excellence.
              </h2>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                As a graduate of Global University Institute, you belong to an elite network of professionals across every industry. We provide the resources to help you continue growing long after graduation.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Career Services for Life</h4>
                    <p className="text-sm text-slate-500">Access exclusive job boards and professional coaching forever.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Regional Chapters</h4>
                    <p className="text-sm text-slate-500">Join over 50 local chapters to network in your own city.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Button size="lg" className="h-14 px-8 md:px-10 rounded-full font-bold shadow-xl w-full sm:w-auto" asChild>
                  <Link to="/signup">Join Alumni Portal</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 md:px-10 rounded-full font-bold w-full sm:w-auto" asChild>
                  <Link to="/giving">Support GUI</Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <img 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000" 
                className="rounded-[2rem] md:rounded-[3.5rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                alt="Alumni Gathering"
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 hidden md:block">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h4 className="font-bold text-lg mb-1">Distinguished Alumni</h4>
                <p className="text-xs text-slate-500">Nominate a peer for the 2026 Excellence Award.</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-center">Stay Involved</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Mentorship", icon: Users, desc: "Guide current students as they navigate their career paths." },
                { title: "Events", icon: MessageSquare, desc: "Register for reunions, webinars, and networking mixers." },
                { title: "Continuing Ed", icon: BookOpen, desc: "Alumni receive a 25% discount on all professional certifications." }
              ].map((item, i) => (
                <Card key={i} className="rounded-[2rem] md:rounded-[2.5rem] border-slate-100 hover:border-primary/20 transition-all overflow-hidden p-6 md:p-10 text-center space-y-6">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mx-auto">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  <Button variant="ghost" className="font-bold text-primary group">
                    Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default AlumniNetwork;
