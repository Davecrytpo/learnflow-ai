import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Users, Award, Star, 
  PlusCircle, ClipboardCheck, MessageSquare, 
  ArrowRight, Layout, Sparkles, Loader2,
  TrendingUp, Calendar, Zap, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { analyzeStudentPerformance } from "@/lib/ai-service";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  
  const [stats, setStats] = useState({
    students: 0,
    rating: 4.9,
    activeCourses: 0,
    submissions: 0
  });

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [statsData, coursesData, pendingSubs] = await Promise.all([
        apiClient.fetch("/instructor/stats"),
        apiClient.fetch("/instructor/courses"),
        apiClient.fetch("/instructor/submissions/pending")
      ]);
      
      setStats({
        ...statsData,
        submissions: pendingSubs?.length || 0
      });
      setCourses(coursesData || []);
    } catch (err: any) {
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
      const dataSummary = await apiClient.fetch("/instructor/performance-data");
      const analysis = await analyzeStudentPerformance(dataSummary);
      setAiAnalysis(analysis);
      toast({ title: "Analysis Complete", description: "AI has reviewed your cohort performance." });
    } catch (err: any) {
      toast({ title: "AI Analysis Failed", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-10 pb-24 max-w-7xl mx-auto">
        
        {/* Faculty Command Header */}
        <section className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-950 p-10 md:p-16 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
             <Layout className="w-full h-full text-indigo-500" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20"
              >
                <ShieldCheck className="h-4 w-4" /> Academic Faculty Command
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                Professor {user?.display_name?.split(' ').pop() || "Educator"}
              </h1>
              
              <p className="text-slate-400 max-w-2xl text-xl font-medium leading-relaxed">
                Welcome to your institutional hub. Direct your curriculum, analyze scholar velocity, and orchestrate learning at scale.
              </p>
              
              <div className="flex flex-wrap gap-5 pt-4">
                <Button 
                  onClick={() => navigate("/instructor/courses/new")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black h-16 px-10 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 text-lg"
                >
                  <PlusCircle className="mr-3 h-6 w-6" /> Create Curriculum
                </Button>
                <Button 
                  variant="outline"
                  className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-white font-bold h-16 px-10 rounded-2xl backdrop-blur-md transition-all text-lg"
                  onClick={() => navigate("/instructor/grading")}
                >
                  <ClipboardCheck className="mr-3 h-6 w-6" /> Grading Queue ({stats.submissions})
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block shrink-0">
               <div className="h-72 w-72 rounded-[4rem] bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center relative group overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Zap className="h-32 w-32 text-indigo-500 relative z-10 animate-pulse" />
               </div>
            </div>
          </div>
        </section>

        {/* Executive Stats Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Enrolled Scholars", value: stats.students, icon: Users, color: "text-indigo-400", bg: "bg-indigo-950/40" },
            { label: "Curriculum Rating", value: `${stats.rating}/5.0`, icon: Star, color: "text-amber-400", bg: "bg-amber-950/40" },
            { label: "Active Programs", value: stats.activeCourses, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-950/40" },
            { label: "Pending Reviews", value: stats.submissions, icon: ClipboardCheck, color: "text-rose-400", bg: "bg-rose-950/40" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all border border-slate-800">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`h-14 w-14 rounded-2xl ${s.bg} flex items-center justify-center transition-transform group-hover:rotate-12`}>
                      <s.icon className={`h-7 w-7 ${s.color}`} />
                    </div>
                    <TrendingUp className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{s.label}</p>
                  <h3 className="text-4xl font-black">{s.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Faculty Assistant & Analytics */}
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden relative group h-full">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <Sparkles className="h-64 w-64 text-indigo-600" />
              </div>
              <CardHeader className="p-10 pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <CardTitle className="text-3xl font-display font-bold flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-indigo-600" />
                      </div>
                      AI Diagnostic Engine
                    </CardTitle>
                    <CardDescription className="text-lg mt-2 font-medium text-slate-500">Real-time pedagogical insights and risk analysis.</CardDescription>
                  </div>
                  <Button 
                    onClick={handleAiAnalysis} 
                    disabled={analyzing || courses.length === 0}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-16 px-10 rounded-2xl shadow-xl shadow-indigo-100 transition-all"
                  >
                    {analyzing ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <Sparkles className="mr-3 h-6 w-6" />}
                    Generate Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-8">
                {aiAnalysis ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="prose prose-indigo max-w-none bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner overflow-y-auto max-h-[500px]"
                    dangerouslySetInnerHTML={{ __html: aiAnalysis }}
                  />
                ) : (
                  <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                       <Zap className="h-10 w-10 text-indigo-200" />
                    </div>
                    <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed text-lg">
                      Initialize AI diagnosis to visualize scholastic trends and risk factors.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-4">
            <Card className="border-none shadow-sm bg-slate-950 text-white rounded-[3rem] p-10 h-full relative overflow-hidden">
               <div className="absolute -right-20 -bottom-20 opacity-10">
                  <TrendingUp className="h-80 w-80" />
               </div>
               <div className="relative z-10 space-y-10">
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-2">Cohort Engagement</h3>
                    <p className="text-slate-400 text-sm">Real-time scholar activity index.</p>
                  </div>
                  
                  <div className="space-y-8">
                    {[
                      { label: "Content Mastery", value: 84, color: "bg-indigo-500" },
                      { label: "Discussion Velocity", value: 62, color: "bg-emerald-500" },
                      { label: "Assessment Rigor", value: 78, color: "bg-amber-500" }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{stat.label}</span>
                          <span className="text-white">{stat.value}%</span>
                        </div>
                        <Progress value={stat.value} className="h-2 bg-white/10" indicatorClassName={stat.color} />
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-10 border-t border-white/10">
                    <Button variant="ghost" className="w-full h-14 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10" onClick={() => navigate("/instructor/analytics")}>
                      View Detailed Metrics
                    </Button>
                  </div>
               </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Active Registry */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-3xl font-display font-bold text-slate-900">Program Registry</h2>
              <Button variant="ghost" className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:bg-indigo-50 rounded-xl px-6" onClick={() => navigate("/instructor/courses")}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2].map(i => <div key={i} className="h-48 animate-pulse bg-slate-100 rounded-[3rem]" />)}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <BookOpen className="h-20 w-20 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Programs</h3>
                <p className="text-slate-500 mb-10 max-w-xs mx-auto text-lg font-medium">Begin your tenure by architecting your primary course curriculum.</p>
                <Button className="h-14 px-10 rounded-2xl font-black text-lg bg-slate-950 hover:bg-indigo-600 transition-colors" onClick={() => navigate("/instructor/courses/new")}>
                  Initiate Course Architecture
                </Button>
              </div>
            ) : (
              <div className="grid gap-8">
                {courses.slice(0, 3).map((course, i) => (
                  <motion.div
                    key={course._id || course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="border-none shadow-sm hover:shadow-2xl transition-all group overflow-hidden bg-white rounded-[3rem]">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="w-full md:w-72 h-52 md:h-auto relative bg-slate-950 overflow-hidden shrink-0">
                            {course.cover_image_url ? (
                              <img src={course.cover_image_url} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <BookOpen className="h-16 w-16 text-slate-800" />
                              </div>
                            )}
                            <div className="absolute top-6 left-6">
                              <div className={`px-4 py-1.5 rounded-xl text-white font-black text-[10px] uppercase tracking-widest ${course.published ? "bg-emerald-500" : "bg-indigo-600"}`}>
                                {course.published ? "Institutional Live" : "Draft Status"}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 p-10 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.category || "Academic"}</span>
                                <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.level || "UG"}</span>
                              </div>
                              <h3 className="font-bold text-3xl text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight mb-4">{course.title}</h3>
                              <div className="flex flex-wrap items-center gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Users className="h-4 w-4" /> 128 Scholars</span>
                                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Updated {new Date(course.updated_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-8">
                               <div className="flex -space-x-4">
                                  {[1,2,3,4].map(x => (
                                    <div key={x} className="h-10 w-10 rounded-2xl border-4 border-white bg-slate-100 shadow-sm" />
                                  ))}
                                  <div className="h-10 w-10 rounded-2xl border-4 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">+42</div>
                               </div>
                               <Button size="lg" onClick={() => navigate(`/instructor/courses/${course._id || course.id}`)} className="rounded-2xl font-black h-12 px-8 bg-slate-950 hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/20">
                                 Manage Program
                               </Button>
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

          {/* Operational Hub */}
          <div className="lg:col-span-4 space-y-10">
            <section className="space-y-6">
               <h2 className="text-2xl font-display font-bold text-slate-900 px-4">Faculty Nexus</h2>
               <Card className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden">
                <CardContent className="p-6 space-y-2">
                  {[
                    { label: "Scholastic Grading", icon: ClipboardCheck, href: "/instructor/grading", color: "text-rose-500", bg: "bg-rose-50" },
                    { label: "Instructional Analytics", icon: TrendingUp, href: "/instructor/analytics", color: "text-indigo-500", bg: "bg-indigo-50" },
                    { label: "Attendance Control", icon: Calendar, href: "/instructor/attendance", color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Scholarly Discourse", icon: MessageSquare, href: "/instructor/discussions", color: "text-amber-500", bg: "bg-amber-50" },
                  ].map((action, i) => (
                    <Link 
                      key={i} 
                      to={action.href} 
                      className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                    >
                      <div className={`h-14 w-14 rounded-2xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                        <action.icon className={`h-7 w-7 ${action.color}`} />
                      </div>
                      <span className="font-black text-slate-700 group-hover:text-indigo-600 transition-colors text-lg">{action.label}</span>
                      <ArrowRight className="ml-auto h-5 w-5 text-slate-200 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </section>

            <Card className="border-none shadow-2xl bg-indigo-600 p-10 text-white rounded-[3.5rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                  <Award className="h-40 w-40" />
               </div>
               <div className="relative z-10">
                 <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-black uppercase tracking-widest text-[10px] inline-block mb-8">
                   Faculty Excellence
                 </div>
                 <h3 className="font-display font-bold text-4xl mb-6">Institutional Merit</h3>
                 <p className="text-indigo-50/80 text-xl leading-relaxed mb-12 font-medium">
                   Your pedagogical approach is currently ranked in the top 3% for student engagement metrics this semester.
                 </p>
                 <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black h-16 rounded-[1.5rem] shadow-2xl transition-all text-lg">
                   Full Merit Report
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
