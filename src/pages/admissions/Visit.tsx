import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";

const Visit = () => {
  return (
    <PageLayout 
      title="Visit Campus" 
      description="Experience the energy of our community firsthand."
      backgroundImage="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Campus Tours</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join a student-led tour to explore our historic buildings, state-of-the-art labs, and vibrant student centers. 
              Tours are available Monday through Saturday.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-primary" />
                <span>Duration: 90 minutes</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Start: Admissions Center, Main Hall</span>
              </div>
            </div>

            <Button size="lg">Schedule a Tour</Button>
          </div>
          
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6436423985167!2d-79.94563148460406!3d40.44261697936171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8834f21f58679a9f%3A0x8878657669e4229d!2sCarnegie%20Mellon%20University!5e0!3m2!1sen!2sus!4v1625686000000!5m2!1sen!2sus" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen 
               loading="lazy"
               title="Campus Map"
             />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Visit;
