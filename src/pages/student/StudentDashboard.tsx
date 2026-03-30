import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Award, Bell, Play, Calendar, Sparkles, Target, Users, MessageSquare, Search, Loader2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface EnrolledCourse {
  id: string;
  course_id: any;
  enrolled_at: string;
  completed_at: string | null;
  courses: {
    id: string;
    title: string;
    cover_image_url: string | null;
    category: string | null;
  };
  progress?: number;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [progressData, setProgressData] = useState<{ name: string; progress: number }[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch Enrollments using apiClient
        const enrollsRes = await apiClient.fetch("/enrollments/me");
        
        // Transform MongoDB structure to match component expectations
        const enrolls = enrollsRes.map((enr: any) => ({
          id: enr._id,
          course_id: enr.course_id?._id || enr.course_id,
          enrolled_at: enr.enrolled_at,
          completed_at: enr.completed_at,
          courses: {
            id: enr.course_id?._id || enr.course_id,
            title: enr.course_id?.title || "Untitled Course",
            cover_image_url: enr.course_id?.cover_image_url,
            category: enr.course_id?.category
          },
          progress: Math.floor(Math.random() * 100) // Mock progress for now if not in DB
        }));

        setEnrollments(enrolls);
        
        const pData = enrolls.slice(0, 5).map((e: any) => ({
          name: e.courses?.title ? (e.courses.title.length > 15 ? e.courses.title.slice(0, 12) + "..." : e.courses.title) : "Untitled",
          progress: e.progress || 0
        }));
        setProgressData(pData);

        // Fetch Announcements
        try {
          const announcements = await apiClient.fetch("/announcements");
          setUpcomingClasses(announcements.slice(0, 3));
        } catch (e) {
          setUpcomingClasses([]);
        }

        setGoals(["Complete my first course", "Maintain a 5-day streak"]);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-10 pb-20">
        {/* Welcome & Search */}
        <section className="relative overflow-hidden rounded-[3rem] border border-sky-100 bg-white p-12 shadow-2xl shadow-sky-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.4),transparent)]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-60" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
              >
                <Target className="h-3.5 w-3.5" /> Institutional Scholar
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
                Welcome back, <span className="text-sky-600">{user?.display_name?.split(" ")[0] || "Scholar"}</span>.
              </h1>
              <p className="mt-4 text-slate-500 text-xl leading-relaxed">
                You're making excellent progress! You have {enrollments.length} active courses and {upcomingClasses.length} upcoming events today.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold h-14 px-10 rounded-[1.5rem] shadow-xl shadow-sky-200 transition-all hover:scale-105 active:scale-95" onClick={() => navigate("/courses")}>
                  <Search className="mr-3 h-5 w-5" /> Explore Curriculum
                </Button>
                <Button variant="outline" className="h-14 px-10 rounded-[1.5rem] border-slate-200 font-bold hover:bg-slate-50 transition-all" onClick={() => navigate("/dashboard/progress")}>
                  View My Stats
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="h-48 w-48 bg-sky-50 rounded-[3rem] flex items-center justify-center border-4 border-white shadow-inner relative overflow-hidden">
                <Award className="h-24 w-24 text-sky-200 absolute -bottom-4 -right-4 rotate-12" />
                <GraduationCap className="h-20 w-20 text-sky-600 relative z-10" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Learning Momentum */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-sky-500" /> Learning Momentum
                </h2>
                <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-100 font-bold px-3 py-1">Daily Streak: 5 Days</Badge>
              </div>
              <Card className="border-none shadow-sm shadow-slate-200 bg-white rounded-[2.5rem] overflow-hidden p-8">
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData}>
                      <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', padding: '15px' }}
                        cursor={{fill: '#f1f5f9', radius: 12}}
                      />
                      <Bar dataKey="progress" fill="url(#skyGradient)" radius={[10, 10, 10, 10]} barSize={28} />
                      <defs>
                        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </section>

            {/* Current Courses */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-slate-900">Resume Learning</h2>
                <Button variant="ghost" className="text-sky-600 font-bold hover:bg-sky-50 rounded-xl px-4" onClick={() => navigate("/courses")}>View Catalog <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No active enrollments</h3>
                  <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto">Your academic journey is waiting. Explore our diverse course catalog today.</p>
                  <Button className="bg-slate-900 text-white font-bold h-12 px-8 rounded-xl" onClick={() => navigate("/courses")}>Browse All Courses</Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {enrollments.slice(0, 4).map((enr, i) => (
                    <motion.div
                      key={enr.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="group hover:border-sky-300 transition-all cursor-pointer overflow-hidden border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 bg-white rounded-[2.5rem]" onClick={() => navigate(`/course/${enr.course_id}/learn`)}>
                        <CardContent className="p-7">
                          <div className="flex gap-5 items-center">
                            <div className="h-24 w-24 rounded-[1.8rem] bg-sky-50 flex items-center justify-center shrink-0 text-sky-600 font-bold text-3xl overflow-hidden group-hover:scale-105 transition-transform border-4 border-white shadow-sm">
                              {enr.courses.cover_image_url ? (
                                <img src={enr.courses.cover_image_url} className="h-full w-full object-cover" />
                              ) : enr.courses.title.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Badge className="mb-2 bg-sky-50 text-sky-700 border-none hover:bg-sky-100 font-bold text-[10px] uppercase tracking-wider">{enr.courses.category || "Academic"}</Badge>
                              <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-sky-600 transition-colors leading-tight mb-4">{enr.courses.title}</h3>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                                  <span>Progress</span>
                                  <span className="text-sky-600">{enr.progress}%</span>
                                </div>
                                <Progress value={enr.progress} className="h-2.5 bg-slate-100" indicatorClassName="bg-gradient-to-r from-sky-600 to-sky-400" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Academic Goals */}
            <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Target className="h-24 w-24 text-white" />
              </div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-xl font-display font-bold flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-sky-400" />
                  </div>
                  My Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {goals.map((goal, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors">
                      <div className="h-6 w-6 rounded-full border-2 border-sky-500/50 flex items-center justify-center group-hover:border-sky-400">
                        <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                      </div>
                      <span className="text-sm font-medium text-slate-200">{goal}</span>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full h-12 text-sm mt-4 border-2 border-dashed border-white/10 text-slate-300 hover:text-white hover:border-white/20 rounded-2xl" onClick={() => navigate("/dashboard/learning-plan")}>Edit My Roadmap</Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Schedule */}
            <Card className="border-none shadow-sm shadow-slate-200 rounded-[2.5rem]">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-display font-bold flex items-center gap-3 text-slate-800">
                   <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-emerald-500" />
                  </div>
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingClasses.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-slate-200" />
                      </div>
                      <p className="text-sm text-slate-400 italic">No sessions scheduled.</p>
                    </div>
                  ) : (
                    upcomingClasses.map((cls) => (
                      <div key={cls.id} className="flex gap-4 items-start group">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                           <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-600">FRI</span>
                           <span className="text-lg font-black text-slate-700 group-hover:text-emerald-700 leading-none">12</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">{cls.title}</p>
                          <p className="text-xs text-slate-400 font-bold mt-1">
                            {new Date(cls.start_time).toLocaleString(undefined, { hour: 'numeric', minute: 'numeric' })} • Virtual Room
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50" onClick={() => navigate("/dashboard/calendar")}>Full Academic Calendar</Button>
                </div>
              </CardContent>
            </Card>

            {/* Hubs */}
            <div className="grid grid-cols-2 gap-5">
              <Card className="flex flex-col items-center justify-center p-6 text-center hover:bg-sky-50 transition-all cursor-pointer rounded-[2rem] border-none shadow-sm group" onClick={() => navigate("/dashboard/groups")}>
                <div className="h-12 w-12 bg-sky-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-sky-600" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-sky-600">Hubs</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-6 text-center hover:bg-amber-50 transition-all cursor-pointer rounded-[2rem] border-none shadow-sm group" onClick={() => navigate("/dashboard/certificates")}>
                <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-600">Awards</span>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};


export default StudentDashboard;
