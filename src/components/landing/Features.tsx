import { Sparkles, BarChart3, Award, CreditCard, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "AI Course Creation",
    description: "Generate course outlines, lesson content, and quiz questions with AI. Edit and publish in minutes.",
  },
  {
    icon: BarChart3,
    title: "Professional Dashboards",
    description: "Track student progress, enrollment trends, and course analytics with beautiful charts and metrics.",
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Auto-generate beautiful PDF certificates when students complete courses. Fully customizable.",
  },
  {
    icon: CreditCard,
    title: "Built-in Payments",
    description: "Monetize your courses with Stripe integration. One-time purchases with automatic enrollment.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Separate dashboards for students, instructors, and admins. Fine-grained access control.",
  },
  {
    icon: BookOpen,
    title: "Rich Content",
    description: "Markdown lessons, video embeds, file uploads, and assignments — everything you need for a great course.",
  },
];

const Features = () => {
  return (
    <section className="border-t border-border bg-card py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to teach online
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete platform for creating, selling, and managing your courses.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
