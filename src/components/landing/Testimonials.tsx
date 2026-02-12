import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Data Science Instructor",
    quote: "Classroom made it incredibly easy to launch my first course. The AI content generation saved me weeks of writing.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Student",
    quote: "The learning experience is smooth and intuitive. I love the progress tracking and certificates — they keep me motivated.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Language Teacher",
    quote: "I went from idea to published course in a single afternoon. The assignment and grading system is exactly what I needed.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by instructors and students
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our community has to say about Classroom.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground">"{t.quote}"</p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
