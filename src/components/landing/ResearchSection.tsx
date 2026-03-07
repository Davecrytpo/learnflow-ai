import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Award, Beaker, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    icon: Beaker,
    title: "Quantum Computing Breakthrough",
    desc: "Our Physics department achieved a 99.9% qubit fidelity rate, setting a new world record in quantum error correction.",
    tag: "Physics",
  },
  {
    icon: Globe,
    title: "Climate Action Initiative",
    desc: "A cross-faculty initiative mapping the impact of rising sea levels on coastal communities across 45 nations.",
    tag: "Environmental Science",
  },
  {
    icon: BookOpenCheck,
    title: "AI Ethics Framework",
    desc: "Published the most cited paper of 2025 on responsible AI governance, now adopted by 30+ governments worldwide.",
    tag: "Computer Science",
  },
  {
    icon: Award,
    title: "Nobel Prize in Medicine",
    desc: "Prof. Sarah Chen awarded the 2025 Nobel Prize for her pioneering work in gene therapy for neurodegenerative diseases.",
    tag: "Medicine",
  },
];

const ResearchSection = () => (
  <section className="py-28 bg-background">
    <div className="container mx-auto px-6">
      <div className="grid gap-16 lg:grid-cols-2 items-start">
        {/* Left: intro */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Research & Innovation</p>
          <h2 className="text-4xl font-bold text-foreground md:text-5xl mb-6">
            Pushing the Boundaries of Human Knowledge
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            With $420 million in annual research funding and 18 dedicated research centers,
            our faculty and students are at the forefront of discoveries that change the world.
          </p>

          <div className="relative overflow-hidden rounded-2xl mb-8">
            <img
              src="/images/research-lab.jpg"
              alt="Research laboratory"
              className="h-64 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <blockquote className="text-white italic text-sm">
                "We use genes that are mutated in disease to uncover fundamental biology that benefits all of humanity."
              </blockquote>
              <p className="mt-2 text-xs text-white/60">— Prof. Sarah Chen, Nobel Laureate</p>
            </div>
          </div>

          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/about">
              Explore Our Research <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Right: highlights */}
        <div className="space-y-5">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all hover:border-primary/30"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <h.icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{h.tag}</span>
                  <h4 className="mt-1 text-base font-bold text-foreground group-hover:text-primary transition-colors">{h.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ResearchSection;
