import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: searchParams.get("subject") || "",
    message: "",
    context: "admissions"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.fetch("/contact", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
      toast({ title: "Inquiry Sent", description: "We have received your message and sent a confirmation to your email." });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout 
      title="Contact Admissions" 
      description="Connect with our experts to learn more about programs, scholarships, and campus life."
      backgroundImage="https://images.unsplash.com/photo-1521791136064-7986c2959210?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Send an Inquiry</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Whether you have questions about the application process, academic programs, or life at GUI, our admissions team is here to help.
              </p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-12 text-center shadow-sm"
              >
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">Message Delivered</h3>
                <p className="text-emerald-700 leading-relaxed">
                  Thank you for contacting us. A confirmation email has been sent to <strong>{formData.email}</strong>. Our team will get back to you within 24-48 hours.
                </p>
                <Button variant="outline" className="mt-8 border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Your Name</Label>
                    <Input 
                      required 
                      placeholder="Jane Doe" 
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Email Address</Label>
                    <Input 
                      type="email" 
                      required 
                      placeholder="jane@example.com" 
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-bold ml-1">Subject / Area of Interest</Label>
                  <Input 
                    required 
                    placeholder="e.g. Computer Science Admissions" 
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold ml-1">Your Message</Label>
                  <Textarea 
                    required 
                    placeholder="Tell us what you'd like to know..." 
                    className="min-h-[150px] bg-slate-50 border-slate-200 rounded-2xl focus:bg-white p-4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full h-14 bg-primary text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</> : "Send Inquiry"}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-[3rem] p-10 space-y-10 shadow-2xl">
              <div className="flex items-start gap-6">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Campus Location</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Global University Institute<br/>
                    Office of Admissions, Hall of Excellence<br/>
                    123 Innovation Boulevard<br/>
                    Academic City, ST 90210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Direct Contact</h3>
                  <p className="text-slate-400 text-sm mb-1">+1 (555) 123-4567</p>
                  <p className="text-slate-500 text-xs">Available Mon - Fri, 9:00 AM - 5:00 PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Email Inquiries</h3>
                  <p className="text-slate-400 text-sm">admissions@globaluniversityinstitute.com</p>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <GraduationCap className="h-64 w-64 text-white" />
               </div>
               <h3 className="text-2xl font-bold mb-4 relative z-10">Attend a Virtual Open Day</h3>
               <p className="text-white/80 mb-8 relative z-10 leading-relaxed">
                 Experience our campus from anywhere in the world. Meet faculty, current students, and admissions staff.
               </p>
               <Button variant="outline" className="w-full h-14 rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary transition-all relative z-10 font-bold" asChild>
                 <Link to="/webinars">Register for Next Event</Link>
               </Button>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
