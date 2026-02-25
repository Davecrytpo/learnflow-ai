import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Award, Bell, Play, Calendar, Sparkles, Target, Users, MessageSquare, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

interface EnrolledCourse {
  id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  courses: {
    id: string;
    title: string;
    cover_image_url: string | null;
    category: string | null;
  };
}

const StudentDashboard = () => {
  const { user } = useAuth();
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
        // Fetch Enrollments
        const { data: enrollRes } = await supabase
          .from("enrollments")
          .select("id, course_id, enrolled_at, completed_at, courses(id, title, cover_image_url, category)")
          .eq("student_id", user.id)
          .eq("status", "approved")
          .order("enrolled_at", { ascending: false });

        // Fetch Student Profile for Goals
        const { data: profileRes } = await supabase
          .from("student_profiles")
          .select("learning_goals")
          .eq("user_id", user.id)
          .single();

        setEnrollments((enrollRes as any) || []);
        setGoals(profileRes?.learning_goals || ["Master React", "Learn System Design"]); // Fallback for demo

        // Mock Progress Data (In real app, calculate from lesson_progress)
        const pData = ((enrollRes as any) || []).slice(0, 5).map((e: any) => ({
          name: e.courses.title.slice(0, 10),
          progress: Math.floor(Math.random() * 80) + 10 // Mock progress
        }));
        setProgressData(pData);

        // Mock Upcoming Classes
        setUpcomingClasses([
          { id: 1, title: "Advanced Patterns Q&A", time: "Tomorrow, 10:00 AM", instructor: "Dr. Smith" },
          { id: 2, title: "Career Coaching Session", time: "Fri, 2:00 PM", instructor: "Career Team" }
        ]);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-8">
        {/* Welcome & Search */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-8 shadow-sm">
          <div className="absolute inset-0 bg-aurora opacity-40" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, Scholar.</h1>
              <p className="mt-2 text-muted-foreground">You're on a 3-day learning streak! Keep it up.</p>
            </div>
            <Button className="bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20">
              <Search className="mr-2 h-4 w-4" /> Find a Tutor (Match System)
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* My Progress */}
            <Card className="border-primary/10 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" /> Learning Velocity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData}>
                      <XAxis dataKey="name" tick={{fontSize: 12}} />
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
                <Link to="/courses" className="text-sm text-primary hover:underline">View All</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {enrollments.slice(0, 4).map((enr) => (
                  <Card key={enr.id} className="group hover:border-primary/30 transition-all cursor-pointer">
                    <CardContent className="p-5 flex gap-4">
                      <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 text-accent font-bold text-xl">
                        {enr.courses.title.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{enr.courses.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{enr.courses.category || "General"}</p>
                        <div className="flex items-center gap-3">
                          <Progress value={45} className="h-1.5 flex-1" />
                          <span className="text-[10px] font-medium text-muted-foreground">45%</span>
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
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-background/50 border border-border/50">
                      <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-sm font-medium">{goal}</span>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full text-xs mt-2">Edit Goals</Button>
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
                  {upcomingClasses.map((cls) => (
                    <div key={cls.id} className="flex gap-3 items-start border-l-2 border-emerald-500/30 pl-3">
                      <div>
                        <p className="text-sm font-semibold">{cls.title}</p>
                        <p className="text-xs text-muted-foreground">{cls.time} • {cls.instructor}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">Full Schedule</Button>
                </div>
              </CardContent>
            </Card>

            {/* Community & Achievements */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-accent/5 transition-colors cursor-pointer">
                <Users className="h-6 w-6 text-primary mb-2" />
                <span className="text-xs font-semibold">Study Groups</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center hover:bg-accent/5 transition-colors cursor-pointer">
                <Award className="h-6 w-6 text-amber-500 mb-2" />
                <span className="text-xs font-semibold">Certificates</span>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
