import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Users, BarChart3, Settings, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPortal = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pt-28 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-8">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admin Portal</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground">Govern the platform with enterprise controls</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Manage roles, content, and compliance with audit visibility and strict access control.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-brand text-primary-foreground">
              <Link to="/login">Admin Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/about">Learn about security</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { icon: Shield, title: "Access Control", body: "Role-based access and RLS policies across all content." },
          { icon: Users, title: "User Management", body: "Manage users, roles, and activity at scale." },
          { icon: BarChart3, title: "System Analytics", body: "Track usage, enrollments, and performance trends." },
          { icon: Activity, title: "Audit Logs", body: "Visibility into critical actions for compliance." },
          { icon: Settings, title: "Governance", body: "Moderate courses and enforce institutional policies." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card/90 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
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

export default AdminPortal;
