import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const SetupPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({ title: "Invalid Link", description: "This activation link is invalid or has expired.", variant: "destructive" });
      navigate("/");
    }
  }, [token, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Minimum 8 characters required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await apiClient.fetch("/auth/setup-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });
      toast({ title: "Account Activated", description: "Your faculty account is now active. Please log in." });
      navigate("/login");
    } catch (error: any) {
      toast({ title: "Activation Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4 mt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
        >
          <div className="p-8 md:p-12 text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Account Setup</h1>
            <p className="text-slate-500 mt-2 mb-8">Secure your institutional faculty account</p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <Label className="font-bold ml-1">New Password</Label>
                <div className="relative">
                  <Input 
                    type={showPass ? "text" : "password"} 
                    required 
                    placeholder="••••••••" 
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl pr-12 focus:bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="space-y-2">
                <Label className="font-bold ml-1">Confirm Password</Label>
                <Input 
                  type={showPass ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-primary text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-primary/90 transition-all mt-4" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Activate Account"}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SetupPassword;
