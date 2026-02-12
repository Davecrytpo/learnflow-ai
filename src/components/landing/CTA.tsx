import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
          className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-12 text-center shadow-2xl shadow-primary/20"
        >
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to start teaching?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Create your first course today — free forever on our starter plan.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base"
              asChild
            >
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
