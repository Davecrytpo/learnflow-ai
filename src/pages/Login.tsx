import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import { useAuthContext } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshRole } = useAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await apiClient.auth.login({ email, password });
      if (data.token) {
        await refreshRole();
        toast({ title: "Login successful", description: `Welcome back, ${data.user.display_name}!` });
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
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
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                <GraduationCapIcon className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-display font-bold text-slate-900">University Login</h1>
              <p className="text-slate-500 mt-2">Access your institutional portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="font-bold ml-1">Institutional Email</Label>
                <Input 
                  id="login-email"
                  type="email" 
                  required 
                  placeholder="name@globaluniversityinstitute.com" 
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="login-password" className="font-bold">Password</Label>
                  <Link to="/forgot-password" size="sm" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input 
                    id="login-password"
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

              <Button 
                type="submit" 
                className="w-full h-14 bg-primary text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-primary/90 transition-all mt-4" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-slate-500">
                New student? <Link to="/signup" className="text-primary font-bold hover:underline">Register here</Link>
              </p>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-3">Other Portals</p>
                <div className="flex justify-center gap-4">
                  <Link to="/instructor/login" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">Faculty</Link>
                  <span className="text-slate-200">|</span>
                  <Link to="/admin/login" className="text-xs font-bold text-slate-600 hover:text-primary transition-colors">Administrator</Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
