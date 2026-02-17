import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_60%)]" />

          <div className="relative px-8 py-16 text-center md:px-16 md:py-20">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
              Ready to transform education?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/80">
              Join thousands of students and educators. Create courses, take assessments, earn certificates — completely free, forever.
            </p>

            {/* Benefits */}
            <div className="mx-auto mt-8 flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/70">
              {["No credit card required", "Unlimited courses", "US Standards compliant", "Certificates included"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" className="h-14 gap-2 px-8 text-base shadow-xl" asChild>
                <Link to="/signup">
                  <BookOpen className="h-4 w-4" />
                  Join as Student
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 gap-2 border-primary-foreground/20 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10" asChild>
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
};

export default CTA;
