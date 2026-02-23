import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { GraduationCap, ClipboardCheck, BarChart3, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const InstructorPortal = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pt-28 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-8">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Instructor Portal</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground">Build courses, grade faster, and scale learning</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            A modern instructor workspace with curriculum tools, assessments, attendance, and analytics built in.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-brand text-primary-foreground">
              <Link to="/signup?role=instructor">Create Instructor Account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login?role=instructor">Instructor Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { icon: GraduationCap, title: "Course Builder", body: "Create modules, lessons, resources, and assessments in one place." },
          { icon: ClipboardCheck, title: "Grading Queue", body: "Grade submissions quickly with a focused, unified queue." },
          { icon: BarChart3, title: "Analytics", body: "Track enrollment, progress, and completion trends." },
          { icon: Users, title: "Cohorts", body: "Manage groups and track attendance per session." },
          { icon: Shield, title: "Security", body: "Role-based access and audit-ready data controls." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card/90 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>
    </main>
    <Footer />
  </div>
);

export default InstructorPortal;
