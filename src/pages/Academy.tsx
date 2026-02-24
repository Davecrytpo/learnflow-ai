import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, GraduationCap, Star, Users, ArrowRight, Play, BookCheck, ShieldCheck, Sparkles, Calendar, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Academy = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      // Fetch courses tagged with 'Academy' category
      const { data } = await supabase
        .from("courses")
        .select("*, profiles:author_id(display_name)")
        .eq("category", "Academy")
        .eq("published", true)
        .order("created_at", { ascending: false });
      
      setCourses(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleStartLearning = async (courseId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setEnrolling(courseId);
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("course_id", courseId)
      .eq("student_id", user.id)
      .maybeSingle();

    if (existing) {
      navigate(`/course/${courseId}/learn`);
      return;
    }

    const { error } = await supabase
      .from("enrollments")
      .insert({ course_id: courseId, student_id: user.id });

    setEnrolling(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Enrolled in Academy Course!" });
      navigate(`/course/${courseId}/learn`);
    }
  };

  const events = [
    { title: "LMS Best Practices Webinar", date: "Mar 12, 2026", time: "10:00 AM EST" },
    { title: "AI in Higher Ed Workshop", date: "Mar 15, 2026", time: "2:00 PM EST" },
    { title: "Student Engagement Panel", date: "Mar 20, 2026", time: "11:30 AM EST" },
  ];

  const resources = [
    { title: "Pedagogy Implementation Guide", type: "PDF", size: "2.4 MB" },
    { title: "Course Design Template", type: "DOCX", size: "1.1 MB" },
    { title: "Accessibility Checklist", type: "PDF", size: "0.8 MB" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-border pt-32 pb-20">
          <div className="absolute inset-0 bg-aurora opacity-70" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary uppercase tracking-widest">
                  Academy Hub
                </Badge>
                <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Elevate your <span className="gradient-text">teaching mastery</span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Professional certification paths, research-backed pedagogy, and technical training for the modern educator.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="h-14 gap-2 bg-gradient-brand px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20"
                    onClick={() => document.getElementById('academy-courses')?.scrollIntoView({ behavior: 'smooth' })}>
                    Explore Courses <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 gap-2 px-8 text-base" onClick={() => toast({ title: "Coming Soon", description: "Institutional training programs are in development." })}>
                    Institutional Training
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: BookCheck, title: "Platform Mastery", desc: "Step-by-step guides to mastering every Learnflow feature." },
              { icon: Users, title: "Global Network", desc: "Connect with 12,000+ certified instructors worldwide." },
              { icon: ShieldCheck, title: "Quality Standards", desc: "Courses mapped to international educational standards." },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-all">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Courses Section */}
        <section id="academy-courses" className="bg-secondary/20 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
              <div className="text-center md:text-left">
                <h2 className="font-display text-3xl font-bold text-foreground text-center sm:text-left">Academy Certification Paths</h2>
                <p className="mt-2 text-muted-foreground">Comprehensive training for every role.</p>
              </div>
              <Button variant="ghost" asChild className="text-primary"><Link to="/courses">View catalog <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)
              ) : courses.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-4 text-muted-foreground">No academy courses available yet. Check back soon!</p>
                </div>
              ) : (
                courses.map((course, i) => (
                  <motion.div key={course.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                    <Card className="group h-full overflow-hidden border-border hover:border-primary/40 transition-all">
                      <div className="relative h-48 overflow-hidden">
                        <img src={course.cover_image_url || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105" alt={course.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex gap-2">
                          <Badge className="bg-primary text-primary-foreground">{course.category}</Badge>
                          <Badge variant="outline" className="bg-white/10 text-white backdrop-blur-sm border-white/20">Free</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="font-display text-xl">{course.title}</CardTitle>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> {course.profiles?.display_name || "Instructor"}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.summary}</p>
                        <Button className="mt-6 w-full gap-2" variant={enrolling === course.id ? "secondary" : "default"}
                          onClick={() => handleStartLearning(course.id)} disabled={enrolling === course.id}>
                          {enrolling === course.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                          Start Learning
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Community & Resources */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-bold flex items-center gap-2 mb-6">
                <Calendar className="h-6 w-6 text-primary" /> Upcoming Events
              </h3>
              <div className="space-y-4">
                {events.map((e) => (
                  <div key={e.title} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                    <div>
                      <p className="font-semibold text-foreground">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.date} • {e.time}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Registration complete!", description: `You are registered for: ${e.title}` })}>Register</Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold flex items-center gap-2 mb-6">
                <Download className="h-6 w-6 text-accent" /> Research & Resources
              </h3>
              <div className="space-y-4">
                {resources.map((r) => (
                  <div key={r.title} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.type} • {r.size}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast({ title: "Download started" })}><Download className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Academy;

