import PageLayout from "@/components/layout/PageLayout";
import { Heart, BrainCircuit, ShieldAlert } from "lucide-react";

const Health = () => {
  return (
    <PageLayout 
      title="Health & Wellness" 
      description="Comprehensive care for your physical and mental well-being."
      backgroundImage="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
         <div className="max-w-4xl mx-auto space-y-12">
            <section className="flex gap-6 items-start">
              <div className="h-12 w-12 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Student Health Center</h3>
                <p className="text-muted-foreground">
                  Our on-campus clinic provides primary care, vaccinations, and urgent care services. 
                  Appointments can be booked online via the student portal.
                </p>
              </div>
            </section>

            <section className="flex gap-6 items-start">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Counseling & Psychological Services</h3>
                <p className="text-muted-foreground">
                  Free, confidential counseling is available to all students. We offer individual therapy, 
                  group workshops, and 24/7 crisis support.
                </p>
              </div>
            </section>

             <section className="flex gap-6 items-start">
              <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Emergency Services</h3>
                <p className="text-muted-foreground">
                  Campus Safety is available 24/7. Call 555-HELP for immediate assistance.
                </p>
              </div>
            </section>
         </div>
      </div>
    </PageLayout>
  );
};

export default Health;
