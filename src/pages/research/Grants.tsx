import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Grants = () => {
  return (
    <PageLayout 
      title="Grants & Funding" 
      description="Supporting innovative research through internal and external funding."
      backgroundImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
           <div className="space-y-6">
             <h2 className="text-3xl font-display font-bold">Find Funding</h2>
             <p className="text-lg text-muted-foreground">
               We offer a comprehensive database of grant opportunities for faculty, postdocs, and students.
             </p>
             <Card>
               <CardHeader>
                 <CardTitle>Internal Seed Grants</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground mb-4">Up to $50,000 for early-stage research projects.</p>
                 <Button variant="outline">Learn More</Button>
               </CardContent>
             </Card>
             <Card>
               <CardHeader>
                 <CardTitle>Travel Grants</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground mb-4">Funding for conference presentations and field work.</p>
                 <Button variant="outline">Learn More</Button>
               </CardContent>
             </Card>
           </div>
           
           <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
             <h3 className="text-xl font-bold mb-4">Office of Sponsored Programs</h3>
             <p className="text-muted-foreground mb-6">
               Our team helps you navigate the grant application process, from proposal development to post-award management.
             </p>
             <Button className="w-full bg-primary text-primary-foreground">Contact OSP</Button>
           </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Grants;
