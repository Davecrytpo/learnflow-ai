import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageSquare, Clock, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <PageLayout 
      title="Contact Global University" 
      subtitle="Our admissions and support teams are here to assist you with your academic journey."
    >
      <div className="max-w-7xl mx-auto py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Contact Info Side */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-display font-bold text-slate-900">Get in Touch</h2>
              <p className="text-slate-500 leading-relaxed">
                Whether you have questions about admissions, technical support, or institutional partnerships, we're ready to help.
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "Admissions", value: "admissions@globaluniversityinstitute.com", color: "text-blue-600", bg: "bg-blue-50" },
                { icon: MessageSquare, label: "Support", value: "support@globaluniversityinstitute.com", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: Phone, label: "Phone", value: "+1 (555) 800-GUI-INST", color: "text-indigo-600", bg: "bg-indigo-50" },
                { icon: MapPin, label: "Campus", value: "123 Academic Way, Cambridge, MA", color: "text-rose-600", bg: "bg-rose-50" },
              ].map((item, i) => (
                <Card key={i} className="border-none shadow-sm shadow-slate-100 group hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                      <p className="text-sm font-bold text-slate-700">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-none shadow-sm bg-slate-900 p-8 text-white rounded-[2rem] overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Clock className="h-20 w-20" />
               </div>
               <div className="relative z-10">
                 <h3 className="font-bold text-xl mb-2">Office Hours</h3>
                 <div className="space-y-2 text-slate-400 text-sm">
                    <p className="flex justify-between"><span>Mon - Fri</span> <span>9:00 AM - 6:00 PM</span></p>
                    <p className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 2:00 PM</span></p>
                    <p className="flex justify-between text-primary font-bold mt-4"><span>Emergency Support</span> <span>24/7 Available</span></p>
                 </div>
               </div>
            </Card>
          </div>

          {/* Contact Form Side */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 p-8 md:p-12 rounded-[2.5rem] shadow-xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Send an Institutional Inquiry</h3>
              <form className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold ml-1">Full Name</Label>
                  <Input id="name" placeholder="John Doe" className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold ml-1">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:bg-white" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="subject" className="font-bold ml-1">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:bg-white" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="message" className="font-bold ml-1">Message</Label>
                  <Textarea id="message" placeholder="Detailed inquiry..." className="min-h-[180px] bg-slate-50 border-slate-100 rounded-xl focus:bg-white" />
                </div>
                <div className="md:col-span-2 pt-4">
                  <Button size="lg" className="w-full md:w-auto h-14 px-12 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90">
                    Send Inquiry <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Map Placeholder */}
            <div className="mt-12 rounded-[2.5rem] overflow-hidden h-[300px] relative border-4 border-white shadow-lg">
               <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" alt="Campus Map" className="w-full h-full object-cover grayscale opacity-50" />
               <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                        <MapPin className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="font-bold text-slate-900">Main Campus</p>
                        <p className="text-xs text-slate-500">Cambridge, MA</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
