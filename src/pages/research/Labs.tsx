import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

const Labs = () => {
  return (
    <PageLayout 
      title="Laboratories & Facilities" 
      description="State-of-the-art infrastructure powering breakthrough discoveries."
      backgroundImage="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden group cursor-pointer">
              <div className="h-48 bg-slate-200 relative">
                 <img src={`https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=400&h=300`} alt="Lab" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Advanced Materials Lab {i}</h3>
                <p className="text-sm text-muted-foreground">Focused on nanotechnology and smart materials synthesis.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Labs;
