import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-12 text-center shadow-2xl shadow-primary/20 md:p-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
              Start your learning journey today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
              Join thousands of students and educators. Create courses, take assessments, earn certificates — all completely free.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" variant="secondary" className="h-13 px-8 text-base shadow-lg" asChild>
                <Link to="/signup">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Join as Student
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-13 border-primary-foreground/30 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/signup?role=instructor">
                  <Users className="mr-2 h-4 w-4" />
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
