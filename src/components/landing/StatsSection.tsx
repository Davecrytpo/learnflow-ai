import { motion } from "framer-motion";

const stats = [
  { value: "#12", label: "Global University Ranking", sub: "QS World Rankings 2026" },
  { value: "150+", label: "Distinguished Faculty", sub: "Including 12 Nobel Laureates" },
  { value: "45,000+", label: "Research Citations", sub: "Published Annually" },
  { value: "98%", label: "Graduate Employment", sub: "Within 6 Months" },
  { value: "142", label: "Countries Represented", sub: "A Truly Global Community" },
  { value: "$420M", label: "Research Funding", sub: "Annual Investment" },
];

const StatsSection = () => (
  <section className="py-20 bg-foreground text-background">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <p className="text-3xl font-bold text-primary lg:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm font-bold text-background/90">{stat.label}</p>
            <p className="mt-1 text-[10px] text-background/40 uppercase tracking-wider">{stat.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
