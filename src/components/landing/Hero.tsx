import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, Users, Award, Shield } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Complex background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(220_90%_53%/0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(168_76%_42%/0.08),transparent_50%)]" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
                <Sparkles className="h-4 w-4" />
                100% Free Educational Platform
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              The Future of{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Digital Learning
              </span>{" "}
              Starts Here
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              A comprehensive learning management system designed for modern education. 
              Create courses, track progress, manage assessments, and issue certificates — 
              completely free for students and instructors.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button size="lg" className="h-13 px-8 text-base shadow-lg shadow-primary/25" asChild>
                <Link to="/signup">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-13 px-8 text-base" asChild>
                <Link to="/signup?role=instructor">Become an Instructor</Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                <span>US Education Standards</span>
              </div>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <span>10,000+ Active Learners</span>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <span>500+ Courses Available</span>
            </motion.div>
          </div>

          {/* Right visual — dashboard preview cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto w-full max-w-md">
              {/* Main card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Course Dashboard</p>
                    <p className="text-xs text-muted-foreground">Track your learning journey</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Introduction to Computer Science", progress: 85 },
                    { label: "Advanced Mathematics", progress: 62 },
                    { label: "English Literature", progress: 94 },
                  ].map((course) => (
                    <div key={course.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground">{course.label}</span>
                        <span className="text-muted-foreground">{course.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -right-8 -top-6 rounded-xl border border-border bg-card p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-lg font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground">Certificates</p>
                  </div>
                </div>
              </div>

              {/* Floating users card */}
              <div className="absolute -bottom-4 -left-8 rounded-xl border border-border bg-card p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-lg font-bold text-foreground">2,847</p>
                    <p className="text-xs text-muted-foreground">Students Active</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
