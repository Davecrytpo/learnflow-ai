import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BookOpen, Award, TrendingUp, Search, MapPin, Beaker, Calendar, Users, Loader2 } from "lucide-react";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";

import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const statsItems = [
  { value: "68K+", label: "Active Learners" },
  { value: "3,450+", label: "Courses Published" },
  { value: "97%", label: "Completion Rate" },
  { value: "180+", label: "Institutions" },
];

const quickLinks = [
  { label: "How to Apply", icon: GraduationCapIcon, href: "/admissions/apply" },

  { label: "Programs", icon: BookOpen, href: "/academics/undergraduate" },
  { label: "Research", icon: Beaker, href: "/research/centers" },
  { label: "Visit Campus", icon: MapPin, href: "/admissions/visit" },
  { label: "Events", icon: Calendar, href: "/campus/events" },
  { label: "Student Life", icon: Users, href: "/campus/student-life" },
];

const Hero = () => {
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-20">
      <div className="absolute inset-0 bg-aurora" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-[0.05]" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.05]" />
      <div className="absolute inset-0 bg-grain opacity-30 mix-blend-soft-light" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary">
            <Zap className="h-3.5 w-3.5 fill-primary" />
            The future of education is here -- 100% free
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 max-w-5xl text-center"
        >
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
            Education that{" "}
            <span className="relative inline-block">
              <span className="gradient-text">feels modern</span>
            </span>
            <br />
            and runs enterprise-grade
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Global University Institute is the learning platform built for modern institutions.
          </p>
        </motion.div>

        {/* Hero Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="relative mx-auto mt-10 max-w-2xl z-20"
          ref={searchRef}
        >
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 h-6 w-6 text-muted-foreground" />
            <Input
              type="text"
              placeholder="What do you want to study?"
              className="h-16 w-full rounded-full border-2 border-primary/20 bg-background/80 pl-14 pr-4 text-lg shadow-xl backdrop-blur-xl transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
            />
            <Button 
              type="submit" 
              className="absolute right-2 h-12 rounded-full bg-gradient-brand px-6 font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              Search
            </Button>
            {isSearching && (
              <div className="absolute right-24 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </form>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-4 overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
              >
                <div className="p-2 border-b border-border bg-secondary/20">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Suggestions</p>
                </div>
                <div className="max-h-80 overflow-auto">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        navigate(`/course/${s.id}`);
                        setShowSuggestions(false);
                      }}
                      className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold truncate text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.category}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                  {suggestions.length === 0 && !isSearching && (
                    <div className="p-8 text-center text-muted-foreground">
                      No matches found.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-4"
        >
          {quickLinks.map((link) => (
            <Link 
              key={link.label} 
              to={link.href}
              className="group flex items-center gap-2 rounded-full border border-border bg-background/50 px-5 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
            >
              <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
              {link.label}
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border/70 md:grid-cols-4"
        >
          {statsItems.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center bg-card/95 px-6 py-6 text-center">
              <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="absolute -inset-x-20 -top-10 h-60 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2 border-b border-border bg-background/40 px-5 py-3.5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-accent/70" />
                <div className="h-3 w-3 rounded-full bg-primary/70" />
              </div>
              <div className="mx-auto w-64 rounded-md bg-secondary/60 px-3 py-1 text-center text-xs text-muted-foreground">
                learnflow.ai/dashboard/student
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-[220px_1fr]">
              <div className="hidden border-r border-border bg-sidebar p-4 md:block">
                <div className="mb-4 flex items-center gap-2 px-2">
                  <div className="h-7 w-7 rounded-md bg-gradient-brand" />
                  <span className="font-display text-sm font-bold text-foreground">Global University Institute</span>
                </div>
                {["Dashboard", "My Courses", "Assessments", "Certificates", "Notifications"].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-display text-base font-bold text-foreground">Welcome back, Alex</p>
                    <p className="text-xs text-muted-foreground">You have 3 pending assessments</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">A</div>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-3">
                  {[
                    { label: "Courses", val: "4", icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
                    { label: "Progress", val: "78%", icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
                    { label: "Certs", val: "3", icon: Award, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border bg-secondary/30 p-3">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.bg}`}>
                        <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                      </div>
                      <p className="mt-2 font-display text-lg font-bold text-foreground">{s.val}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                <p className="mb-2 text-xs font-semibold text-foreground">Continue Learning</p>
                <div className="space-y-2">
                  {[
                    { name: "Advanced Calculus", pct: 72, cat: "Math", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=100" },
                    { name: "CS Fundamentals", pct: 45, cat: "CS", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=100" },
                    { name: "World History", pct: 89, cat: "History", img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=100" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 p-2.5">
                      <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg bg-primary/10">
                        <img src={c.img} alt={c.name} className="h-full w-full object-cover opacity-80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">{c.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${c.pct}%` }}
                              transition={{ duration: 1.2, delay: 1 }}
                              className="h-full rounded-full bg-gradient-brand"
                            />
                          </div>
                          <span className="text-[9px] text-muted-foreground">{c.pct}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
