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

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
      toast({ title: "Message Sent", description: "We've received your inquiry and will get back to you soon." });
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout 
      title="Contact Admissions" 
      description="Our team is here to help you navigate the application process."
      backgroundImage="https://images.unsplash.com/photo-1423666639041-f140051710b9?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Get in Touch</h2>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-100 rounded-3xl p-12 text-center"
              >
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Message Received</h3>
                <p className="text-green-700">Thank you for your interest in Global University Institute. We have sent a confirmation to your email and our admissions team will respond shortly.</p>
                <Button variant="outline" className="mt-8 border-green-200 text-green-700 hover:bg-green-100" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    required 
                    placeholder="Jane Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="jane@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="subject">Program of Interest</Label>
                   <Input 
                    id="subject" 
                    placeholder="e.g. Computer Science" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">How can we help you?</Label>
                  <Textarea 
                    id="message" 
                    required 
                    placeholder="Your message here..." 
                    className="min-h-[150px]" 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full bg-gradient-brand text-primary-foreground" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 rounded-3xl p-8 space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Mailing Address</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Office of Admissions<br/>
                    Global University Institute<br/>
                    123 Academic Way<br/>
                    Innovation City, ST 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-xs text-muted-foreground mt-1 px-2 py-0.5 bg-slate-200 rounded inline-block">Mon-Fri, 9am - 5pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p className="text-muted-foreground">admissions@globaluniversityinstitute.com</p>
                </div>
              </div>
            </div>

            <div className="bg-primary text-primary-foreground rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4 text-white">Join an Information Session</h3>
              <p className="text-primary-foreground/80 mb-6">
                Connect with our admissions counselors and learn more about our programs in a live webinar.
              </p>
              <Button variant="outline" className="w-full border-primary-foreground/30 hover:bg-white hover:text-primary transition-colors" asChild>
                <a href="/webinars">View Webinar Schedule</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
