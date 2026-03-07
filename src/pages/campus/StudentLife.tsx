import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Mic, Palette, Gamepad2 } from "lucide-react";

const StudentLife = () => {
  return (
    <PageLayout 
      title="Student Life" 
      description="Find your community. Explore your passions."
      backgroundImage="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
           <p className="text-lg text-muted-foreground">
             With over 200 student organizations, there's something for everyone. From acapella groups to robotics clubs, 
             you'll find lifelong friends and endless opportunities to lead.
           </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
           {[
             { icon: Music, label: "Arts & Culture" },
             { icon: Mic, label: "Student Media" },
             { icon: Palette, label: "Creative Arts" },
             { icon: Gamepad2, label: "Esports & Gaming" }
           ].map((item) => (
             <Card key={item.label} className="text-center p-6 hover:bg-slate-50 transition-colors cursor-pointer">
               <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                 <item.icon className="h-6 w-6" />
               </div>
               <h3 className="font-bold">{item.label}</h3>
             </Card>
           ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default StudentLife;
