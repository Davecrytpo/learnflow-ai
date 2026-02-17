import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "CS Professor, MIT",
    initials: "SC",
    quote: "Classroom transformed how I deliver my courses. The AI content generation saved me weeks, and the assessment system is robust enough for university-level examinations.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Student, California",
    initials: "MJ",
    quote: "The progress tracking and certificates keep me motivated. I've completed 8 courses and each certificate looks truly professional.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "K-12 Educator, Texas",
    initials: "ER",
    quote: "Finally an LMS that meets US education standards without the enterprise price tag. The quiz and exam system is exactly what my students need.",
    rating: 5,
  },
  {
    name: "Dr. James Wright",
    role: "Dean of Students, NYU",
    initials: "JW",
    quote: "We rolled this out to 3,000 students in under a week. The admin dashboard gives us complete visibility into every course and student outcome.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden border-t border-border bg-card/30 py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
            <Star className="h-3.5 w-3.5 fill-accent" />
            Loved by Educators
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Trusted by 10,000+ users
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from the educators and students who use Classroom every day.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/8" />
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
