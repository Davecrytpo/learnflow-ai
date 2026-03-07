import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Leaf, Atom, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const centers = [
  { title: "Center for Artificial Intelligence", icon: Brain, description: "Advancing machine learning and ethical AI.", color: "text-rose-500", bg: "bg-rose-50" },
  { title: "Sustainable Energy Institute", icon: Leaf, description: "Developing renewable energy solutions.", color: "text-emerald-500", bg: "bg-emerald-50" },
  { title: "Quantum Computing Lab", icon: Atom, description: "Exploring the next frontier of computation.", color: "text-blue-500", bg: "bg-blue-50" },
  { title: "Global Health Initiative", icon: Activity, description: "Improving healthcare access worldwide.", color: "text-purple-500", bg: "bg-purple-50" },
];

const ResearchCenters = () => {
  return (
    <PageLayout 
      title="Research Centers & Institutes" 
      description="Hubs of interdisciplinary collaboration addressing the world's most pressing challenges."
      backgroundImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {centers.map((c) => (
            <Card key={c.title} className="flex flex-col md:flex-row gap-6 p-6 hover:shadow-lg transition-all items-start">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 ${c.bg}`}>
                <c.icon className={`h-8 w-8 ${c.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display mb-2">{c.title}</h3>
                <p className="text-muted-foreground mb-4">{c.description}</p>
                <Button variant="outline" size="sm" asChild>
                   <Link to="#">Visit Website</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ResearchCenters;
