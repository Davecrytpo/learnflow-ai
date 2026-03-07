import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Microscope, Briefcase, Scale } from "lucide-react";
import { Link } from "react-router-dom";

const schools = [
  { title: "School of Medicine", icon: Microscope, description: "Pioneering medical research and patient care." },
  { title: "Business School", icon: Briefcase, description: "Developing leaders for the global marketplace." },
  { title: "Law School", icon: Scale, description: "Advocating for justice and policy reform." },
];

const Graduate = () => {
  return (
    <PageLayout 
      title="Graduate & Professional Schools" 
      description="Advance your career with our top-ranked master's and doctoral programs."
      backgroundImage="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          <section className="text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">Excellence in Advanced Study</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Global University Institute offers over 80 graduate programs across our professional schools. 
              Our interdisciplinary approach allows you to collaborate with experts in diverse fields to solve real-world problems.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-8">
            {schools.map((s) => (
              <Card key={s.title} className="text-center hover:shadow-lg transition-all border-t-4 border-t-primary">
                <CardHeader>
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <s.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{s.description}</p>
                  <Button variant="link" className="text-primary" asChild>
                    <Link to="/academics/catalog">Explore Programs</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-display font-bold mb-6">Research Funding Opportunities</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              We provide over $50 million in annual research grants and fellowships for graduate students.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
                <Link to="/research/grants">View Grants</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/admissions/tuition">Tuition & Aid</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Graduate;
