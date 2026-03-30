import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ShieldCheck, Users, ArrowRight } from "lucide-react";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";

const steps = [
  {
    title: "Understand our pedagogy",
    body: "Review GUI’s curriculum standards, AI-assisted course design tools, and the institutional quality frameworks we follow.",
    icon: ShieldCheck,
  },
  {
    title: "Design your course",
    body: "Use the instructor portal to sketch the syllabus, generate lessons, and create assessments with AI guidance so you can focus on facilitation.",
    icon: ClipboardList,
  },
  {
    title: "Submit for review",
    body: "Publish a draft and invite the academic office to approve it. Once approved you receive a faculty badge and students can enroll immediately.",
    icon: GraduationCapIcon,
  },
];

const TeachAtGui = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-br from-slate-900 to-slate-800 py-28 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl text-center space-y-6">
            <Badge className="border border-white/30 bg-white/10 uppercase tracking-[0.4em] text-xs text-white/80">
              Teach at GUI
            </Badge>
            <h1 className="text-4xl font-display font-bold sm:text-5xl">
              Join Global University Institute as an instructional partner
            </h1>
            <p className="text-lg text-white/80">
              We invite experienced educators, researchers, and industry experts to co-create accredited curriculum. This page walks you through the application, review, and onboarding process so you can focus on teaching.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-white text-slate-900 font-bold px-8 py-3 shadow-lg">
                See the current openings
              </Button>
              <Link to="/instructor/register" className="flex items-center gap-2 text-sm uppercase tracking-widest text-white/80 hover:text-white">
                Apply now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="h-full border border-border shadow-lg hover:border-primary/50 transition">
              <CardHeader className="flex items-center gap-3 pb-0">
                <step.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-3 text-sm text-muted-foreground">
                <p>{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="bg-gradient-to-br from-primary/80 to-primary/50 border-none text-white">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Our faculty community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>
                  Once approved, you join the GUI mentor network, get paired with course coordinators, and receive dedicated support for student engagement, assessments, and publishing.
                </p>
                <p>
                  We handle enrollment logistics, accreditation paperwork, and platform training so you can deliver with confidence.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/90 border-none text-slate-900">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  Safety & support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>We provide live training, 24/7 platform monitoring, AI-assisted grading review, and institutional compliance oversight.</p>
                <p>Every partner receives a personalized dashboard, revenue dashboard, and curriculum strategist so you can track performance in real time.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl border border-border bg-card/90 p-10 shadow-xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Ready to teach?</h2>
          <p className="mt-4 text-muted-foreground">
            Submit the form, upload your CV, and we will walk you through the credential verification, contract drafting, and course activation steps.
          </p>
          <Link to="/instructor/register">
            <Button className="mt-8 bg-primary text-white px-10 py-3 text-lg font-bold">
              Start the GUI instructor journey
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default TeachAtGui;
