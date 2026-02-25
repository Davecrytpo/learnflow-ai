import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, ArrowRight, Lock } from "lucide-react";
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
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Verify if actually an admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    // Check for hardcoded admin too just in case
    const isAdmin = roleData?.role === "admin" || email === "somedaynews739@gmail.com";

    if (!isAdmin) {
      await supabase.auth.signOut();
      toast({ title: "Access Denied", description: "You do not have administrative privileges.", variant: "destructive" });
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-6">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Admin Console</h1>
          <p className="text-slate-400 mt-2">Authorized personnel only</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-300">Staff Email</Label>
              <Input 
                type="email" 
                className="bg-white/5 border-white/10 text-white h-12 focus:border-primary transition-all" 
                placeholder="staff@globalinstitute.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-300">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Reset access</a>
              </div>
              <Input 
                type="password" 
                className="bg-white/5 border-white/10 text-white h-12 focus:border-primary transition-all" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
              Access Dashboard
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white" onClick={() => navigate("/")}>
            Return to main site
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
