import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Wifi, Coffee } from "lucide-react";

const Housing = () => {
  return (
    <PageLayout 
      title="Housing & Dining" 
      description="Your home away from home."
      backgroundImage="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
             <h2 className="text-3xl font-display font-bold mb-6">Residential Life</h2>
             <p className="text-lg text-muted-foreground mb-8">
               Our residence halls are designed to foster community and personal growth. 
               First-year students live in dedicated halls with resident advisors to help navigate college life.
             </p>
             <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <Bed className="h-5 w-5 text-primary" />
                 <span>Fully furnished rooms with high-speed internet</span>
               </div>
               <div className="flex items-center gap-3">
                 <Coffee className="h-5 w-5 text-primary" />
                 <span>24/7 Dining Halls and Cafés</span>
               </div>
               <div className="flex items-center gap-3">
                 <Wifi className="h-5 w-5 text-primary" />
                 <span>Common areas and study lounges</span>
               </div>
             </div>
           </div>
           <div>
             <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800" className="rounded-2xl shadow-xl" alt="Dorm Room" />
           </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Housing;
