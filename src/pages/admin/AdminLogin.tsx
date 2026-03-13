import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        // Check if user is actually an admin
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .single();

        if (roleData) {
          toast({ title: "Authorized", description: "Welcome to the institutional command center." });
          navigate("/admin/dashboard");
        } else {
          await supabase.auth.signOut();
          throw new Error("Access Denied: Administrative privileges required.");
        }
      }
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans selection:bg-primary selection:text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex items-center justify-between text-white/60">
           <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium">
             <ArrowLeft className="h-4 w-4" /> Back to University
           </button>
           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Institutional Access</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Shield className="h-24 w-24 text-primary" />
          </div>

          <div className="relative z-10 text-center mb-10">
            <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Global University Institute Infrastructure</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 ml-1">Administrator Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@globaluniversityinstitute.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="h-14 rounded-2xl border-slate-800 bg-slate-950/50 text-white placeholder:text-slate-600 focus:border-primary transition-all px-5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="Institutional Password"  className="text-slate-300 ml-1">Secure Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="h-14 rounded-2xl border-slate-800 bg-slate-950/50 text-white placeholder:text-slate-600 focus:border-primary transition-all px-5"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-lg transition-all active:scale-95" 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Authorize Access"}
            </Button>
          </form>
        </div>

        <div className="mt-10 text-center">
           <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold">
             Protected by GUI Multi-Layer Security
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
