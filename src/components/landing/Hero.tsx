import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, Users, Award, Shield, CheckCircle, Play } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Layered background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_-10%,hsl(220_90%_53%/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_110%,hsl(168_76%_42%/0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--background))_100%)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      </div>

      <div className="container relative mx-auto px-4 pb-20 pt-16 md:pb-32 md:pt-24 lg:pb-40 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-sm font-medium text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                100% Free for Students & Educators
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]"
            >
              The Modern{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                  Learning Platform
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="hsl(168 76% 42%)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
                </svg>
              </span>
              <br />
              Built for Results
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Create courses, deliver assessments, track progress, and issue certificates — all in one platform designed for K-12 and higher education.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button size="lg" className="h-14 gap-2 px-8 text-base shadow-xl shadow-primary/20" asChild>
                <Link to="/signup">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 gap-2 px-8 text-base" asChild>
                <Link to="/signup?role=instructor">
                  <Play className="h-4 w-4" />
                  Become an Instructor
                </Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                { label: "Active Learners", value: "10K+", icon: Users },
                { label: "Courses", value: "500+", icon: BookOpen },
                { label: "Certificates", value: "25K+", icon: Award },
                { label: "US Standards", value: "100%", icon: Shield },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto h-4 w-4 text-accent" />
                  <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Interactive dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl" />

              {/* Main dashboard card */}
              <div className="relative rounded-2xl border border-border bg-card shadow-2xl">
                {/* Header bar */}
                <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-destructive/60" />
                    <div className="h-3 w-3 rounded-full bg-accent/60" />
                    <div className="h-3 w-3 rounded-full bg-primary/60" />
                  </div>
                  <div className="ml-4 flex-1 rounded-md bg-secondary px-3 py-1 text-center text-xs text-muted-foreground">
                    classroom.edu/dashboard
                  </div>
                </div>

                <div className="p-6">
                  {/* Mini stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "In Progress", value: "4", color: "text-primary" },
                      { label: "Completed", value: "12", color: "text-accent" },
                      { label: "Certificates", value: "8", color: "text-accent" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border bg-background p-3 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Course progress items */}
                  <div className="mt-5 space-y-3">
                    <p className="text-xs font-semibold text-foreground">Continue Learning</p>
                    {[
                      { title: "Introduction to Computer Science", progress: 87, cat: "CS" },
                      { title: "Advanced Mathematics", progress: 64, cat: "Math" },
                      { title: "English Literature", progress: 95, cat: "ELA" },
                    ].map((course) => (
                      <div key={course.title} className="rounded-lg border border-border bg-background p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                              {course.cat}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">{course.title}</p>
                              <p className="text-[10px] text-muted-foreground">{course.progress}% complete</p>
                            </div>
                          </div>
                          <CheckCircle className={`h-4 w-4 ${course.progress > 80 ? "text-accent" : "text-muted-foreground/30"}`} />
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1.2, delay: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating certificate badge */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -right-6 -top-4 rounded-xl border border-border bg-card p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <Award className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Certificate Earned!</p>
                    <p className="text-[10px] text-muted-foreground">Web Development</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating active users */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute -bottom-4 -left-6 rounded-xl border border-border bg-card p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["bg-primary", "bg-accent", "bg-primary/70"].map((bg, i) => (
                      <div key={i} className={`h-6 w-6 rounded-full ${bg} border-2 border-card`} />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">2,847 online</p>
                    <p className="text-[10px] text-muted-foreground">Students active now</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
