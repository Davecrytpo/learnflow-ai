import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BookOpen, Users, Award, GraduationCap, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";

const statsItems = [
  { value: "50K+", label: "Active Learners" },
  { value: "2,800+", label: "Courses Published" },
  { value: "98%", label: "Completion Rate" },
  { value: "120+", label: "Institutions" },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.035]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(213_94%_58%/0.18),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,hsl(250_84%_64%/0.10),transparent)]" />

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary">
            <Zap className="h-3.5 w-3.5 fill-primary" />
            The Future of Education is Here — 100% Free
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 max-w-5xl text-center"
        >
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
            Where Knowledge{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Transforms
              </span>
            </span>
            <br />
            Into Excellence
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            MERIDIAN is the enterprise-grade learning management system built for modern education institutions — from K-12 classrooms to universities. Create, teach, assess, and certify.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" className="h-14 gap-2 bg-gradient-brand px-10 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 hover:opacity-90" asChild>
            <Link to="/signup">
              Start for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 gap-2 border-border px-10 text-base font-medium hover:bg-secondary/60" asChild>
            <Link to="/courses">
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Link>
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4"
        >
          {statsItems.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center bg-card px-6 py-6 text-center">
              <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Dashboard visual */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          {/* Glow */}
          <div className="absolute -inset-x-20 -top-10 h-60 bg-gradient-to-r from-primary/20 via-violet-500/10 to-primary/20 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
            {/* App bar */}
            <div className="flex items-center gap-2 border-b border-border bg-background/40 px-5 py-3.5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-accent/70" />
                <div className="h-3 w-3 rounded-full bg-primary/70" />
              </div>
              <div className="mx-auto w-64 rounded-md bg-secondary/60 px-3 py-1 text-center text-xs text-muted-foreground">
                meridian.edu/dashboard/student
              </div>
            </div>

            {/* Dashboard content mockup */}
            <div className="grid gap-0 md:grid-cols-[220px_1fr]">
              {/* Sidebar */}
              <div className="hidden border-r border-border bg-sidebar p-4 md:block">
                <div className="mb-4 flex items-center gap-2 px-2">
                  <div className="h-7 w-7 rounded-md bg-gradient-brand" />
                  <span className="font-display text-sm font-bold text-foreground">MERIDIAN</span>
                </div>
                {["Dashboard", "My Courses", "Assessments", "Certificates", "Notifications"].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main area */}
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
                    { label: "Certs", val: "3", icon: Award, color: "text-violet-400", bg: "bg-violet-400/10" },
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
                    { name: "Advanced Calculus", pct: 72, cat: "Math" },
                    { name: "Computer Science Fundamentals", pct: 45, cat: "CS" },
                    { name: "World History", pct: 89, cat: "History" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/20 p-2.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[9px] font-bold text-primary">{c.cat}</div>
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
