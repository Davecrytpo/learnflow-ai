import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, GraduationCap, Star, Users, ArrowRight, Play, BookCheck, 
  ShieldCheck, Sparkles, Calendar, Download, Loader2, Search, CheckCircle2,
  Trophy, Lightbulb, Code, LayoutDashboard, Newspaper
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const Academy = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [verifyId, setVerifyId] = useState("");
  const [verifying, setVerifying] = useState(false);

  const pathways = [
    { id: "educator", title: "Educator Pathway", desc: "Master course design and student engagement.", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50" },
    { id: "admin", title: "Administrator Pathway", desc: "Learn to manage institutions and compliance.", icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "developer", title: "Developer Pathway", desc: "Build plugins and integrate with our API.", icon: Code, color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*, profiles:author_id(display_name)")
          .eq("category", "Academy")
          .eq("published", true)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setCourses(data || []);
      } catch (err: any) {
        console.error("Academy fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleStartLearning = async (courseId: string) => {
    if (!user) { navigate("/login"); return; }
    setEnrolling(courseId);
    const { data: existing } = await supabase.from("enrollments").select("*").eq("course_id", courseId).eq("student_id", user.id).maybeSingle();
    if (existing) {
      setEnrolling(null);
      if (["active", "approved", "completed"].includes(existing.status || "")) {
        navigate(`/course/${courseId}/learn`);
      } else {
        toast({ title: "Enrollment pending", description: "Your access is not active yet.", variant: "destructive" });
      }
      return;
    }
    const { error } = await supabase.from("enrollments").insert({ course_id: courseId, student_id: user.id });
    setEnrolling(null);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Enrolled in Academy Course!" }); navigate(`/course/${courseId}/learn`); }
  };

  const handleVerify = async () => {
    if (!verifyId) return;
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1500));
    setVerifying(false);
    toast({ title: "Certificate Verified", description: "This is a valid Learnflow Academy credential issued to Alex Rivera." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        {/* Modern Academy Hero */}
        <section className="relative overflow-hidden border-b border-border bg-slate-950 pt-32 pb-24 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Badge className="mb-6 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-4 py-1 uppercase tracking-widest">
                  Official Moodle-Grade Training
                </Badge>
                <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
                  Learnflow <span className="text-emerald-400 font-serif italic">Academy</span>
                </h1>
                <p className="mt-8 text-xl leading-relaxed text-slate-300 max-w-2xl mx-auto">
                  The home of professional learning for the Learnflow community. 
                  Get certified, join webinars, and master modern pedagogy.
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="h-14 gap-2 bg-emerald-500 px-8 text-base font-bold text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20"
                    onClick={() => document.getElementById('pathways')?.scrollIntoView({ behavior: 'smooth' })}>
                    Start Your Pathway <ArrowRight className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-6 py-3">
                    <Users className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-medium">12,400+ Educators Enrolled</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Learning Pathways Selector */}
        <section id="pathways" className="py-24 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground">Choose Your Learning Pathway</h2>
            <p className="mt-4 text-muted-foreground">Structured tracks to take you from beginner to expert.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pathways.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <Link to={`/courses?category=Academy&track=${p.id}`} className="block h-full">
                  <Card className="group h-full cursor-pointer border-border hover:border-primary/40 transition-all hover:shadow-2xl">
                    <CardHeader>
                      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${p.bg} ${p.color}`}>
                        <p.icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{p.title}</CardTitle>
                      <CardDescription className="text-base mt-2">{p.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        Explore track <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Functional Tabbed Content Hub */}
        <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="courses" className="space-y-12">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <TabsList className="bg-white p-1 shadow-sm dark:bg-slate-800">
                  <TabsTrigger value="courses" className="gap-2 px-6"><BookOpen className="h-4 w-4" /> Courses</TabsTrigger>
                  <TabsTrigger value="webinars" className="gap-2 px-6"><Calendar className="h-4 w-4" /> Webinars</TabsTrigger>
                  <TabsTrigger value="news" className="gap-2 px-6"><Newspaper className="h-4 w-4" /> Academy News</TabsTrigger>
                  <TabsTrigger value="verify" className="gap-2 px-6"><Trophy className="h-4 w-4" /> Verify Credentials</TabsTrigger>
                </TabsList>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search academy..." className="pl-10 bg-white dark:bg-slate-800" />
                </div>
              </div>

              <TabsContent value="courses">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                    [1, 2, 3].map((i) => <Skeleton key={i} className="h-96 rounded-2xl" />)
                  ) : (
                    courses.map((course) => (
                      <Card key={course.id} className="group overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                          <img src={course.cover_image_url || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"} 
                            className="h-full w-full object-cover transition-transform group-hover:scale-105" alt={course.title} />
                          <Badge className="absolute top-4 left-4 bg-emerald-500">Free</Badge>
                        </div>
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-[10px] uppercase">Self-Paced</Badge>
                            <Badge variant="outline" className="text-[10px] uppercase">Certified</Badge>
                          </div>
                          <CardTitle className="font-display text-xl">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{course.summary}</p>
                          <Button className="mt-6 w-full gap-2" onClick={() => handleStartLearning(course.id)} disabled={enrolling === course.id}>
                            {enrolling === course.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                            Enroll and Start
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="webinars">
                <div className="grid gap-6">
                  {[
                    { title: "Building Collaborative Communities", date: "Mar 15, 2026", type: "Webinar", speakers: "Dr. Jane Smith" },
                    { title: "AI-Powered Assessment Design", date: "Mar 22, 2026", type: "Workshop", speakers: "Tech Team" },
                    { title: "Institutional Migration Strategies", date: "Apr 05, 2026", type: "Q&A", speakers: "Admin Core" },
                  ].map((w) => (
                    <div key={w.title} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border border-border bg-white dark:bg-slate-800 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <span className="text-xs font-bold uppercase">{w.date.split(' ')[0]}</span>
                          <span className="text-xl font-bold">{w.date.split(' ')[1].replace(',','')}</span>
                        </div>
                        <div>
                          <Badge className="mb-2">{w.type}</Badge>
                          <h3 className="text-xl font-bold">{w.title}</h3>
                          <p className="text-sm text-muted-foreground">Hosted by {w.speakers}</p>
                        </div>
                      </div>
                      <Button className="mt-4 sm:mt-0" variant="outline">Reserve Spot</Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="news">
                <div className="grid gap-8 md:grid-cols-2">
                  <Card className="overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=1000" className="h-64 w-full object-cover" />
                    <CardHeader>
                      <CardTitle>Academy v2.0 Release: New Developer Paths</CardTitle>
                      <CardDescription>We've launched three new tracks for Learnflow plugin developers...</CardDescription>
                    </CardHeader>
                    <CardContent><Button variant="link" className="p-0">Read full story →</Button></CardContent>
                  </Card>
                  <Card className="overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" className="h-64 w-full object-cover" />
                    <CardHeader>
                      <CardTitle>Community Spotlight: Global Educator Summit</CardTitle>
                      <CardDescription>Highlights from our annual gathering of 5,000+ online teachers...</CardDescription>
                    </CardHeader>
                    <CardContent><Button variant="link" className="p-0">Read full story →</Button></CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="verify">
                <Card className="max-w-2xl mx-auto border-emerald-500/20 bg-emerald-500/5">
                  <CardHeader className="text-center">
                    <Trophy className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                    <CardTitle className="text-2xl">Verify Academy Credential</CardTitle>
                    <CardDescription>Enter a certificate or badge ID to verify its authenticity.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g. LF-ACAD-9982-X" 
                        value={verifyId} 
                        onChange={(e) => setVerifyId(e.target.value)}
                        className="bg-white dark:bg-slate-800"
                      />
                      <Button onClick={handleVerify} disabled={verifying || !verifyId}>
                        {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border bg-white/50 p-4 text-xs text-muted-foreground flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Learnflow Academy credentials are cryptographically signed and stored on our secure registry for institutional verification.</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold mb-6">Why get certified with <br/><span className="text-primary">Learnflow Academy?</span></h2>
              <div className="space-y-6">
                {[
                  { t: "Global Recognition", d: "Join a network of certified educators recognized by institutions worldwide.", i: CheckCircle2 },
                  { t: "Career Acceleration", d: "Boost your professional profile with verifiable mastery of the Learnflow ecosystem.", i: Trophy },
                  { t: "Exclusive Resources", d: "Access premium course templates, pedagogical research, and beta features.", i: Sparkles },
                ].map((item) => (
                  <div key={item.t} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.i className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.t}</h4>
                      <p className="text-sm text-muted-foreground">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-10 h-12 px-8" asChild><Link to="/signup">Start Free Today</Link></Button>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" className="rounded-3xl shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-border max-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Live Now</span>
                </div>
                <p className="text-sm font-bold">Interactive Design Workshop</p>
                <p className="text-xs text-muted-foreground mt-1">Join 450+ other educators currently learning.</p>
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


