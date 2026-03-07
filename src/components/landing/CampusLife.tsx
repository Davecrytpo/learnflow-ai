import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CampusLife = () => (
  <section className="relative py-32 overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="/images/campus-life.jpg"
        alt="Campus life at Global University Institute"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
    </div>

    <div className="container relative z-10 mx-auto px-6">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Life on Campus</p>
          <h2 className="text-4xl font-bold text-white md:text-6xl mb-6">
            More Than <br />
            <span className="italic font-normal">an Education</span>
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            From 200+ student clubs and organizations to state-of-the-art athletic facilities,
            world-class libraries, and vibrant cultural events — life at Global University Institute
            is an experience that shapes who you become.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-10">
            {[
              { val: "200+", label: "Student Clubs" },
              { val: "42", label: "Sports Teams" },
              { val: "18", label: "Research Centers" },
              { val: "12", label: "Libraries" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary">{stat.val}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="h-14 rounded-full bg-primary px-10 font-semibold text-primary-foreground shadow-xl hover:opacity-90"
            asChild
          >
            <Link to="/about">
              Discover Campus Life <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CampusLife;
