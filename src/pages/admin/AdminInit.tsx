import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2, KeyRound, Mail, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

const ADMIN_BOOTSTRAP_EMAIL = "globaluniversityinstitutes@gmail.com";

const AdminInit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: ADMIN_BOOTSTRAP_EMAIL,
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await apiClient.fetch("/auth/init-admin", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      toast({ title: "Admin created", description: "The initial administrator account is ready." });
      navigate("/admin/login", { replace: true });
    } catch (error: any) {
      toast({ title: "Initialization failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
        <div className="mb-8 flex items-center justify-between text-white/60">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to University
          </button>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">System Bootstrap</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Shield className="h-24 w-24 text-primary" />
          </div>

          <div className="relative z-10 text-center mb-10">
            <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
              <KeyRound className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Initialize Admin Access</h1>
            <p className="text-slate-400 text-sm">Create the single institutional admin account. This page is separate from instructor email setup.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 ml-1">Administrator Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  readOnly
                  value={formData.email}
                  className="h-14 rounded-2xl border-slate-800 bg-slate-950/50 text-white pl-11 opacity-80"
                />
              </div>
              <p className="text-xs text-slate-500">Only `globaluniversityinstitutes@gmail.com` can be initialized as admin.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData((current) => ({ ...current, password: e.target.value }))}
                  className="h-14 rounded-2xl border-slate-800 bg-slate-950/50 text-white pl-11"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-14 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-lg" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Administrator"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminInit;

