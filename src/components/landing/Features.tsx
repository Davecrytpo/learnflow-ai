import { motion } from "framer-motion";
import { Sparkles, BarChart3, Award, Users, BookOpen, ClipboardCheck, GraduationCap, Shield, Zap, Brain, FileCheck, Globe } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Creation", description: "Generate complete course outlines, lesson content, and assessments with built-in AI assistance.", tag: "AI" },
  { icon: ClipboardCheck, title: "Full Assessment Suite", description: "Exercises, quizzes, tests, and final exams. Auto-grade MCQ or manually review short answers.", tag: "Core" },
  { icon: BarChart3, title: "Live Analytics", description: "Track student progress, enrollment trends, completion rates, and performance in real time.", tag: "Analytics" },
  { icon: Award, title: "Digital Certificates", description: "Professionally designed certificates auto-generated upon completion with verifiable IDs.", tag: "Certification" },
  { icon: Users, title: "Role-Based Access", description: "Separate, purpose-built dashboards for students, instructors, and platform administrators.", tag: "Security" },
  { icon: BookOpen, title: "Rich Curriculum Builder", description: "Markdown lessons, video embeds, structured modules, and file attachments.", tag: "Content" },
  { icon: GraduationCap, title: "US Education Standards", description: "Grade levels, subject areas, and institutional tracking for K-12 and higher education.", tag: "Compliance" },
  { icon: Shield, title: "Enterprise Security", description: "Row-level security, encrypted data storage, role-based permissions, and audit trails.", tag: "Security" },
];

const Features = () => (
  <section id="features" className="relative overflow-hidden border-t border-border py-28">
    <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.02]" />

    <div className="container relative mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Platform Capabilities</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Built for the{" "}
          <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
            Serious Educator
          </span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Everything you need to deliver world-class education — without the enterprise price tag.
        </p>
      </motion.div>

      <div className="mx-auto mt-20 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary/50`}>
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
