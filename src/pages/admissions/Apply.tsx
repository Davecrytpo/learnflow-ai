import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const steps = [
  "Create an account on our admissions portal.",
  "Submit your academic transcripts and test scores.",
  "Upload your personal statement and letters of recommendation.",
  "Pay the non-refundable application fee.",
  "Schedule an interview (if required for your program)."
];

const Apply = () => {
  return (
    <PageLayout 
      title="How to Apply" 
      description="Start your journey to becoming a part of the Global University Institute community."
      backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg mb-12">
            <h2 className="font-display font-bold">Application Checklist</h2>
            <p>Ensure you have all necessary documents ready before starting your application.</p>
          </div>
          
          <div className="space-y-6 mb-12">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                   {i + 1}
                 </div>
                 <p className="text-lg pt-0.5">{step}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
            <p className="text-muted-foreground mb-8">
              Our application portal is open for Fall 2026 admissions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-brand text-primary-foreground" asChild>
                <Link to="/signup">Start Application</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/admissions/contact">Contact Admissions</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Apply;
