import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Laptop, Clock, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const OnlineLearning = () => {
  return (
    <PageLayout 
      title="GUI Online" 
      description="World-class education, delivered wherever you are."
      backgroundImage="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-bold mb-4">Flexible Learning for Modern Life</h2>
          <p className="text-lg text-muted-foreground">
            Earn the same degree as our on-campus students through our interactive online platform. 
            Access lectures, collaborate with peers, and engage with faculty on your schedule.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Laptop, title: "100% Online", desc: "No campus visits required. Complete your degree from home." },
            { icon: Clock, title: "Self-Paced Options", desc: "Balance your studies with work and personal commitments." },
            { icon: Globe, title: "Global Network", desc: "Connect with classmates from over 150 countries." },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 border border-border rounded-2xl bg-card">
              <div className="mx-auto h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to start learning?</h2>
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold" asChild>
              <Link to="/academics/catalog">Browse Online Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OnlineLearning;
