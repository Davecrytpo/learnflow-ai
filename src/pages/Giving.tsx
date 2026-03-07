import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Giving = () => {
  return (
    <PageLayout 
      title="Support GUI" 
      description="Your gift empowers the next generation of leaders and innovators."
      backgroundImage="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
         <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Make an Impact</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Philanthropy fuels our mission. From scholarships to research grants, your donation directly supports our community.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white gap-2">
                   <Heart className="h-4 w-4 fill-white" />
                   Give Now
                </Button>
                <Button size="lg" variant="outline">
                   Ways to Give
                </Button>
              </div>
            </div>
            <div className="bg-slate-100 p-8 rounded-3xl">
               <h3 className="font-bold text-xl mb-4">Priority Funds</h3>
               <ul className="space-y-4">
                 <li className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                   <h4 className="font-bold text-primary">Student Scholarship Fund</h4>
                   <p className="text-sm text-muted-foreground">Direct financial aid for students in need.</p>
                 </li>
                 <li className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                   <h4 className="font-bold text-primary">Research Innovation Fund</h4>
                   <p className="text-sm text-muted-foreground">Seed funding for breakthrough research projects.</p>
                 </li>
                 <li className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                   <h4 className="font-bold text-primary">Campus Sustainability Initiative</h4>
                   <p className="text-sm text-muted-foreground">Supporting our goal to be carbon neutral by 2030.</p>
                 </li>
               </ul>
            </div>
         </div>
      </div>
    </PageLayout>
  );
};

export default Giving;
