import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["Up to 3 courses", "Basic analytics", "Student dashboard", "Community support"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious instructors",
    features: [
      "Unlimited courses",
      "AI content generation",
      "Advanced analytics",
      "Certificates",
      "Custom branding",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations",
    features: [
      "Everything in Pro",
      "SSO & team management",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

const Pricing = () => {
  return (
    <section className="border-t border-border bg-card py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, upgrade when you're ready.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-xl border p-8 ${
                plan.featured
                  ? "border-primary bg-background shadow-xl shadow-primary/10"
                  : "border-border bg-background"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                variant={plan.featured ? "default" : "outline"}
                asChild
              >
                <Link to="/signup">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
