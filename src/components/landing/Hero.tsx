import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(220_90%_53%/0.08),transparent_60%)]" />
      
      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              AI-powered course creation
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Teach what you love.{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Launch courses that work.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Build beautiful, interactive online courses — secure, AI‑assisted, and built to scale.
            Launch in minutes and grow to thousands of students.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/signup">
                Get started — it's free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
                ))}
              </div>
              <span>10,000+ students learning</span>
            </div>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <span>500+ courses created</span>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <span>4.9/5 instructor rating</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
