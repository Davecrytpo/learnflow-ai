import { motion } from "framer-motion";
import { BarChart3, Award, Users, BookOpen, ClipboardCheck, GraduationCap, Shield, Brain, Filter } from "lucide-react";
import { useMemo, useState } from "react";

const features = [
  { icon: Brain, title: "AI-Assisted Creation", description: "Generate outlines, lesson drafts, and assessments with built-in AI assistance.", tag: "AI" },
  { icon: ClipboardCheck, title: "Full Assessment Suite", description: "Exercises, quizzes, tests, and exams with rubrics and auto-grading where it fits.", tag: "Core" },
  { icon: BarChart3, title: "Live Analytics", description: "Track enrollment, progress, completion rates, and outcomes in real time.", tag: "Analytics" },
  { icon: Award, title: "Digital Certificates", description: "Automated certificates with verifiable IDs and shareable links.", tag: "Certification" },
  { icon: Users, title: "Role-Based Access", description: "Purpose-built dashboards for students, instructors, and administrators.", tag: "Security" },
  { icon: BookOpen, title: "Curriculum Builder", description: "Structured modules, video embeds, attachments, and rich content.", tag: "Content" },
  { icon: GraduationCap, title: "Outcomes Alignment", description: "Map courses to standards, grade levels, and institutional requirements.", tag: "Compliance" },
  { icon: Shield, title: "Enterprise Security", description: "Row-level security, audit trails, and role-based permissions by default.", tag: "Security" },
];

const Filters = ["All", "AI", "Core", "Analytics", "Certification", "Security", "Content", "Compliance"];

const Features = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = useMemo(() => {
    if (activeFilter === "All") return features;
    return features.filter((feature) => feature.tag === activeFilter);
  }, [activeFilter]);

  return (
    <section id="features" className="relative overflow-hidden border-t border-border py-28">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />

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
            <span className="gradient-text">serious educator</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Everything you need to deliver world-class education without the enterprise price tag.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2">
          {Filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                activeFilter === filter
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
              type="button"
            >
              {filter === "All" && <Filter className="h-3 w-3" />}
              {filter}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-secondary/50">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80"
                >
                  Explore capability
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
