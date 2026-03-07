import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const programs = [
  { title: "Computer Science", description: "Master the foundations of computing and AI." },
  { title: "Business Administration", description: "Prepare for leadership in the global economy." },
  { title: "Psychology", description: "Understand the human mind and behavior." },
  { title: "Engineering", description: "Build the future with sustainable solutions." },
  { title: "Biology", description: "Explore the science of life and living organisms." },
  { title: "Economics", description: "Analyze complex systems and market trends." },
];

const Undergraduate = () => {
  return (
    <PageLayout 
      title="Undergraduate Programs" 
      description="Embark on a journey of discovery with our world-class bachelor's degree programs."
      backgroundImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">Why Choose GUI?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our undergraduate curriculum is designed to foster critical thinking, creativity, and ethical leadership. 
                With a student-to-faculty ratio of 12:1, you receive personalized attention from world-renowned scholars.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Global Perspective</h3>
                    <p className="text-sm text-muted-foreground">Study abroad opportunities in over 40 countries.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Vibrant Community</h3>
                    <p className="text-sm text-muted-foreground">Join 200+ student organizations and clubs.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-display font-bold text-foreground mb-8">Popular Majors</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {programs.map((p) => (
                  <Card key={p.title} className="hover:border-primary/40 transition-colors cursor-pointer group">
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{p.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="outline" asChild>
                  <Link to="/academics/catalog">View All Programs <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-24">
              <h3 className="font-display font-bold text-xl mb-4">Admissions Overview</h3>
              <ul className="space-y-4 mb-6">
                <li className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Application Deadline</span>
                  <span className="font-medium">Jan 15, 2027</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Early Decision</span>
                  <span className="font-medium">Nov 1, 2026</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Acceptance Rate</span>
                  <span className="font-medium">12%</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-brand text-primary-foreground" asChild>
                <Link to="/admissions/apply">Apply Now</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Questions? <Link to="/admissions/contact" className="text-primary hover:underline">Contact Admissions</Link>
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
              <BookOpen className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Request Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Want to learn more about our programs and campus life?
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact">Get Brochure</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Undergraduate;
