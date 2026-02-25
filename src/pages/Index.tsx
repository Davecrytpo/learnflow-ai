import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl px-6"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Global University Institute</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Learn. Teach. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Grow.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          We are not just an LMS. We are a smart learning ecosystem where your identity shapes your experience.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Student Path */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative cursor-pointer"
            onClick={() => navigate("/learn")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-card/50 backdrop-blur-xl border border-primary/20 hover:border-primary/50 rounded-3xl p-8 text-left transition-all duration-300 shadow-2xl shadow-black/5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <GraduationCap className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-2">I Want to Learn</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Get a personalized learning path, AI recommendations, and career certification.
              </p>
              <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </motion.div>

          {/* Instructor Path */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative cursor-pointer"
            onClick={() => navigate("/teach")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-card/50 backdrop-blur-xl border border-accent/20 hover:border-accent/50 rounded-3xl p-8 text-left transition-all duration-300 shadow-2xl shadow-black/5">
              <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <Users className="h-7 w-7 text-accent group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-2">I Want to Teach</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Build your brand, manage students, and earn revenue with professional tools.
              </p>
              <div className="flex items-center text-accent font-medium text-sm group-hover:translate-x-1 transition-transform">
                Start Teaching <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            <span>Global</span>
          </div>
        </div>
      </motion.div>
      
      {/* Admin Link (Hidden/Subtle) */}
      <div className="absolute bottom-6 right-6">
        <Link to="/login" className="text-xs text-muted-foreground/30 hover:text-primary transition-colors">
          Admin Login
        </Link>
      </div>
    </div>
  );
};

export default Index;
