import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const steps = [
// ... existing steps ...
  { icon: BookOpen, step: "01", title: "Enroll or Create", description: "Students browse and enroll. Instructors build structured courses with modules, lessons, and rich media.", color: "from-primary to-emerald-400" },
  { icon: ClipboardCheck, step: "02", title: "Learn and Assess", description: "Work through lessons, take quizzes, submit assignments, and track progress in real time.", color: "from-accent to-amber-300" },
  { icon: Award, step: "03", title: "Earn and Verify", description: "Complete requirements and receive a digitally-signed certificate with a verification ID.", color: "from-emerald-500 to-teal-400" },
];

const HowItWorks = () => (
  <section className="border-t border-border py-28">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">How It Works</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Three steps to mastery
        </h2>
      </motion.div>

      <div className="mx-auto mt-20 max-w-5xl">
        <div className="relative grid gap-12 md:grid-cols-3">
          <div className="absolute left-1/4 right-1/4 top-8 hidden h-px bg-gradient-to-r from-primary/20 via-accent/20 to-emerald-500/20 md:block" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative text-center"
            >
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-xl`}>
                <s.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border text-[10px] font-bold text-muted-foreground">
                {i + 1}
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <Link to="/signup" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80">
            Begin your journey <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

const RoleGate = () => (
  <section className="border-t border-border py-24">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Get Started</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Tailored Learning Portals
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Built with Moodle-inspired role separation. Instructors build, students learn, admins govern.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card/90 p-6 flex flex-col">
          <Badge className="w-fit mb-4 bg-primary/10 text-primary border-none">Student</Badge>
          <h3 className="font-display text-2xl font-bold text-foreground">Student Portal</h3>
          <p className="mt-2 text-sm text-muted-foreground flex-1">
            Browse our 2,800+ course catalog, track your academic progress, and earn verifiable certificates.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild className="bg-gradient-brand text-primary-foreground">
              <Link to="/student">Enter Student Hub</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login?role=student">Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card/90 p-6 flex flex-col">
          <Badge className="w-fit mb-4 bg-accent/10 text-accent border-none">Instructor</Badge>
          <h3 className="font-display text-2xl font-bold text-foreground">Instructor Hub</h3>
          <p className="mt-2 text-sm text-muted-foreground flex-1">
            Build modules, lessons, and AI-assisted assessments. Manage cohorts and live sessions.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild className="bg-gradient-brand text-primary-foreground">
              <Link to="/instructor-portal">Instructor Hub</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login?role=instructor">Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card/90 p-6 flex flex-col">
          <Badge className="w-fit mb-4 bg-emerald-500/10 text-emerald-600 border-none">Academy</Badge>
          <h3 className="font-display text-2xl font-bold text-foreground">Learnflow Academy</h3>
          <p className="mt-2 text-sm text-muted-foreground flex-1">
            Professional development hub. Get certified in LMS management and modern pedagogy.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild className="bg-gradient-brand text-primary-foreground">
              <Link to="/academy">Explore Academy</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/news">Latest News</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);


const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main id="main-content">
      <Hero />
      <RoleGate />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default Index;
