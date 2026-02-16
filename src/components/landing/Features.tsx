import { Sparkles, BarChart3, Award, Users, BookOpen, ClipboardCheck, GraduationCap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content Creation",
    description: "Generate course outlines, lesson content, and quiz questions with AI. Build entire courses in minutes, not weeks.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ClipboardCheck,
    title: "Assessments & Examinations",
    description: "Create exercises, quizzes, tests, and final exams. Auto-grade multiple choice or manually grade short answers.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track student progress, enrollment trends, completion rates, and performance metrics with real-time dashboards.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Award,
    title: "Digital Certificates",
    description: "Auto-generate professional PDF certificates when students complete courses. Verifiable with unique certificate IDs.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Role-Based Access Control",
    description: "Separate dashboards for students, instructors, and administrators. Fine-grained permissions for every action.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BookOpen,
    title: "Rich Course Content",
    description: "Markdown lessons, video embeds, file uploads, and structured modules. Everything you need for a complete curriculum.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: GraduationCap,
    title: "US Education Standards",
    description: "Designed to meet K-12 and higher education standards. Grade levels, subject areas, and institutional tracking built in.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Row-level security, encrypted data, role-based access, and audit trails. Your institution's data is safe.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const Features = () => {
  return (
    <section id="features" className="border-t border-border bg-card/50 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Platform Features</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything your institution needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete learning management system — 100% free for educators and students.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${feature.bg}`}>
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
