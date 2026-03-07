import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Loader2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      const { data } = await supabase
        .from("courses")
        .select("id, title, category, slug")
        .ilike("title", `%${searchQuery}%`)
        .limit(5);
      
      setSuggestions(data || []);
      setIsSearching(false);
      setShowSuggestions(true);
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
            className="mx-auto mt-10 max-w-xl relative"
            ref={searchRef}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) navigate(`/academics/catalog?search=${encodeURIComponent(searchQuery)}`);
              }}
              className="relative"
            >
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="What do you want to study?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                className="h-16 w-full rounded-full border border-white/20 bg-white/10 pl-14 pr-40 text-lg text-white placeholder-white/40 backdrop-blur-xl transition-all focus:border-white/40 focus:bg-white/15 focus:outline-none"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 h-12 -translate-y-1/2 rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-lg hover:opacity-90"
              >
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Search <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden text-left"
                >
                  <div className="p-2 border-b border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 px-2">Suggestions</p>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          navigate(`/course/${s.id}`);
                          setShowSuggestions(false);
                        }}
                        className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold truncate text-white">{s.title}</p>
                          <p className="text-[10px] text-white/60 uppercase tracking-widest">{s.category}</p>
                        </div>
                      </button>
                    ))}
                    {suggestions.length === 0 && !isSearching && (
                      <div className="p-4 text-center text-sm text-white/50">
                        No matches found.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
              onClick={() => navigate("/academics/catalog")}
            >
              Explore Programs
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/25 px-8 text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate("/admissions/visit")}
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
