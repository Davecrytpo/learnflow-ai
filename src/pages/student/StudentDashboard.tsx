import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Award, TrendingUp, Calendar, 
  Search, ArrowRight, Target, Users,
  Sparkles, QrCode, Play, CheckCircle2,
  Clock, Loader2, Star
} from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

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
  const [progressData, setProgressData] = useState<{ name: string; progress: number }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [enrollsRes, lessonProgress] = await Promise.all([
          apiClient.fetch("/enrollments/me"),
          apiClient.db.from("lesson_progress").select("*").eq("user_id", user.id).execute()
        ]);
        const progressItems = lessonProgress.data || [];

        const enrolls = enrollsRes.map((enr: any) => ({
          id: enr._id || enr.id,
          course_id: enr.course_id?._id || enr.course_id,
          enrolled_at: enr.enrolled_at,
          completed_at: enr.completed_at,
          courses: {
            id: enr.course_id?._id || enr.course_id,
            title: enr.course_id?.title || "Untitled Course",
            cover_image_url: enr.course_id?.cover_image_url,
            category: enr.course_id?.category
          },
          progress: (() => {
            const courseProgress = progressItems.filter((item: any) => (item.course_id?._id || item.course_id?.id || item.course_id) === (enr.course_id?._id || enr.course_id));
            if (courseProgress.length === 0) {
              return 0;
            }
            const completed = courseProgress.filter((item: any) => item.completed).length;
            return Math.round((completed / courseProgress.length) * 100);
          })()
        }));

        setEnrollments(enrolls);
        
        const pData = enrolls.slice(0, 5).map((e: any) => ({
          name: e.courses?.title ? (e.courses.title.length > 12 ? e.courses.title.slice(0, 10) + ".." : e.courses.title) : "Unit",
          progress: e.progress || 0
        }));
        setProgressData(pData);

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
          <p className="text-sky-600 font-black uppercase tracking-widest text-xs">Accessing Scholar Registry...</p>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-12 pb-32 max-w-7xl mx-auto">
        
        {/* Scholar Welcome Header */}
        <section className="relative overflow-hidden rounded-[3.5rem] border border-sky-100 bg-white p-12 lg:p-20 shadow-2xl shadow-sky-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.5),transparent)]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-50 rounded-full blur-3xl opacity-60" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-sky-200 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" /> Institutional Academic Hub
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
                Ready for your <br/><span className="text-sky-600">next milestone?</span>
              </h1>
              
              <p className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
                Greetings, {user?.display_name?.split(" ")[0] || "Scholar"}. You currently oversee {enrollments.length} active courses. Excellence awaits.
              </p>
              
              <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6">
                <Button 
                  className="bg-sky-600 hover:bg-sky-700 text-white font-black h-16 px-12 rounded-3xl shadow-2xl shadow-sky-200 transition-all hover:scale-105 active:scale-95 text-lg" 
                  onClick={() => navigate("/courses")}
                >
                  <Search className="mr-3 h-6 w-6" /> Explore Curriculum
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 px-12 rounded-3xl border-slate-200 font-bold hover:bg-slate-50 transition-all text-lg shadow-sm" 
                  onClick={() => navigate("/dashboard/progress")}
                >
                  Performance Analytics
                </Button>
              </div>
            </div>
            
            <div className="hidden xl:block shrink-0">
               <Card className="p-8 bg-slate-950 text-white border-none rounded-[2.5rem] shadow-2xl w-80 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                    <Award className="h-32 w-32" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">Scholar Level</p>
                      <h3 className="text-4xl font-black">Level 12</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>Academic XP</span>
                        <span className="text-sky-400">2,450 / 3,000</span>
                      </div>
                      <Progress value={80} className="h-2 bg-white/10" indicatorClassName="bg-sky-500" />
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Recent Badges</p>
                      <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Star className="h-5 w-5 text-amber-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
               </Card>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Academic Track */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Learning Momentum */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-4">
                  <TrendingUp className="h-8 w-8 text-sky-500" /> Growth Momentum
                </h2>
                <div className="flex gap-3">
                   <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black px-4 py-1.5 rounded-xl uppercase tracking-tighter shadow-sm">Daily Streak: 12</Badge>
                   <Badge className="bg-sky-50 text-sky-700 border-sky-100 font-black px-4 py-1.5 rounded-xl uppercase tracking-tighter shadow-sm">GUI Score: 2,450</Badge>
                </div>
              </div>
              
              <Card className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden p-10">
                <div className="h-[280px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData}>
                      <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 900}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                        cursor={{fill: '#f0f9ff', radius: 16}}
                      />
                      <Bar dataKey="progress" fill="url(#skyGradient)" radius={[12, 12, 12, 12]} barSize={32} />
                      <defs>
                        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0.6}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </section>

            {/* Current Enrolled Courses */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-display font-bold text-slate-900">Active Curriculum</h2>
                <Button variant="ghost" className="text-sky-600 font-black text-sm uppercase tracking-widest hover:bg-sky-50 rounded-xl px-6" onClick={() => navigate("/courses")}>
                  Manage All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3.5rem] border-4 border-dashed border-sky-50 shadow-sm">
                  <div className="h-24 w-24 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <BookOpen className="h-12 w-12 text-sky-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Enrollments</h3>
                  <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">Your academic journey is waiting. Discover elite programs tailored for your growth.</p>
                  <Button className="bg-slate-950 text-white font-black h-14 px-10 rounded-2xl text-lg hover:bg-sky-600 transition-colors" onClick={() => navigate("/courses")}>Discover Programs</Button>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2">
                  {enrollments.slice(0, 4).map((enr, i) => (
                    <motion.div
                      key={enr.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="group hover:border-sky-300 transition-all cursor-pointer overflow-hidden border-none shadow-sm hover:shadow-2xl hover:shadow-sky-500/10 bg-white rounded-[3rem]">
                        <CardContent className="p-8">
                          <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                              <div className="h-20 w-20 rounded-[1.8rem] bg-sky-50 flex items-center justify-center shrink-0 text-sky-600 font-black text-3xl overflow-hidden group-hover:rotate-3 transition-transform border-4 border-sky-50 shadow-sm">
                                {enr.courses.cover_image_url ? (
                                  <img src={enr.courses.cover_image_url} className="h-full w-full object-cover" />
                                ) : enr.courses.title.charAt(0)}
                              </div>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="icon" variant="ghost" className="rounded-2xl h-12 w-12 text-slate-300 hover:text-sky-600 hover:bg-sky-50 transition-all border border-transparent hover:border-sky-100">
                                    <QrCode className="h-6 w-6" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-[3rem] p-10 max-w-md">
                                  <DialogHeader className="text-center space-y-4">
                                    <div className="h-16 w-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto">
                                      <QrCode className="h-8 w-8 text-sky-600" />
                                    </div>
                                    <DialogTitle className="text-2xl font-black">Course Smart-Access</DialogTitle>
                                    <DialogDescription className="text-lg font-medium">Scan to instantly resume this course on any mobile device.</DialogDescription>
                                  </DialogHeader>
                                  <div className="flex flex-col items-center justify-center py-10 space-y-8">
                                    <div className="p-6 bg-white rounded-[2.5rem] shadow-2xl border-8 border-sky-50">
                                      <QRCodeCanvas 
                                        value={`${window.location.origin}/course/${enr.course_id}/learn`} 
                                        size={200}
                                        level="H"
                                        includeMargin={false}
                                        imageSettings={{
                                          src: "/favicon.ico",
                                          x: undefined,
                                          y: undefined,
                                          height: 40,
                                          width: 40,
                                          excavate: true,
                                        }}
                                      />
                                    </div>
                                    <div className="text-center">
                                      <p className="font-bold text-slate-900">{enr.courses.title}</p>
                                      <p className="text-sm text-slate-400 font-black uppercase tracking-widest mt-1">Institutional ID: {enr.course_id.slice(-8).toUpperCase()}</p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Badge className="mb-2 bg-sky-50 text-sky-700 border-none hover:bg-sky-100 font-black text-[9px] uppercase tracking-[0.2em]">{enr.courses.category || "Academic Program"}</Badge>
                                <h3 className="font-bold text-2xl text-slate-900 group-hover:text-sky-600 transition-colors leading-tight line-clamp-1">{enr.courses.title}</h3>
                              </div>
                              
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <span>Curriculum Progress</span>
                                  <span className="text-sky-600">{enr.progress}%</span>
                                </div>
                                <Progress value={enr.progress} className="h-3 bg-slate-50 border border-slate-100" indicatorClassName="bg-gradient-to-r from-sky-600 to-sky-400" />
                              </div>
                              
                              <Button 
                                className="w-full mt-4 bg-slate-950 hover:bg-sky-600 text-white font-black h-14 rounded-2xl transition-all shadow-lg hover:shadow-sky-500/20 group/btn"
                                onClick={() => navigate(`/course/${enr.course_id}/learn`)}
                              >
                                Resume Learning
                                <Play className="ml-3 h-4 w-4 fill-current transition-transform group-hover/btn:translate-x-1" />
                              </Button>
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

          {/* Sidebar Scholar Insights */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Academic Status */}
            <Card className="bg-slate-950 text-white border-none shadow-2xl rounded-[3rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                <Target className="h-32 w-32 text-white" />
              </div>
              <CardHeader className="p-8 pb-4 relative z-10">
                <CardTitle className="text-2xl font-display font-bold flex items-center gap-4">
                  <div className="h-12 w-12 rounded-[1.2rem] bg-white/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-sky-400" />
                  </div>
                  Scholarly Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 relative z-10">
                <div className="space-y-4">
                  {[
                    { label: "Complete First Semester", icon: CheckCircle2, status: "active" },
                    { label: "Achieve 4.0 GPA Index", icon: TrendingUp, status: "pending" },
                    { label: "Publish Research Entry", icon: Award, status: "pending" }
                  ].map((goal, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-white/5 border border-white/10 group hover:bg-white/10 transition-all">
                      <goal.icon className={`h-5 w-5 ${goal.status === 'active' ? 'text-sky-400' : 'text-slate-600'}`} />
                      <span className="text-sm font-bold text-slate-200">{goal.label}</span>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full h-14 text-xs font-black uppercase tracking-widest mt-6 border-2 border-dashed border-white/10 text-slate-400 hover:text-white hover:border-white/30 rounded-2xl transition-all" onClick={() => navigate("/dashboard/learning-plan")}>
                    Optimize Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Academic Schedule */}
            <Card className="border-none shadow-sm bg-white rounded-[3rem]">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-display font-bold flex items-center gap-4 text-slate-900">
                   <div className="h-12 w-12 rounded-[1.2rem] bg-emerald-50 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-emerald-500" />
                  </div>
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="space-y-8">
                  {[
                    { title: "Advanced Quantum Exam", date: "FRI, MAR 12", time: "10:00 AM", type: "Exam" },
                    { title: "Symmetry in Ethics", date: "MON, MAR 15", time: "02:00 PM", type: "Live" }
                  ].map((evt, idx) => (
                    <div key={idx} className="flex gap-5 items-start group">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center shrink-0 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all shadow-sm">
                         <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-600 leading-none mb-1">{evt.date.split(',')[0]}</span>
                         <span className="text-xl font-black text-slate-900 group-hover:text-emerald-700 leading-none">{evt.date.split(' ')[2]}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">{evt.type}</span>
                        </div>
                        <p className="text-sm font-black text-slate-800 truncate group-hover:text-emerald-700 transition-colors mt-1">{evt.title}</p>
                        <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                          <Clock className="h-3 w-3" /> {evt.time} • Room 402
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all" onClick={() => navigate("/dashboard/calendar")}>
                    Institutional Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Hubs */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="flex flex-col items-center justify-center p-8 text-center hover:bg-sky-50 transition-all cursor-pointer rounded-[2.5rem] border-none shadow-sm group active:scale-95" onClick={() => navigate("/dashboard/discussions")}>
                <div className="h-14 w-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <Users className="h-7 w-7 text-sky-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-sky-600">Discussion</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-8 text-center hover:bg-amber-50 transition-all cursor-pointer rounded-[2.5rem] border-none shadow-sm group active:scale-95" onClick={() => navigate("/dashboard/certificates")}>
                <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <Award className="h-7 w-7 text-amber-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-600">Vault</span>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
