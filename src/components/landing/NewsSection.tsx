import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const newsItems = [
  {
    category: "Research Breakthrough",
    title: "New AI Model Achieves Human-Level Reasoning in Medical Diagnostics",
    excerpt: "Researchers at Global University Institute have developed an artificial intelligence system that matches expert physicians in diagnosing complex medical conditions.",
    image: "/images/research-lab.jpg",
    date: "March 5, 2026",
    featured: true,
  },
  {
    category: "Campus Life",
    title: "Spring Semester Welcomes Record 3,200 International Students",
    excerpt: "Students from 142 countries join our diverse academic community.",
    image: "/images/campus-life.jpg",
    date: "March 3, 2026",
  },
  {
    category: "Academic Excellence",
    title: "Faculty of Engineering Ranked #3 Globally in AI Research",
    excerpt: "The latest QS rankings place our engineering programs among the world's best.",
    image: "/images/lecture-hall.jpg",
    date: "February 28, 2026",
  },
  {
    category: "Alumni Impact",
    title: "Class of 2025 Achieves 98% Employment Rate Within 6 Months",
    excerpt: "Our graduates continue to lead in career placement across all disciplines.",
    image: "/images/graduation.jpg",
    date: "February 25, 2026",
  },
];

const NewsSection = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Latest News</p>
          <h2 className="text-4xl font-bold text-foreground md:text-5xl">Stories & Updates</h2>
        </div>
        <Link
          to="/news"
          className="hidden items-center gap-2 text-sm font-bold text-primary hover:underline md:flex"
        >
          View All News <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Featured article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group"
        >
          <Link to="/news" className="block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={newsItems[0].image}
                alt={newsItems[0].title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  {newsItems[0].category}
                </span>
                <h3 className="text-2xl font-bold text-white lg:text-3xl">{newsItems[0].title}</h3>
                <p className="mt-3 text-sm text-white/70 line-clamp-2">{newsItems[0].excerpt}</p>
                <p className="mt-4 text-xs text-white/50">{newsItems[0].date}</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Secondary articles */}
        <div className="flex flex-col gap-6">
          {newsItems.slice(1).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to="/news" className="group flex gap-5">
                <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {item.category}
                  </span>
                  <h4 className="mt-1 text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p>
                  <p className="mt-2 text-[10px] text-muted-foreground">{item.date}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Link
        to="/news"
        className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline md:hidden"
      >
        View All News <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </section>
);

export default NewsSection;
