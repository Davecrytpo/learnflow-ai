import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/newsletter/subscribe", { email });
      toast({ title: "Subscription Confirmed", description: "You have successfully joined the GUI Institutional Gazette." });
      setEmail("");
    } catch (error: any) {
      toast({ title: "Subscription Error", description: error.response?.data?.error || "Failed to subscribe.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/50" />
      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/4 h-full bg-primary/5 blur-[100px] rounded-full" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-foreground text-xs font-bold uppercase tracking-widest mb-8">
               <Newspaper className="h-3.5 w-3.5" /> Institutional Gazette
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Stay Informed on Global Discoveries</h2>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 font-medium">
              Join 120,000+ subscribers who receive our weekly briefing on academic research, institutional milestones, and global events.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
                <Input
                  type="email"
                  placeholder="Institutional or Personal Email"
                  className="h-14 pl-12 pr-6 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-primary transition-all text-lg font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="h-14 px-8 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Subscribe Now"}
              </Button>
            </form>
            
            <p className="mt-8 text-xs text-slate-500 font-bold uppercase tracking-widest">
              Secured by institutional data protocols • Unsubscribe at any time
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
