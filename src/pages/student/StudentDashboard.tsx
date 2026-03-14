import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";
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
  _id: string;
  course_id: {
    _id: string;
    title: string;
    cover_image_url: string | null;
    category: string | null;
  };
  enrolled_at: string;
  completed_at: string | null;
  progress?: number;
}

const StudentDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [progressData, setProgressData] = useState<{ name: string; progress: number }[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await api.get("/enrollments/me");
        const enrolls = response.data.map((enr: any) => ({
          ...enr,
          progress: Math.floor(Math.random() * 100) // Mocking progress for now
        }));

        setEnrollments(enrolls);
        
        const pData = enrolls.slice(0, 5).map((e: any) => ({
          name: e.course_id?.title ? (e.course_id.title.length > 15 ? e.course_id.title.slice(0, 12) + "..." : e.course_id.title) : "Untitled",
          progress: e.progress || 0
        }));
        setProgressData(pData);

        setGoals(["Complete my first course", "Maintain a 5-day streak"]);
        setUpcomingClasses([]);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-8 shadow-sm">
          <div className="absolute inset-0 bg-aurora opacity-40" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || "Scholar"}.
              </h1>
              <p className="mt-2 text-muted-foreground">Continue your journey. You have {enrollments.length} active courses.</p>
            </div>
            <Button className="bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20" onClick={() => navigate("/courses")}>
              <Search className="mr-2 h-4 w-4" /> Browse Course Catalog
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* My Progress */}
            <Card className="border-primary/10 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Learning Velocity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData}>
                      <XAxis dataKey="name" tick={{fontSize: 10}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{fill: 'transparent'}}
                      />
                      <Bar dataKey="progress" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} barSize={30} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Current Courses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Jump Back In</h2>
                <Link to="/student/courses" className="text-sm text-primary hover:underline">View All</Link>
              </div>
              {enrollments.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-3xl bg-slate-50">
                  <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No active courses. Explore our catalog!</p>
                  <Button variant="link" className="mt-2" onClick={() => navigate("/courses")}>Go to Catalog</Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {enrollments.slice(0, 4).map((enr) => (
                    <Card key={enr._id} className="group hover:border-primary/30 transition-all cursor-pointer overflow-hidden" onClick={() => navigate(`/student/course/${enr.course_id?._id}`)}>
                      <CardContent className="p-5 flex gap-4">
                        <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 text-accent font-bold text-xl overflow-hidden">
                          {enr.course_id?.cover_image_url ? (
                            <img src={enr.course_id.cover_image_url} className="h-full w-full object-cover" />
                          ) : enr.course_id?.title?.charAt(0) || "C"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{enr.course_id?.title || "Untitled Course"}</h3>
                          <p className="text-xs text-muted-foreground mb-3">{enr.course_id?.category || "General"}</p>
                          <div className="flex items-center gap-3">
                            <Progress value={enr.progress} className="h-1.5 flex-1" />
                            <span className="text-[10px] font-medium text-muted-foreground">{enr.progress}%</span>
                          </div>
                        </div>
                        <div className="self-center">
                          <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary">
                            <Play className="h-3 w-3 ml-0.5" />
                          </Button>
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
                  <Button variant="ghost" size="sm" className="w-full text-xs mt-2 border-dashed border-2 rounded-xl">Edit Learning Plan</Button>
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
                  <Button variant="outline" size="sm" className="w-full rounded-xl">View Schedule</Button>
                </div>
              </CardContent>
            </Card>

            {/* Community & Achievements */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-accent/5 transition-colors cursor-pointer rounded-2xl border-none shadow-sm" onClick={() => navigate("/student/groups")}>
                <Users className="h-6 w-6 text-primary mb-2" />
                <span className="text-xs font-bold uppercase tracking-tighter">Groups</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-accent/5 transition-colors cursor-pointer rounded-2xl border-none shadow-sm" onClick={() => navigate("/student/certificates")}>
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
