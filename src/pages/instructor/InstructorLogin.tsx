import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, BookOpen, School, ArrowLeft } from "lucide-react";
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        // Check if user has instructor role
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "instructor")
          .single();

        if (roleData) {
          navigate("/instructor");
        } else {
          // Check if admin (admins can access instructor portal too usually)
          const { data: adminData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", data.user.id)
            .eq("role", "admin")
            .single();
          
          if (adminData) {
            navigate("/instructor");
          } else {
            await supabase.auth.signOut();
            throw new Error("Access Denied: Instructor privileges required.");
          }
        }
      }
    } catch (error: any) {
      toast({ title: "Portal Access Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <School className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Faculty Portal</h1>
                <p className="text-slate-500 mt-2">Authorized Personnel Access Only</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold ml-1 text-slate-700">Institutional Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="professor@university.edu"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <Label htmlFor="password" title="Password" className="font-bold text-slate-700">Security Key</Label>
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
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl pr-12 focus:bg-white" 
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
                  className="h-14 w-full bg-primary text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Authorize & Sign In"}
                </Button>
              </form>

              <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                <p className="text-sm text-slate-500">
                  New faculty? <Link to="/instructor/register" className="text-primary font-bold hover:underline">Apply for credentials</Link>
                </p>
                <button 
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Student Login
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
             <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">
               Protected by GUI Multi-Layer Security
             </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default InstructorLogin;
