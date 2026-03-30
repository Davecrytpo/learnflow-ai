import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { analyzeStudentPerformance } from "@/lib/ai-service";
import { apiClient } from "@/lib/api-client";

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
      // Fetch stats and courses from MongoDB via apiClient
      const [statsData, coursesData] = await Promise.all([
        apiClient.fetch("/instructor/stats"),
        apiClient.fetch("/instructor/courses")
      ]);
      
      setStats(statsData);
      setCourses(coursesData || []);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Fetch failed", description: err.message, variant: "destructive" });
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
      const dataSummary = await apiClient.fetch("/instructor/performance-data");
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
      <div className="space-y-12 pb-24">
        
        {/* Academic Header */}
        <section className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-950 p-10 md:p-16 text-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-2/3 h-full opacity-5 pointer-events-none">
             <Layout className="w-full h-full text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-950" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-indigo-500/20"
              >
                <Award className="h-4 w-4" /> Distinguished Faculty
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                Professor {user?.display_name?.split(' ').pop() || "Educator"}
              </h1>
              <p className="text-slate-400 max-w-2xl text-xl leading-relaxed font-medium">
                Your institutional command center. Oversee your curriculum, analyze scholarly performance, and leverage AI-driven educational insights.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-5">
                <Button 
                  onClick={() => navigate("/instructor/courses/new")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-14 px-10 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105"
                >
                  <PlusCircle className="mr-3 h-6 w-6" /> Create Curriculum
                </Button>
                <Button 
                  variant="outline"
                  className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-white font-bold h-14 px-10 rounded-2xl backdrop-blur-md transition-all"
                  onClick={() => navigate("/instructor/grading")}
                >
                  <ClipboardCheck className="mr-3 h-6 w-6" /> Grading Queue
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block shrink-0">
               <div className="h-64 w-64 rounded-[4rem] bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center relative group overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <GraduationCap className="h-32 w-32 text-indigo-500 relative z-10" />
               </div>
            </div>
          </div>
        </section>

        {/* Executive Stats Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Students", value: stats.students, icon: Users, color: "text-indigo-400", bg: "bg-indigo-950/40", border: "border-indigo-500/10" },
            { label: "Completion Rate", value: "88%", icon: Award, color: "text-emerald-400", bg: "bg-emerald-950/40", border: "border-emerald-500/10" },
            { label: "Faculty Rating", value: stats.rating, icon: Star, color: "text-amber-400", bg: "bg-amber-950/40", border: "border-amber-500/10" },
            { label: "Active Courses", value: stats.activeCourses, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-950/40", border: "border-blue-500/10" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm shadow-slate-200 overflow-hidden group rounded-[2.5rem] bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`h-14 w-14 rounded-2xl ${s.bg} border ${s.border} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <s.icon className={`h-7 w-7 ${s.color}`} />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                       <TrendingUp className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{s.label}</p>
                  <h3 className="text-4xl font-black text-slate-900">{s.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Insight Engine */}
        <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
            <Sparkles className="h-48 w-48 text-indigo-600" />
          </div>
          <CardHeader className="p-10 pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-3xl font-display font-bold flex items-center gap-3">
                  <div className="h-12 w-12 rounded-[1.2rem] bg-indigo-50 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-indigo-600" />
                  </div>
                  Performance Analytics Engine
                </CardTitle>
                <CardDescription className="text-lg mt-2 font-medium text-slate-500">Deep neural analysis of student engagement and curriculum efficacy.</CardDescription>
              </div>
              <Button 
                onClick={handleAiAnalysis} 
                disabled={analyzing || courses.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
              >
                {analyzing ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Sparkles className="mr-3 h-5 w-5" />}
                Run AI Diagnosis
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-8">
            {aiAnalysis ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="prose prose-indigo max-w-none bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner"
                dangerouslySetInnerHTML={{ __html: aiAnalysis }}
              />
            ) : (
              <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                   <Sparkles className="h-10 w-10 text-indigo-200" />
                </div>
                <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                  {courses.length === 0 ? "Curriculum required for analysis." : "The engine is ready. Initialize analysis to visualize student progress trends and risk factors."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Faculty Course Registry */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display font-bold text-slate-900">Course Registry</h2>
              <Button variant="ghost" className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:bg-indigo-50 rounded-xl" asChild>
                <Link to="/instructor/courses">Manage All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2].map(i => <div key={i} className="h-40 animate-pulse bg-slate-100 rounded-[2.5rem]" />)}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Registry is Empty</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">Begin your tenure by architecting your first course curriculum.</p>
                <Button className="h-12 px-8 rounded-xl font-bold" onClick={() => navigate("/instructor/courses/new")}>Initiate Course Creation</Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {courses.slice(0, 3).map((course, i) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="border-none shadow-sm shadow-slate-200 hover:shadow-xl transition-all group overflow-hidden bg-white rounded-[2.5rem]">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row h-full">
                          <div className="w-full sm:w-64 h-44 sm:h-auto relative bg-slate-100 overflow-hidden shrink-0">
                            {course.cover_image_url ? (
                              <img src={course.cover_image_url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-slate-900">
                                <BookOpen className="h-12 w-12 text-slate-700" />
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <Badge className={course.published ? "bg-emerald-500 hover:bg-emerald-600 text-white border-none font-bold px-3 py-1 rounded-lg" : "bg-slate-700 hover:bg-slate-800 text-white border-none font-bold px-3 py-1 rounded-lg"}>
                                {course.published ? "Live" : "Internal Draft"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex-1 p-8">
                            <div className="flex flex-col h-full justify-between">
                              <div>
                                <h3 className="font-bold text-2xl text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-3">{course.title}</h3>
                                <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100"><Users className="h-3.5 w-3.5" /> Scholars Enrolled</span>
                                  <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Updated {new Date(course.updated_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                                <div className="flex -space-x-3">
                                   {[1,2,3,4].map(x => <div key={x} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />)}
                                   <div className="h-8 w-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">+12</div>
                                </div>
                                <Button size="sm" asChild className="rounded-xl font-bold h-10 px-6 bg-slate-900 hover:bg-indigo-600 transition-colors">
                                  <Link to={`/instructor/courses/${course._id}`}>Architect Module</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Institutional Controls */}
          <div className="lg:col-span-4 space-y-10">
            <section className="space-y-6">
               <h2 className="text-2xl font-display font-bold text-slate-900 px-2">Operational Hub</h2>
               <Card className="border-none shadow-sm shadow-slate-200 bg-white rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-4 space-y-2">
                  {[
                    { label: "Grading Matrix", icon: ClipboardCheck, href: "/instructor/grading", color: "text-rose-500", bg: "bg-rose-50" },
                    { label: "Academic Repository", icon: FileText, href: "/instructor", color: "text-amber-500", bg: "bg-amber-50" },
                    { label: "Faculty Schedule", icon: Calendar, href: "/instructor/attendance", color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Discussion Hub", icon: MessageSquare, href: "/instructor/discussions", color: "text-emerald-500", bg: "bg-emerald-50" },
                  ].map((action, i) => (
                    <Link 
                      key={i} 
                      to={action.href} 
                      className="flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                    >
                      <div className={`h-12 w-12 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{action.label}</span>
                      <ArrowRight className="ml-auto h-4 w-4 text-slate-200 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </section>

            <Card className="border-none shadow-2xl bg-indigo-600 p-8 text-white rounded-[3rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <Star className="h-32 w-32" />
               </div>
               <div className="relative z-10">
                 <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-6 px-3 font-bold uppercase tracking-widest text-[10px]">Excellence Award</Badge>
                 <h3 className="font-display font-bold text-3xl mb-4">Academic Impact</h3>
                 <p className="text-indigo-100/80 text-lg leading-relaxed mb-10 font-medium">
                   Your curriculum is currently ranked in the top 5% for scholar retention.
                 </p>
                 <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black h-14 rounded-2xl shadow-xl transition-all">
                   Faculty Performance Report
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
