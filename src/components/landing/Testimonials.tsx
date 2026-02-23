import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Professor of Computer Science",
    org: "MIT",
    initials: "SC",
    color: "from-primary to-violet-400",
    quote: "Learnflow AI fundamentally changed how I structure my courses. The AI content generation and the exam system are robust enough for graduate-level work. My students are more engaged than ever.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "High School Student",
    org: "California",
    initials: "MJ",
    color: "from-accent to-orange-400",
    quote: "I've earned 12 certificates through Learnflow AI. The progress tracking keeps me accountable and the dashboards are actually fun to look at — not like the old boring LMS systems.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "District Curriculum Director",
    org: "Dallas ISD, Texas",
    initials: "ER",
    color: "from-emerald-400 to-teal-500",
    quote: "We deployed Learnflow AI across 47 schools in under two weeks. The admin controls, reporting, and assessment flexibility is something we used to pay $200K/yr for. This is transformational.",
    rating: 5,
  },
  {
    name: "Dr. James Wright",
    role: "Dean of Academic Affairs",
    org: "NYU School of Education",
    initials: "JW",
    color: "from-violet-400 to-purple-500",
    quote: "The depth of the platform surprised us. Certificate verification, institutional tracking, role management — everything institutions actually need, done right.",
    rating: 5,
  },
];

const Testimonials = () => (
  <section className="relative overflow-hidden py-28">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(213_94%_58%/0.04),transparent_70%)]" />

    <div className="container relative mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Testimonials</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Trusted by educators at every level
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          From individual teachers to entire school districts — Learnflow AI delivers.
        </p>
      </motion.div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* Top accent bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${t.color}`} />

            <div className="flex flex-1 flex-col p-6">
              <Quote className="mb-4 h-6 w-6 text-primary/20" />
              <p className="flex-1 text-sm leading-relaxed text-foreground/80">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-bold text-primary-foreground`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role} · {t.org}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3 w-3 fill-accent text-accent" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
