import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, TrendingUp, Calendar, ClipboardCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const StudentPortal = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pt-28 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-8">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Student Portal</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground">Learn smarter with a focused student workspace</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Enroll, track progress, submit assignments, and earn certificates with a clean, modern LMS built for students.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-brand text-primary-foreground">
              <Link to="/signup?role=student">Create Student Account</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login?role=student">Student Login</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { icon: BookOpen, title: "Course Access", body: "Browse catalog, enroll instantly, and resume from any device.", link: "/courses", label: "Browse Catalog" },
          { icon: ClipboardCheck, title: "Assessments", body: "Take quizzes, submit assignments, and see real-time grades.", link: "/dashboard/assignments", label: "View Tasks" },
          { icon: Award, title: "Certificates", body: "Earn and share verifiable certificates when you complete a course.", link: "/dashboard/certificates", label: "My Credentials" },
          { icon: TrendingUp, title: "Progress", body: "Track completion rate, milestones, and growth over time.", link: "/dashboard/progress", label: "Track Growth" },
          { icon: Calendar, title: "Deadlines", body: "Stay on top of upcoming deadlines with a built-in calendar.", link: "/dashboard/calendar", label: "Open Calendar" },
        ].map((f) => (
          <div key={f.title} className="flex flex-col rounded-2xl border border-border bg-card/90 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{f.body}</p>
            <Button asChild variant="ghost" size="sm" className="mt-4 w-fit text-primary gap-2">
              <Link to={f.link}>{f.label} <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
        ))}
      </section>
    </main>
    <Footer />
  </div>
);

export default StudentPortal;
