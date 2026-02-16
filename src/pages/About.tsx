import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { GraduationCap, Target, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  { icon: Target, title: "Mission-Driven", description: "We believe quality education should be accessible to everyone, regardless of economic background." },
  { icon: Heart, title: "Student-First", description: "Every feature is designed with the learner experience in mind, from progress tracking to certificates." },
  { icon: Globe, title: "Global Access", description: "Built to serve learners and educators worldwide, with support for US educational standards." },
  { icon: GraduationCap, title: "Academic Excellence", description: "Our assessment system supports exercises, quizzes, tests, and examinations for rigorous academic programs." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              About <span className="text-primary">Classroom</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Classroom is a comprehensive, free learning management system built for modern education.
              We empower educators to create engaging courses and students to achieve their academic goals — 
              all without any cost barriers.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border bg-card/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground">Our Values</h2>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-background p-6"
              >
                <v.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
