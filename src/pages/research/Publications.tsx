import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

const publications = [
  { title: "Quantum Entanglement in Macroscopic Systems", author: "Dr. A. Voss, et al.", journal: "Nature Physics", year: "2025" },
  { title: "Ethical Frameworks for Autonomous Vehicles", author: "Prof. Sarah Jenkins", journal: "AI & Society", year: "2025" },
  { title: "CRISPR Applications in Tropical Agriculture", author: "Dr. R. Patel", journal: "Science", year: "2024" },
  { title: "Urban Planning for Post-Pandemic Cities", author: "L. Chen, M. Arch", journal: "Journal of Urban Design", year: "2024" },
];

const Publications = () => {
  return (
    <PageLayout 
      title="Publications" 
      description="The latest scholarly output from our faculty and researchers."
      backgroundImage="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {publications.map((p, i) => (
            <Card key={i} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-6 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{p.title}</h3>
                    <p className="text-muted-foreground">{p.author}</p>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{p.journal} • {p.year}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Download className="h-5 w-5" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Publications;
