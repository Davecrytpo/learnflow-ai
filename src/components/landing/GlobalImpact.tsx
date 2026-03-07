import { motion } from "framer-motion";
import { Globe, Users, Building2, Award } from "lucide-react";

const impacts = [
  { icon: Globe, val: "142", label: "Countries with GUI Alumni", desc: "Our graduates serve in leadership roles across every continent" },
  { icon: Users, val: "85,000+", label: "Living Alumni Network", desc: "A global community of scholars and professionals" },
  { icon: Building2, val: "340+", label: "Partner Institutions", desc: "Exchange programs and joint research with top universities" },
  { icon: Award, val: "12", label: "Nobel Prize Winners", desc: "Faculty and alumni recognized at the highest level" },
];

const GlobalImpact = () => (
  <section className="py-28 bg-secondary/20">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Global Reach</p>
        <h2 className="text-4xl font-bold text-foreground md:text-5xl mb-4">
          A World of Impact
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          From groundbreaking research to transformative education, our influence extends to every corner of the globe.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {impacts.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <item.icon className="h-7 w-7" />
            </div>
            <p className="text-3xl font-bold text-foreground">{item.val}</p>
            <p className="mt-1 text-sm font-bold text-foreground">{item.label}</p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default GlobalImpact;
