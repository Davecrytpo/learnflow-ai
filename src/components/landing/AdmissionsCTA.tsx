import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Phone } from "lucide-react";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import { motion } from "framer-motion";

const AdmissionsCTA = () => (
  <section className="relative py-32 overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="/images/campus-life.jpg"
        alt="Campus life"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-primary/40" />
    </div>

    <div className="container relative z-10 mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl text-center"
      >
        <GraduationCapIcon className="mx-auto h-12 w-12 text-primary-foreground/80 mb-6" />
        <h2 className="text-4xl font-bold text-primary-foreground md:text-6xl mb-6">
          Begin Your Journey
        </h2>
        <p className="text-lg text-primary-foreground/75 leading-relaxed mb-10">
          Applications for Fall 2026 are now open. Join a community of scholars, innovators,
          and leaders shaping the future. Financial aid available for qualified applicants.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="h-14 rounded-full bg-background px-10 font-bold text-foreground shadow-xl hover:bg-background/90"
            asChild
          >
            <Link to="/signup">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 rounded-full border-primary-foreground/25 px-10 font-bold text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link to="/about">
              <FileText className="mr-2 h-4 w-4" /> Request Information
            </Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/60">
          <span className="text-sm">Application Deadline: <strong className="text-primary-foreground">May 1, 2026</strong></span>
          <span className="hidden md:inline text-primary-foreground/30">|</span>
          <span className="flex items-center gap-2 text-sm">
            <Phone className="h-3.5 w-3.5" /> Admissions Hotline: <strong className="text-primary-foreground">+1 (800) 555-0199</strong>
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default AdmissionsCTA;
