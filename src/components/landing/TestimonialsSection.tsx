import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Global University Institute didn't just give me a degree — it gave me the confidence, the network, and the vision to build something meaningful. The research opportunities here are unparalleled.",
    name: "Dr. Amara Osei",
    role: "CEO, BioGenesis Labs",
    grad: "Class of 2018, Faculty of Medicine",
    avatar: "A",
  },
  {
    quote: "The interdisciplinary approach at GUI allowed me to combine my passion for AI with public policy. I'm now helping shape technology regulation at the United Nations.",
    name: "James Rivera",
    role: "Senior Policy Advisor, United Nations",
    grad: "Class of 2020, Faculty of Law",
    avatar: "J",
  },
  {
    quote: "What makes this institution special is the mentorship. Every professor I worked with genuinely cared about my growth — both academically and personally.",
    name: "Prof. Lena Johansson",
    role: "Research Fellow, CERN",
    grad: "Class of 2015, Faculty of Physical Sciences",
    avatar: "L",
  },
];

const TestimonialsSection = () => (
  <section className="py-28 bg-secondary/20">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Student & Alumni Voices</p>
        <h2 className="text-4xl font-bold text-foreground md:text-5xl">
          Stories of Impact
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative rounded-2xl bg-card border border-border p-8 shadow-sm"
          >
            <Quote className="h-8 w-8 text-primary/20 mb-4" />
            <p className="text-sm text-foreground leading-relaxed italic mb-8">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-primary">{t.role}</p>
                <p className="text-[10px] text-muted-foreground">{t.grad}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
