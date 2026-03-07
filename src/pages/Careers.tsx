import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

const Careers = () => {
  return (
    <PageLayout 
      title="Careers at GUI" 
      description="Join our team of dedicated educators, researchers, and staff."
      backgroundImage="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">No Current Openings</h2>
          <p className="text-muted-foreground mb-8">
            We don't have any open positions right now, but we're always looking for talent. 
            Check back soon!
          </p>
          <Button variant="outline">Join Talent Network</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Careers;
