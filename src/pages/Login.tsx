import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;
      
      localStorage.setItem("gui_auth_token", token);
      await refreshUser();
      
      toast({ title: "Welcome back!", description: "Successfully logged in to your account." });
      navigate("/dashboard");
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed. Please check your credentials.";
      toast({ title: "Login failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="flex w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          
          {/* Left Side: Student Branding */}
          <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between text-white relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="font-display text-xl font-bold tracking-tight">Student Portal</span>
              </div>
              
              <h2 className="text-4xl font-display font-bold leading-tight mb-6">
                Advance Your <br />
                <span className="text-primary">Academic Career</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xs">
                Access your global classroom, track academic credits, and collaborate with peers worldwide.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              {[
                "2,800+ Professional Courses",
                "Recognized Institutional Credits",
                "Global Alumni Network"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm mx-auto"
            >
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 text-primary">Sign In</h1>
              <p className="text-slate-500 mb-10">Welcome back to Global University Institute.</p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold ml-1">Student Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="student@example.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:bg-white transition-all" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <Label htmlFor="password" title="Password" className="font-bold">Security Key</Label>
                    <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot?</a>
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
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Access Portal"}
                </Button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-sm text-slate-500">
                  Not a student? <Link to="/signup" className="text-primary font-bold hover:underline">Register today</Link>
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

// Internal CheckCircle for branding
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Login;
