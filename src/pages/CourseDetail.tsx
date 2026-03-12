import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, Clock, Users, CheckCircle, 
  Loader2, ClipboardCheck, Award, 
  ArrowRight, Star, Globe, ShieldCheck,
  User, BookmarkCheck, Sparkles, PlayCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [userEnrollmentCount, setUserEnrollmentCount] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [courseRes, modRes, lessonRes, quizRes, enrollCountRes] = await Promise.all([
          supabase.from("courses").select("*, profiles:author_id(*)").eq("id", courseId).single(),
          supabase.from("modules").select("*").eq("course_id", courseId).order("order"),
          supabase.from("lessons").select("id, title, module_id, duration_seconds, order").eq("course_id", courseId).eq("published", true).order("order"),
          supabase.from("quizzes").select("id, title, quiz_type, module_id").eq("course_id", courseId).eq("published", true).order("order"),
          supabase.from("enrollments").select("id").eq("course_id", courseId),
        ]);
        setCourse(courseRes.data);
        setModules(modRes.data || []);
        setLessons(lessonRes.data || []);
        setQuizzes(quizRes.data || []);
        setEnrollmentCount(enrollCountRes.data?.length || 0);

        if (user) {
          const [enrolledRes, userCountRes] = await Promise.all([
            supabase.from("enrollments").select("id").eq("course_id", courseId).eq("student_id", user.id).maybeSingle(),
            (supabase.from("enrollments") as any).select("*", { count: "exact", head: true }).eq("student_id", user.id)
          ]);
          setIsEnrolled(!!enrolledRes.data);
          setUserEnrollmentCount(userCountRes.count || 0);
        }
      } catch (err: any) {
        console.error("Course detail fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) { navigate("/login"); return; }
    if (!courseId) return;
    
    if (userEnrollmentCount >= 5) { // Limit increased for institutional flexibility
      toast({ title: "Enrollment Limit Reached", description: "You have reached the maximum course capacity for this semester.", variant: "destructive" });
      return;
    }

    setEnrolling(true);
    const { error } = await supabase.from("enrollments").insert({ 
      course_id: courseId, 
      student_id: user.id,
      status: 'pending',
      instructor_approved: false,
      admin_approved: false
    });
    setEnrolling(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setIsEnrolled(true);
      toast({ title: "Admission Requested", description: "Your enrollment request is pending faculty review." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 space-y-8">
          <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[600px] rounded-[2.5rem]" />
            <Skeleton className="h-[400px] rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-40 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Curriculum Not Found</h2>
          <p className="text-slate-500 mt-2">The requested course might have been archived or moved.</p>
          <Button className="mt-6" asChild><Link to="/academics/catalog">Back to Catalog</Link></Button>
        </div>
      </div>
    );
  }

  const totalDuration = lessons.reduce((acc, l) => acc + (l.duration_seconds || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Course Hero - Stanford/Harvard Standard */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img 
            src={course.cover_image_url || "/images/campus-library.jpg"} 
            alt="" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-primary/20 text-primary-foreground border-none px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {course.level || "Undergraduate"}
              </Badge>
              <Badge variant="outline" className="text-white/70 border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {course.category || "General Academics"}
              </Badge>
              <div className="flex items-center gap-1 text-amber-400 ml-2">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-bold text-white">4.9</span>
                <span className="text-xs text-white/50 font-medium">(120 Reviews)</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
              {course.title}
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              {course.summary || "A comprehensive exploration of core principles, designed for academic mastery and professional application."}
            </p>
            
            <div className="flex flex-wrap items-center gap-8 text-sm text-white/70 font-medium">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden bg-slate-800">
                   <img src={course.profiles?.avatar_url || `https://i.pravatar.cc/100?u=${course.author_id}`} alt="" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-tighter">Instructor</p>
                  <p className="text-white">{course.profiles?.display_name || "Faculty Member"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <span>100% Online</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span>{enrollmentCount + 45} Scholars Enrolled</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Section */}
            <section>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" /> Course Overview
              </h2>
              <div className="prose prose-slate max-w-none prose-lg text-slate-600 leading-relaxed">
                <p className="whitespace-pre-line">
                  {course.description || "This course provides an in-depth study of the subject matter, combining theoretical foundations with practical case studies. Students will engage with world-class faculty and a global cohort of peers to master the core competencies required for advanced academic and professional success."}
                </p>
              </div>
            </section>

            {/* What you'll learn */}
            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-8 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" /> Learning Objectives
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "Master fundamental principles and advanced concepts",
                  "Develop critical analytical and research skills",
                  "Collaborate with international peer networks",
                  "Earn an institutional certificate of completion"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-slate-700 font-medium leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
                <ClipboardCheck className="h-8 w-8 text-primary" /> Curriculum Structure
              </h2>
              <div className="space-y-4">
                {modules.length > 0 ? (
                  modules.map((mod, i) => (
                    <Card key={mod.id} className="border-none shadow-sm shadow-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-6 bg-white border-b border-slate-50">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-display font-bold text-slate-400">
                              {String(i + 1).padStart(2, '0')}
                            </div>
                            <h3 className="font-bold text-lg text-slate-900">{mod.title}</h3>
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {lessons.filter(l => l.module_id === mod.id).length} Lessons
                          </span>
                        </div>
                        <div className="p-6 bg-slate-50/30 space-y-3">
                          {lessons.filter(l => l.module_id === mod.id).map(lesson => (
                            <div key={lesson.id} className="flex items-center justify-between group cursor-pointer">
                              <div className="flex items-center gap-3 text-slate-600">
                                <BookmarkCheck className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                                <span className="text-sm font-medium group-hover:text-slate-900 transition-colors">{lesson.title}</span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">{Math.round((lesson.duration_seconds || 600) / 60)}m</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                    <p className="text-slate-400 font-medium">Detailed syllabus being finalized by faculty.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Instructor Bio */}
            <section className="border-t border-slate-200 pt-12">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">Meet Your Faculty</h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-32 w-32 rounded-3xl overflow-hidden shrink-0 shadow-xl border-4 border-white">
                   <img src={course.profiles?.avatar_url || `https://i.pravatar.cc/200?u=${course.author_id}`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{course.profiles?.display_name || "Faculty Member"}</h3>
                    <p className="text-primary font-bold text-sm uppercase tracking-wider">{course.profiles?.department || "General Academics"}</p>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {course.profiles?.bio || "A distinguished member of our faculty dedicated to advancing the field through research and innovative teaching methodologies."}
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="rounded-xl font-bold">View Faculty Profile</Button>
                    <Button variant="ghost" size="sm" className="rounded-xl font-bold">Contact Instructor</Button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Desktop Sticky */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <Card className="border-none shadow-2xl shadow-slate-200 overflow-hidden rounded-[2.5rem] bg-white">
                <div className="h-48 relative overflow-hidden hidden lg:block">
                   <img src={course.cover_image_url || "/images/campus-library.jpg"} alt="" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-lg cursor-pointer hover:scale-110 transition-transform">
                         <PlayCircle className="h-8 w-8 ml-1" />
                      </div>
                   </div>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-bold text-slate-900">Free</span>
                    <span className="text-slate-400 line-through text-sm font-medium">$499.00</span>
                  </div>

                  {isEnrolled ? (
                    <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800" onClick={() => navigate(`/course/${courseId}/learn`)}>
                      Continue Learning <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <>Enroll Now <ArrowRight className="ml-2 h-5 w-5" /></>}
                    </Button>
                  )}

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">This course includes:</p>
                    <div className="grid gap-3">
                      {[
                        { icon: BookOpen, text: `${lessons.length} modular lessons` },
                        { icon: ClipboardCheck, text: `${quizzes.length} academic assessments` },
                        { icon: Clock, text: `Approx. ${Math.round(totalDuration / 3600) || 4}h total learning` },
                        { icon: Award, text: "Institutional Certificate" },
                        { icon: ShieldCheck, text: "Verified Faculty Content" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                          <item.icon className="h-4 w-4 text-primary" />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 text-center">
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      Institutional access provided by Global University Institute. <br />
                      Accreditation level: {course.level || "Standard"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm shadow-slate-200 rounded-[2.5rem] bg-indigo-50 p-8 text-center border-2 border-indigo-100">
                 <h4 className="font-bold text-indigo-900 mb-2">Need Institutional Help?</h4>
                 <p className="text-indigo-700/70 text-sm mb-6 leading-relaxed">
                   Our admissions team is available 24/7 to support your learning journey.
                 </p>
                 <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl" asChild>
                   <Link to="/contact">Contact Admissions</Link>
                 </Button>
              </Card>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
