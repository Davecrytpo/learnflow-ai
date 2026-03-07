import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-campus.jpg"
          alt="Global University Institute Campus"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-5xl"
        >
          <h1 className="text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-[7rem]">
            Where Knowledge
            <br />
            <span className="italic font-normal">Shapes the Future</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl"
          >
            Global University Institute is a world-renowned academic institution dedicated to
            research excellence, innovative teaching, and preparing leaders for a changing world.
          </motion.p>

          {/* Search bar - like Harvard/MIT style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
              }}
              className="relative"
            >
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="What do you want to study?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 w-full rounded-full border border-white/20 bg-white/10 pl-14 pr-40 text-lg text-white placeholder-white/40 backdrop-blur-xl transition-all focus:border-white/40 focus:bg-white/15 focus:outline-none"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 h-12 -translate-y-1/2 rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-lg hover:opacity-90"
              >
                Search <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>

          {/* Quick action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/25 px-8 text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate("/signup")}
            >
              Apply Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/25 px-8 text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate("/courses")}
            >
              Explore Programs
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/25 px-8 text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate("/about")}
            >
              Visit Campus
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Explore</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
