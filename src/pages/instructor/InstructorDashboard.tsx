import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Users, ClipboardCheck, PlusCircle, 
  DollarSign, TrendingUp, Star, Calendar, 
  ArrowUpRight, Wallet, PlayCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    enrollments: 0,
    earnings: 0,
    rating: 4.8,
    activeStudents: 0
  });
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch Courses
      const { data: myCourses } = await supabase
        .from("courses")
        .select("id, title, published, price_cents")
        .eq("author_id", user.id);
      
      setCourses(myCourses || []);

      if (myCourses && myCourses.length > 0) {
        const courseIds = myCourses.map(c => c.id);
        
        // Fetch Enrollments & Students
        const [enrollRes, pendingRes, profileRes] = await Promise.all([
          supabase.from("enrollments").select("id, course_id").in("course_id", courseIds).eq("status", "approved"),
          supabase.from("enrollments").select("*, courses(title), profiles:student_id(display_name)").in("course_id", courseIds).eq("instructor_approved", false),
          supabase.from("instructor_profiles").select("*").eq("user_id", user.id).single()
        ]);

        setStats({
          enrollments: enrollRes.data?.length || 0,
          earnings: profileRes.data?.earnings_balance || 0,
          rating: profileRes.data?.rating || 4.8,
          activeStudents: enrollRes.data?.length || 0
        });

        setPendingStudents(pendingRes.data || []);

        // Mock Revenue Data
        setRevenueData([
          { month: 'Jan', amount: 400 },
          { month: 'Feb', amount: 700 },
          { month: 'Mar', amount: 1200 },
          { month: 'Apr', amount: 900 },
          { month: 'May', amount: 1500 },
        ]);
      }
    } catch (err: any) {
      console.error("Instructor Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const approveStudent = async (enrollId: string) => {
    const { error } = await supabase.from("enrollments").update({ instructor_approved: true }).eq("id", enrollId);
    if (error) toast({ title: "Error", variant: "destructive" });
    else { toast({ title: "Student Approved" }); fetchData(); }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-8">
        {/* SaaS Header */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-slate-950 p-8 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent)]" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold">Welcome, {user?.user_metadata?.full_name || "Instructor"}.</h1>
              <p className="mt-2 text-slate-400 max-w-md">Your courses have reached 120 new learners this week. Ready to start your next class?</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                <Link to="/instructor/courses/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Course
                </Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                <Calendar className="mr-2 h-4 w-4" /> Schedule Live
              </Button>
            </div>
          </div>
        </section>

        {/* Professional Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Revenue</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">${stats.earnings.toLocaleString()}</p>
                <span className="text-[10px] font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                  <TrendingUp className="h-2 w-2 mr-1" /> +12%
                </span>
              </div>
              <Button variant="link" className="p-0 h-auto text-[10px] mt-2 text-primary" asChild>
                <Link to="/instructor/withdraw">Withdraw Funds <ArrowUpRight className="h-2 w-2 ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Students</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.activeStudents}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Across {courses.length} courses</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Course Rating</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Star className="h-4 w-4 fill-current" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.rating}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Based on 42 reviews</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg. Engagement</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-[10px] text-muted-foreground mt-1">Course completion rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-none shadow-sm bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Revenue Performance</CardTitle>
              <CardDescription>Monthly earnings across all content.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <XAxis dataKey="month" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingStudents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm italic">No pending requests</div>
                ) : (
                  pendingStudents.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50 group hover:border-primary/30 transition-all">
                      <div>
                        <p className="font-semibold text-sm">{s.profiles?.display_name || "Scholar"}</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{s.courses?.title}</p>
                      </div>
                      <Button size="sm" onClick={() => approveStudent(s.id)} className="h-8 text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white">Review</Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-background/50 border-border/50 hover:border-primary/30" asChild>
                  <Link to="/instructor/analytics">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Analytics</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-background/50 border-border/50 hover:border-primary/30" asChild>
                  <Link to="/instructor/grading">
                    <ClipboardCheck className="h-5 w-5 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Grading</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Courses Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">Content Portfolio</h2>
            <Button variant="ghost" asChild className="text-primary"><Link to="/instructor/courses">Manage All →</Link></Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map(c => (
              <Card key={c.id} className="overflow-hidden border-none shadow-sm bg-card/50 hover:shadow-md transition-all group">
                <div className="h-32 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50" />
                  <PlayCircle className="h-12 w-12 text-primary/20 group-hover:text-primary/40 transition-colors" />
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-foreground line-clamp-1">{c.title}</h3>
                    <Badge variant={c.published ? "default" : "secondary"} className="text-[9px] uppercase tracking-tighter">
                      {c.published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                      <Link to={`/instructor/courses/${c.id}`}>Edit Tools</Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-xs" asChild>
                      <Link to={`/instructor/courses/${c.id}/gradebook`}>Insights</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
