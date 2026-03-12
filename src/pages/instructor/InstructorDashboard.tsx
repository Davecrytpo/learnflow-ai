import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Users, DollarSign, Star, 
  PlusCircle, Calendar, MessageSquare, 
  TrendingUp, Award, ArrowRight, Loader2,
  FileText, ClipboardCheck, Layout, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzeStudentPerformance } from "@/lib/anthropic";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    revenue: 0,
    rating: 4.8,
    activeCourses: 0
  });

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: coursesData } = await supabase
        .from("courses")
        .select("*")
        .eq("author_id", user.id);
      
      const myCourses = coursesData || [];
      setCourses(myCourses);
      
      const courseIds = myCourses.map(c => c.id);
      
      // Fetch Real Students Count
      const { count: studentCount } = await supabase
        .from("enrollments")
        .select("*", { count: 'exact', head: true })
        .in("course_id", courseIds)
        .eq("status", "approved");

      // Fetch Real Revenue
      // Assuming enrollment record has a price or we use course price
      // For simplicity, sum of price_cents from courses for each approved enrollment
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .in("course_id", courseIds)
        .eq("status", "approved");

      let totalRevenue = 0;
      enrollments?.forEach(enr => {
        const course = myCourses.find(c => c.id === enr.course_id);
        if (course) totalRevenue += (course.price_cents || 0);
      });

      setStats({
        students: studentCount || 0, 
        revenue: totalRevenue / 100,
        rating: 4.9, // This would need a reviews table
        activeCourses: myCourses.filter(c => c.published).length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      // Gather data for AI: attendance, grades, submissions
      const courseIds = courses.map(c => c.id);
      const [attendanceRes, gradesRes] = await Promise.all([
        (supabase.from as any)("attendance_records").select("status").in("session_id", 
          (supabase.from as any)("attendance_sessions").select("id").in("course_id", courseIds)
        ),
        supabase.from("submissions").select("score, assignment_id").in("assignment_id", 
          supabase.from("assignments").select("id").in("course_id", courseIds)
        )
      ]);

      const dataSummary = {
        totalStudents: stats.students,
        attendanceStats: attendanceRes.data,
        gradeStats: gradesRes.data,
        courseCount: courses.length
      };

      const analysis = await analyzeStudentPerformance(dataSummary);
      setAiAnalysis(analysis);
    } catch (err: any) {
      toast({ title: "AI Analysis Failed", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-8 pb-12">
        
        {/* Academic Header */}
        <section className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
             <Layout className="w-full h-full text-white" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent)]" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Award className="h-3.5 w-3.5" /> Faculty Portal
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Welcome, Professor {user?.user_metadata?.full_name?.split(' ').pop() || "Educator"}
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
              Manage your academic portfolio, track student progress, and develop world-class curriculum using our integrated AI tools.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate("/instructor/courses/new")}
                className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Launch New Course
              </Button>
              <Button 
                variant="outline"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-12 px-8 rounded-xl backdrop-blur-sm"
                onClick={() => navigate("/instructor/announcements")}
              >
                <MessageSquare className="mr-2 h-5 w-5" /> Post Announcement
              </Button>
            </div>
          </div>
        </section>

        {/* Premium Stats Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Students", value: stats.students, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Institutional Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Avg. Faculty Rating", value: stats.rating, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Active Curriculum", value: stats.activeCourses, icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm shadow-slate-200 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <s.icon className={`h-6 w-6 ${s.color}`} />
                    </div>
                    <TrendingUp className="h-4 w-4 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{s.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Faculty Assistant Section */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-50 to-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="h-32 w-32 text-indigo-600" />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-display font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-indigo-600" /> AI Faculty Assistant
                </CardTitle>
                <CardDescription>Get automated insights into student performance and attendance trends.</CardDescription>
              </div>
              <Button 
                onClick={handleAiAnalysis} 
                disabled={analyzing || courses.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Run Performance Analysis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {aiAnalysis ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="prose prose-indigo max-w-none bg-white/50 p-6 rounded-2xl border border-indigo-100"
                dangerouslySetInnerHTML={{ __html: aiAnalysis }}
              />
            ) : (
              <div className="text-center py-12 text-slate-500 italic">
                {courses.length === 0 ? "Create courses to enable AI insights." : "Click the button above to generate a performance analysis based on real student data."}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Course List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-slate-900">Your Curriculum</h2>
              <Button variant="ghost" className="text-primary font-bold" asChild>
                <Link to="/instructor/courses">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Card key={i} className="h-32 animate-pulse bg-slate-50 border-none shadow-sm" />)}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No courses created yet</h3>
                <p className="text-slate-500 mb-6">Start your journey as an institutional educator.</p>
                <Button onClick={() => navigate("/instructor/courses/new")}>Create Your First Course</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {courses.slice(0, 3).map((course) => (
                  <Card key={course.id} className="border-none shadow-sm shadow-slate-200 hover:shadow-md transition-all group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row h-full">
                        <div className="w-full sm:w-48 h-32 sm:h-auto relative bg-slate-100 overflow-hidden shrink-0">
                          {course.cover_image_url ? (
                            <img src={course.cover_image_url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-brand opacity-80">
                              <BookOpen className="h-8 w-8 text-white/40" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <Badge className={course.published ? "bg-emerald-500 hover:bg-emerald-600 text-white border-none" : "bg-amber-500 hover:bg-amber-600 text-white border-none"}>
                              {course.published ? "Live" : "Draft"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Enrolled Students</span>
                                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Updated {new Date(course.updated_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild className="rounded-xl font-bold shrink-0 ml-4">
                              <Link to={`/instructor/courses/${course.id}`}>Manage</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-900">Faculty Actions</h2>
            
            <Card className="border-none shadow-sm shadow-slate-200 bg-white rounded-[2rem]">
              <CardContent className="p-6 space-y-2">
                {[
                  { label: "Gradebook", icon: ClipboardCheck, href: "/instructor/grading", color: "text-rose-600", bg: "bg-rose-50" },
                  { label: "Syllabus Review", icon: FileText, href: "/instructor/courses", color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Faculty Calendar", icon: Calendar, href: "/student/calendar", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Discussion Forums", icon: MessageSquare, href: "/instructor/discussions", color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((action, i) => (
                  <Link 
                    key={i} 
                    to={action.href} 
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`h-10 w-10 rounded-xl ${action.bg} flex items-center justify-center`}>
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">{action.label}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm shadow-slate-200 bg-gradient-to-br from-indigo-600 to-primary p-6 text-white rounded-[2rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Star className="h-20 w-20" />
               </div>
               <div className="relative z-10">
                 <h3 className="font-bold text-xl mb-2">Faculty Excellence</h3>
                 <p className="text-white/80 text-sm leading-relaxed mb-6">
                   You are in the top 5% of instructors this semester. Keep up the great work!
                 </p>
                 <Button variant="outline" className="w-full border-white/20 bg-white/10 hover:bg-white hover:text-primary font-bold rounded-xl transition-all">
                   View Performance Report
                 </Button>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
