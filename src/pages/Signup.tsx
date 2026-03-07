import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: name,
          role: 'student' // Strictly Student
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (authError) {
      toast({ title: "Signup failed", description: authError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (authData.user && authData.session) {
      setLoading(false);
      navigate("/dashboard");
    } else {
      setLoading(false);
      toast({ title: "Verification required", description: "Please check your email to verify your student account." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="h-16 w-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-primary/20">
              <GraduationCap className="h-9 w-9" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900">
              Student Registration
            </h1>
            <p className="text-slate-500 max-w-sm mx-auto">
              Join our global community of learners. Access thousands of courses and start your journey today.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="student@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-gradient-brand text-white font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Create Student Account
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">Already have an account? </span>
              <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              By registering, you agree to the Global University Institute <br />
              <Link to="/about" className="underline hover:text-slate-600">Terms of Service</Link> and <Link to="/about" className="underline hover:text-slate-600">Privacy Policy</Link>.
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
