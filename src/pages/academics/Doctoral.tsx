import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Doctoral = () => {
  return (
    <PageLayout 
      title="Doctoral Programs" 
      description="Join a community of scholars pushing the boundaries of human knowledge."
      backgroundImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">PhD Requirements & Funding</h2>
            <p className="text-lg text-muted-foreground mb-6">
              All admitted PhD students receive full financial support, including a tuition waiver, 
              health insurance, and a generous living stipend for five years.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Full Tuition Waiver",
                "Annual Stipend of $45,000",
                "Conference Travel Support",
                "Health & Dental Insurance",
                "Summer Research Funding"
              ].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="bg-gradient-brand text-primary-foreground" asChild>
              <Link to="/admissions/apply">Apply for PhD</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-3" />
            <img 
              src="https://images.unsplash.com/photo-1523287562758-66c7fc58967f?auto=format&fit=crop&q=80&w=800" 
              alt="Research Lab" 
              className="relative rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Doctoral;
