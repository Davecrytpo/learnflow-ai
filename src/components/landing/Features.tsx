import { Sparkles, BarChart3, Award, Users, BookOpen, ClipboardCheck, GraduationCap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Generate course outlines, lesson content, and quiz questions with AI assistance.",
  },
  {
    icon: ClipboardCheck,
    title: "Full Assessment Suite",
    description: "Exercises, quizzes, tests, and final examinations with auto-grading support.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track enrollment, progress, completion rates, and performance metrics live.",
  },
  {
    icon: Award,
    title: "Digital Certificates",
    description: "Auto-generate verifiable PDF certificates upon course completion.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Dedicated dashboards for students, instructors, and administrators.",
  },
  {
    icon: BookOpen,
    title: "Rich Curriculum",
    description: "Markdown lessons, video embeds, file uploads, and modular course structure.",
  },
  {
    icon: GraduationCap,
    title: "US Education Standards",
    description: "Grade levels, subject areas, and institutional tracking for K-12 & higher ed.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Row-level security, encrypted data, and comprehensive audit trails.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative overflow-hidden py-28">
      {/* Subtle bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(220_90%_53%/0.03),transparent_70%)]" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-3.5 w-3.5" />
            Enterprise-Grade Platform
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Everything your institution needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete LMS — 100% free for educators and students, with no compromises.
          </p>
        </motion.div>

        <div className="mx-auto mt-20 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Gradient hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${i % 2 === 0 ? "bg-primary/10" : "bg-accent/10"}`}>
                  <feature.icon className={`h-6 w-6 ${i % 2 === 0 ? "text-primary" : "text-accent"}`} />
                </div>
                <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
