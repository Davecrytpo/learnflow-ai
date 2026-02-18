import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Target, Heart, Globe, GraduationCap, Users, BookOpen, Award } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  { icon: Target, title: "Mission-Driven", description: "Quality education must be accessible to every person on Earth, regardless of geography or economic circumstances.", color: "from-primary to-blue-600" },
  { icon: Heart, title: "Student-First Design", description: "Every feature, from progress tracking to certificate generation, is designed around the learner's journey.", color: "from-rose-500 to-pink-600" },
  { icon: Globe, title: "Global Reach", description: "Built to serve learners and educators worldwide, meeting both US and international education standards.", color: "from-emerald-500 to-teal-600" },
  { icon: GraduationCap, title: "Academic Excellence", description: "Our assessment system — exercises, quizzes, tests, examinations — is built for rigorous academic programs.", color: "from-violet-500 to-purple-600" },
];

const team = [
  { initials: "MC", name: "Michael Chen", role: "Co-founder & CEO", bg: "from-primary to-blue-600" },
  { initials: "SK", name: "Sarah Kim", role: "Head of Education", bg: "from-accent to-orange-500" },
  { initials: "JM", name: "James Miller", role: "CTO", bg: "from-violet-500 to-purple-600" },
  { initials: "AR", name: "Aisha Rahman", role: "Head of Design", bg: "from-emerald-500 to-teal-600" },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-24">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.025]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,hsl(213_94%_58%/0.15),transparent)]" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">About MERIDIAN</p>
            <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Education Reimagined for the{" "}
              <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
                Digital Age
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              MERIDIAN was built by educators frustrated with expensive, complicated LMS platforms that failed students and instructors alike. We set out to build something better — something powerful, beautiful, and entirely free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border"
          >
            {[{ val: "50K+", lbl: "Active Users" }, { val: "2.8K+", lbl: "Courses Published" }, { val: "120+", lbl: "Institutions" }].map((s) => (
              <div key={s.lbl} className="flex flex-col items-center justify-center bg-card py-8">
                <p className="font-display text-3xl font-bold text-foreground">{s.val}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.lbl}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl items-center gap-16 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Our Mission</p>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
                Democratize world-class education
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We believe that the quality of your education shouldn't depend on the budget of your school district. MERIDIAN provides institutions and self-learners with the same enterprise-grade tools used by the world's leading universities — completely free.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                From AI-assisted course creation to automated certificate generation, we've built every feature educators actually need — not the features that look good in a sales deck.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Users, val: "50K+", label: "Students Learning", color: "text-primary bg-primary/10" },
                { icon: BookOpen, val: "2.8K", label: "Active Courses", color: "text-accent bg-accent/10" },
                { icon: Award, val: "98K+", label: "Certificates Issued", color: "text-violet-400 bg-violet-400/10" },
                { icon: GraduationCap, val: "100%", label: "Always Free", color: "text-emerald-400 bg-emerald-400/10" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-6">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold text-foreground">{s.val}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-card/30 py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Our Values</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">What drives us</h2>
          </motion.div>
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${v.color}`}>
                  <v.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">The Team</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">Built by educators, for educators</h2>
          </motion.div>
          <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-4">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${m.bg} text-lg font-bold text-primary-foreground shadow-lg`}>
                  {m.initials}
                </div>
                <p className="mt-3 font-semibold text-foreground text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
