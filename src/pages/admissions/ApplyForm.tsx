import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

const ApplyForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    program_of_interest: "",
    academic_level: "Undergraduate",
    previous_school: "",
    gpa: "",
    test_scores: "",
    personal_statement: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiClient.fetch("/admissions/apply", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setAdmissionNumber(data.admission_number);
      setSuccess(true);
      toast({ title: "Application Submitted", description: "Your admission number is " + data.admission_number });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageLayout title="Application Successful">
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">Application Received!</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your application has been submitted successfully. Our admissions team will review your details and contact you via email.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-md mx-auto mb-8">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Your Admission Number</p>
              <p className="text-3xl font-mono font-bold text-primary">{admissionNumber}</p>
            </div>
            <Button size="lg" asChild>
              <a href="/">Return Home</a>
            </Button>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Start Your Application" 
      description="Fill out the form below to apply for admission to Global University Institute."
    >
      <div className="container mx-auto px-4 py-16">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
          
          {/* Personal Information */}
          <section className="space-y-6">
            <h3 className="text-2xl font-display font-bold border-b pb-2">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" required value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" required value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Create Password (for your portal)</Label>
                <Input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="space-y-6">
            <h3 className="text-2xl font-display font-bold border-b pb-2">Contact Address</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Zip / Postal Code</Label>
                <Input id="zip" value={formData.zip_code} onChange={(e) => setFormData({...formData, zip_code: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Academic Interest */}
          <section className="space-y-6">
            <h3 className="text-2xl font-display font-bold border-b pb-2">Academic Interest</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Academic Level</Label>
                <Select value={formData.academic_level} onValueChange={(v) => setFormData({...formData, academic_level: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Undergraduate">Undergraduate (Bachelor's)</SelectItem>
                    <SelectItem value="Graduate">Graduate (Master's)</SelectItem>
                    <SelectItem value="Doctoral">Doctoral (PhD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Program of Interest</Label>
                <Input id="program" required placeholder="e.g. Computer Science" value={formData.program_of_interest} onChange={(e) => setFormData({...formData, program_of_interest: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Background */}
          <section className="space-y-6">
            <h3 className="text-2xl font-display font-bold border-b pb-2">Educational Background</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="school">Previous Institution Name</Label>
                <Input id="school" value={formData.previous_school} onChange={(e) => setFormData({...formData, previous_school: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">Cumulative GPA</Label>
                <Input id="gpa" placeholder="e.g. 3.8" value={formData.gpa} onChange={(e) => setFormData({...formData, gpa: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test">Standardized Test Scores (Optional)</Label>
                <Input id="test" placeholder="SAT, ACT, GRE, etc." value={formData.test_scores} onChange={(e) => setFormData({...formData, test_scores: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="statement">Personal Statement</Label>
                <Textarea 
                  id="statement" 
                  placeholder="Tell us about your goals and why you want to join GUI..." 
                  className="min-h-[200px]"
                  value={formData.personal_statement}
                  onChange={(e) => setFormData({...formData, personal_statement: e.target.value})}
                />
              </div>
            </div>
          </section>

          <Button type="submit" size="lg" className="w-full bg-gradient-brand text-primary-foreground h-14 text-lg" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Application...</> : "Submit Application"}
          </Button>
        </form>
      </div>
    </PageLayout>
  );
};

export default ApplyForm;
