import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const AdminSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // STRICT EMAIL ENFORCEMENT
    if (email !== "somedaynews739@gmail.com") {
      toast({
        title: "Access Denied",
        description: "This institutional route is restricted to the designated primary administrator.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "admin",
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Institutional Account Created",
          description: "Welcome, Administrator. You may now access the command center.",
        });
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100"
          >
            <div className="flex flex-col items-center text-center mb-10">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Institutional Access</h1>
              <p className="text-slate-500">Configure your primary administrative credentials.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="System Administrator"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Administrative Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gui.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Security Key</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="h-14 w-full bg-slate-900 text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-slate-800 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Initialize Admin Account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Link to="/admin/login" className="text-sm font-bold text-primary hover:underline">
                Existing Administrator? Log in
              </Link>
            </div>
          </motion.div>
          
          <p className="mt-8 text-center text-slate-400 text-xs uppercase tracking-widest font-bold">
            Protected by GUI Multi-Layer Security
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminSignup;
