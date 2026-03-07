import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <PageLayout 
      title="Contact Us" 
      description="We're here to answer your questions."
      backgroundImage="https://images.unsplash.com/photo-1596524430615-b46476ddc36f?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-sm">
           <form className="space-y-6">
             <div className="grid sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">Name</label>
                 <Input placeholder="Your name" />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Email</label>
                 <Input type="email" placeholder="you@example.com" />
               </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="What is this regarding?" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Message</label>
               <Textarea placeholder="How can we help you?" className="min-h-[150px]" />
             </div>
             <Button size="lg" className="w-full">Send Message</Button>
           </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
