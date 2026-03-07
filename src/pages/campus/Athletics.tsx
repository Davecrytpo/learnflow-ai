import PageLayout from "@/components/layout/PageLayout";
import { Trophy, Dumbbell, Activity } from "lucide-react";

const Athletics = () => {
  return (
    <PageLayout 
      title="Athletics & Recreation" 
      description="Champions in the classroom and on the field."
      backgroundImage="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
           <div className="bg-primary/5 p-8 rounded-3xl text-center border border-primary/10">
             <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
             <h3 className="font-bold text-xl mb-2">Varsity Sports</h3>
             <p className="text-muted-foreground">22 NCAA Division I teams competing at the highest level.</p>
           </div>
           <div className="bg-primary/5 p-8 rounded-3xl text-center border border-primary/10">
             <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
             <h3 className="font-bold text-xl mb-2">Intramurals</h3>
             <p className="text-muted-foreground">Competitive and recreational leagues for all skill levels.</p>
           </div>
           <div className="bg-primary/5 p-8 rounded-3xl text-center border border-primary/10">
             <Dumbbell className="h-12 w-12 text-primary mx-auto mb-4" />
             <h3 className="font-bold text-xl mb-2">Wellness Center</h3>
             <p className="text-muted-foreground">State-of-the-art gym, pool, and fitness classes open to all students.</p>
           </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Athletics;
