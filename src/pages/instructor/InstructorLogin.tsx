import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, GraduationCap, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const InstructorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({ title: "Welcome back, Professor", description: "Accessing faculty dashboard..." });
        navigate("/instructor/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Authentication Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="flex w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          
          <div className="hidden lg:flex w-1/2 bg-indigo-900 p-12 flex-col justify-between text-white relative">
            <div className="absolute inset-0 bg-[url('/images/research-lab.jpg')] bg-cover opacity-20" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="font-display text-xl font-bold tracking-tight">Faculty Portal</span>
              </div>
              
              <h2 className="text-4xl font-display font-bold leading-tight mb-6">
                Empower the <br />
                <span className="text-indigo-300">Next Generation</span>
              </h2>
              <p className="text-indigo-100/70 text-lg leading-relaxed max-w-xs">
                Manage your curriculum, track student excellence, and utilize AI-powered pedagogical tools.
              </p>
            </div>

            <div className="relative z-10 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
               <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">Institutional Notice</p>
               <p className="text-sm text-white/80 leading-relaxed italic">
                 "Academic excellence is the cornerstone of our global community. Access restricted to verified faculty members."
               </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-sm mx-auto"
            >
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Faculty Login</h1>
              <p className="text-slate-500 mb-10">Sign in to your institutional workspace.</p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold ml-1">Institutional Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="professor@gui.edu"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:bg-white transition-all" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <Label htmlFor="password" title="Password" className="font-bold">Security Key</Label>
                    <a href="#" className="text-xs text-primary font-bold hover:underline">Support</a>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPass ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="h-12 bg-slate-50 border-slate-100 rounded-xl pr-12 focus:bg-white transition-all" 
                    />
                    <button 
                      type="button" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" 
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="h-14 w-full bg-slate-900 text-white font-bold text-lg rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Access Faculty Workspace"}
                </Button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-sm text-slate-500">
                  New faculty? <Link to="/instructor/signup" className="text-primary font-bold hover:underline">Apply for credentials</Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstructorLogin;
