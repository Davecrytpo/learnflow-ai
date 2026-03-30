import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Phone, Calendar, User, MapPin } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    program_of_interest: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (formData.password.length < 8) {
      toast({ title: "Password too weak", description: "Minimum 8 characters required.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const data = await apiClient.auth.signup({
        email: formData.email,
        password: formData.password,
        display_name: formData.name,
        role: 'student',
        phone: formData.phone,
        date_of_birth: formData.dob,
        gender: formData.gender,
        address: formData.address,
        program_of_interest: formData.program_of_interest
      });

      toast({ 
        title: "Registration Successful", 
        description: `Welcome! Your admission number will be sent to ${formData.email}.` 
      });
      navigate("/login");
    } catch (error: any) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4 mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
        >
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                <GraduationCapIcon className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Student Registration</h1>
              <p className="text-slate-500 mt-2">Join Global University Institute</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      required 
                      placeholder="John Doe" 
                      className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Email Address</Label>
                  <Input 
                    type="email" 
                    required 
                    placeholder="john@example.com" 
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      required 
                      placeholder="+1 (555) 000-0000" 
                      className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="date" 
                      required 
                      className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Gender</Label>
                  <Select onValueChange={(v) => setFormData({...formData, gender: v})}>
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Program of Interest</Label>
                  <Input 
                    placeholder="e.g. Computer Science" 
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                    value={formData.program_of_interest}
                    onChange={(e) => setFormData({...formData, program_of_interest: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold ml-1">Contact Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="123 Academic Way, Innovation City" 
                    className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-xl"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Security Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPass ? "text" : "password"} 
                      required 
                      placeholder="••••••••" 
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl pr-12"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-primary text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-primary/90 transition-all mt-4" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Complete Registration"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
