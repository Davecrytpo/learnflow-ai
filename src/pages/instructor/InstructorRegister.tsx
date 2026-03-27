import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Loader2, CheckCircle, School } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const departments = [
  "Computer Science",
  "Business Administration",
  "Health Sciences",
  "Engineering",
  "Arts & Humanities",
  "Social Sciences",
  "Mathematics",
  "Natural Sciences",
  "Education",
  "Law"
];

const InstructorRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    specialization: "",
    bio: ""
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    
    if (formData.password.length < 8) {
      toast({ title: "Password too weak", description: "Must be at least 8 characters.", variant: "destructive" });
      return;
    }

    if (!formData.department) {
      toast({ title: "Department required", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const data = await apiClient.auth.signup({
        email: formData.email,
        password: formData.password,
        display_name: `${formData.firstName} ${formData.lastName}`,
        role: 'instructor',
        department: formData.department,
        specialization: formData.specialization,
        bio: formData.bio
      });

      if (data) {
        toast({ 
          title: "Application Received", 
          description: "Your faculty application is being reviewed. You can now log in to access your portal." 
        });
        navigate("/instructor/login");
      }
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Info & Branding */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block space-y-8 pr-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase">
              <School className="h-4 w-4" /> Faculty Recruitment
            </div>
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-slate-900 leading-tight">
              Shape the Future of <br />
              <span className="text-primary">Global Education</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Join a world-class team of educators and researchers. At Global University Institute, we provide the tools, platform, and support you need to reach students worldwide.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                "Advanced LMS tools with AI course generation",
                "Real-time analytics on student engagement",
                "Global reach with automated translation support",
                "Competitive revenue sharing for premium courses"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-200">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Faculty" className="h-full w-full object-cover" />
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  +120
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-500">Join 120+ active faculty members</p>
            </div>
          </motion.div>

          {/* Right Column: Application Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mx-auto lg:mx-0"
          >
            <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8">
              <div className="text-center mb-8">
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Faculty Application</h2>
                <p className="text-slate-500">Create your instructor profile</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Jane" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required 
                      className="h-11 bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Smith" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required 
                      className="h-11 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Institutional Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="jane.smith@university.edu" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                    className="h-11 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required 
                      className="h-11 bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required 
                      className="h-11 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select onValueChange={(v) => setFormData({...formData, department: v})}>
                    <SelectTrigger className="h-11 bg-slate-50"><SelectValue placeholder="Select Department" /></SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Area of Specialization</Label>
                  <Input 
                    id="specialization" 
                    placeholder="e.g. Quantum Computing, Macroeconomics" 
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    className="h-11 bg-slate-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Briefly describe your academic background..." 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="bg-slate-50 min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Submit Application
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-slate-500">
                Already a faculty member? <Link to="/instructor/login" className="text-primary font-bold hover:underline">Log in here</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstructorRegister;
