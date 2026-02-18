import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  { icon: BookOpen, step: "01", title: "Enroll or Create", description: "Students browse and enroll for free. Instructors build structured courses with modules, lessons, and rich media.", color: "from-primary to-blue-600" },
  { icon: ClipboardCheck, step: "02", title: "Learn & Assess", description: "Work through lessons, take exercises and quizzes, sit for tests and final examinations — all tracked in real-time.", color: "from-accent to-orange-500" },
  { icon: Award, step: "03", title: "Earn & Verify", description: "Complete all requirements and receive a digitally-signed certificate with a unique verification ID.", color: "from-violet-500 to-purple-600" },
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
          {/* Connecting line */}
          <div className="absolute left-1/4 right-1/4 top-8 hidden h-px bg-gradient-to-r from-primary/20 via-accent/20 to-violet-500/20 md:block" />

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

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </main>
    <Footer />
  </div>
);

export default Index;
