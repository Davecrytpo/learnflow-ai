import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Star, Users, ArrowRight, Play, BookCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const academyCourses = [
  {
    id: "acad-1",
    title: "LMS Mastery for Instructors",
    description: "Learn how to build engaging curriculums, manage assessments, and use AI tools to save time.",
    level: "Beginner",
    duration: "4 hours",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    category: "Teaching",
  },
  {
    id: "acad-2",
    title: "Advanced Assessment Strategies",
    description: "Deep dive into rubrics, adaptive testing, and proctoring best practices for high-stakes exams.",
    level: "Advanced",
    duration: "6 hours",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    category: "Pedagogy",
  },
  {
    id: "acad-3",
    title: "AI Ethics in Education",
    description: "Understanding how to govern AI usage, detect plagiarism, and maintain academic integrity.",
    level: "Intermediate",
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    category: "Governance",
  },
];

const Academy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border pt-32 pb-20">
          <div className="absolute inset-0 bg-aurora opacity-70" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary">
                  Learnflow Academy
                </Badge>
                <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Master the art of <span className="gradient-text">modern teaching</span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Professional development courses designed for instructors, administrators, and education leaders. 
                  Learn how to leverage Learnflow AI to its full potential.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="h-14 gap-2 bg-gradient-brand px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20">
                    Explore Academy <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 gap-2 px-8 text-base">
                    Institutional Training
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: BookCheck, title: "Certified Paths", description: "Earn industry-recognized certificates for platform mastery." },
              { icon: Users, title: "Community Events", description: "Join live webinars and networking sessions with other educators." },
              { icon: ShieldCheck, title: "Best Practices", description: "Access a library of pedagogical research and implementation guides." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Courses Section */}
        <section className="bg-secondary/30 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
              <div className="text-center md:text-left">
                <h2 className="font-display text-3xl font-bold text-foreground">Featured Academy Courses</h2>
                <p className="mt-2 text-muted-foreground">Tailored for different roles and expertise levels.</p>
              </div>
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80">
                View all academy courses <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {academyCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group h-full overflow-hidden border-border transition-all hover:border-primary/40">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                          {course.category}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Play className="h-3 w-3" /> {course.duration}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" /> {course.level}</span>
                      </div>
                      <CardTitle className="mt-2 font-display text-xl group-hover:text-primary transition-colors">
                        {course.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {course.description}
                      </p>
                      <Button className="mt-6 w-full" variant="outline">
                        Start Learning
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Learnflow Academy */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-4xl font-bold text-foreground">Why choose <span className="gradient-text">Academy?</span></h2>
                <p className="mt-6 text-lg text-muted-foreground">
                  Our academy isn't just about software—it's about the future of pedagogy. We combine technical 
                  training with educational research to help you create better outcomes for your students.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Pedagogy-first course design",
                    "Advanced data literacy for administrators",
                    "Inclusive and accessible teaching methods",
                    "AI-driven educational transformation",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-foreground">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-10 h-12 px-8" asChild>
                  <Link to="/signup?role=instructor">Join the Community</Link>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                    alt="Students collaborating" 
                    className="h-full w-full rounded-2xl object-cover shadow-2xl"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border bg-card p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">12k+</p>
                      <p className="text-sm text-muted-foreground">Certified Educators</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Academy;
