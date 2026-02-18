import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, CheckCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CTA = () => (
  <section className="py-28">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-brand" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.06]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,rgba(255,255,255,0.15),transparent_60%)]" />

        <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground">
            <Zap className="h-3.5 w-3.5 fill-current" />
            Join 50,000+ learners worldwide
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
            Ready to transform the way <br className="hidden sm:block" />you teach and learn?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/75">
            Create courses, deliver assessments, track progress, and issue certificates — everything free, forever.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/70">
            {["No credit card", "Unlimited courses", "US Standards compliant", "Certificates included"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" /> {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-14 gap-2 bg-background px-10 text-base font-semibold text-foreground hover:bg-background/90 shadow-xl" asChild>
              <Link to="/signup">
                <BookOpen className="h-4 w-4" />
                Join as Student
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 gap-2 border-primary-foreground/25 px-10 text-base font-medium text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/signup?role=instructor">
                <Users className="h-4 w-4" />
                Register as Instructor
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTA;
