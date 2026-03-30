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
      <div className="space-y-8">
        {/* Welcome & Search */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-sky-100 bg-white p-10 shadow-xl shadow-sky-500/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.3),transparent)]" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider mb-4"
              >
                <Target className="h-3.5 w-3.5" /> Academic Growth
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
                Welcome back, {user?.display_name?.split(" ")[0] || "Scholar"}.
              </h1>
              <p className="mt-2 text-slate-500 text-lg">You have {enrollments.length} active courses. Ready for the next milestone?</p>
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-sky-200" onClick={() => navigate("/courses")}>
              <Search className="mr-2 h-4 w-4" /> Explore Courses
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* My Progress */}
            <Card className="border-none shadow-sm shadow-slate-200 bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <TrendingUp className="h-5 w-5 text-sky-500" /> Learning Momentum
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData}>
                      <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        cursor={{fill: '#f8fafc', radius: 8}}
                      />
                      <Bar dataKey="progress" fill="url(#skyGradient)" radius={[8, 8, 8, 8]} barSize={24} />
                      <defs>
                        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Current Courses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-slate-900">Resume Learning</h2>
                <Button variant="ghost" className="text-sky-600 font-bold" onClick={() => navigate("/courses")}>View All</Button>
              </div>
              {enrollments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No active courses. Explore our catalog!</p>
                  <Button variant="link" className="mt-2 text-sky-600 font-bold" onClick={() => navigate("/courses")}>Go to Catalog</Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {enrollments.slice(0, 4).map((enr) => (
                    <Card key={enr.id} className="group hover:border-sky-200 transition-all cursor-pointer overflow-hidden border-none shadow-sm shadow-slate-200 rounded-[2rem]" onClick={() => navigate(`/course/${enr.course_id}/learn`)}>
                      <CardContent className="p-6 flex gap-4">
                        <div className="h-20 w-20 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0 text-sky-600 font-bold text-2xl overflow-hidden group-hover:scale-105 transition-transform">
                          {enr.courses.cover_image_url ? (
                            <img src={enr.courses.cover_image_url} className="h-full w-full object-cover" />
                          ) : enr.courses.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="font-bold text-slate-900 truncate group-hover:text-sky-600 transition-colors">{enr.courses.title}</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{enr.courses.category || "General"}</p>
                          <div className="flex items-center gap-3">
                            <Progress value={enr.progress} className="h-2 flex-1 bg-slate-100" indicatorClassName="bg-sky-500" />
                            <span className="text-[10px] font-bold text-slate-500">{enr.progress}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Goals */}
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" /> My Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {goals.map((goal, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                      <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-sm font-medium">{goal}</span>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full text-xs mt-2 border-dashed border-2 rounded-xl" onClick={() => navigate("/dashboard/learning-plan")}>Edit Learning Plan</Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Classes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-500" /> Upcoming Live
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingClasses.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-4">No live sessions scheduled.</p>
                  ) : (
                    upcomingClasses.map((cls) => (
                      <div key={cls.id} className="flex gap-3 items-start border-l-2 border-emerald-500/30 pl-3">
                        <div>
                          <p className="text-sm font-semibold">{cls.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(cls.start_time).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => navigate("/dashboard/calendar")}>View Schedule</Button>
                </div>
              </CardContent>
            </Card>

            {/* Community & Achievements */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-accent/5 transition-colors cursor-pointer rounded-2xl border-none shadow-sm" onClick={() => navigate("/dashboard/groups")}>
                <Users className="h-6 w-6 text-primary mb-2" />
                <span className="text-xs font-bold uppercase tracking-tighter">Groups</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-accent/5 transition-colors cursor-pointer rounded-2xl border-none shadow-sm" onClick={() => navigate("/dashboard/certificates")}>
                <Award className="h-6 w-6 text-amber-500 mb-2" />
                <span className="text-xs font-bold uppercase tracking-tighter">Certificates</span>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
