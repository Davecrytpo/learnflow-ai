import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    { icon: BookOpen, title: "Create or Enroll", description: "Instructors create structured courses with modules and lessons. Students browse and enroll for free.", color: "bg-primary/10 text-primary" },
    { icon: ClipboardCheck, title: "Learn & Assess", description: "Complete lessons, take quizzes and exams. Track your progress in real-time from your personal dashboard.", color: "bg-accent/10 text-accent" },
    { icon: Award, title: "Earn Certificates", description: "Complete all course requirements and receive a verifiable digital certificate of achievement.", color: "bg-primary/10 text-primary" },
  ];

  return (
    <section className="border-t border-border py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground">Three simple steps to get started</p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-6 top-8 hidden h-5 w-5 text-border md:block" />
              )}
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${step.color.split(" ")[0]}`}>
                <step.icon className={`h-7 w-7 ${step.color.split(" ")[1]}`} />
              </div>
              <div className="mx-auto mt-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/signup" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Get started now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
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
};

export default Index;
