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
import { BookOpen, Award, Bell, Play, Calendar, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
  const [pendingEnrollments, setPendingEnrollments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<{ name: string; progress: number }[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<any[]>([]);
  const [recommendations, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [enrollRes, pendingRes, notifRes, recommendRes] = await Promise.all([
          supabase
            .from("enrollments")
            .select("id, course_id, enrolled_at, completed_at, courses(id, title, cover_image_url, category)")
            .eq("student_id", user.id)
            .eq("status", "approved")
            .order("enrolled_at", { ascending: false }),
          supabase
            .from("enrollments")
            .select("*, courses(title)")
            .eq("student_id", user.id)
            .eq("status", "pending"),
          supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .eq("read", false)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("courses")
            .select("*")
            .eq("published", true)
            .limit(3),
        ]);

        if (enrollRes.error) throw enrollRes.error;

        const enr = (enrollRes.data as unknown as EnrolledCourse[]) || [];
        setEnrollments(enr);
        setPendingEnrollments(pendingRes.data || []);
        setNotifications(notifRes.data || []);
        setRecommended(recommendRes.data || []);

        // Calculate progress and fetch assignments
        if (enr.length > 0) {
          const courseIds = enr.map((e) => e.course_id);
          const [lessonsRes, progressRes, assignmentsRes] = await Promise.all([
            supabase.from("lessons").select("id, course_id").in("course_id", courseIds),
            supabase.from("lesson_progress").select("lesson_id, course_id, completed").eq("user_id", user.id).eq("completed", true),
            supabase.from("assignments").select("*, courses(title)").in("course_id", courseIds).gte("due_date", new Date().toISOString()).order("due_date").limit(3),
          ]);
          
          const lessons = lessonsRes.data || [];
          const completed = progressRes.data || [];
          setUpcomingAssignments(assignmentsRes.data || []);

          const pData = enr.slice(0, 6).map((e) => {
            const total = lessons.filter((l) => l.course_id === e.course_id).length;
            const done = completed.filter((c) => c.course_id === e.course_id).length;
            return { name: e.courses.title.slice(0, 15), progress: total > 0 ? Math.round((done / total) * 100) : 0 };
          });
          setProgressData(pData);
        }
      } catch (err: any) {
        console.error("Student Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const completedCount = enrollments.filter((e) => e.completed_at).length;

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Student</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Pick up where you left off, track progress, and stay ahead of your next deadline.
            </p>
          </div>
        </section>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-brand" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{enrollments.length}</p>}
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-accent to-amber-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{completedCount}</p>}
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{notifications.length}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        {progressData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={progressData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Continue Learning */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Continue Learning</h2>
            <Button variant="ghost" size="sm" asChild className="text-primary text-xs"><Link to="/courses">Explore more →</Link></Button>
          </div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
            </div>
          ) : enrollments.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <p className="text-muted-foreground">You don't have any approved courses yet.</p>
              <Button asChild className="mt-4 bg-gradient-brand">
                <Link to="/courses">Browse Catalog</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrollments.slice(0, 6).map((e) => {
                const prog = progressData.find((p) => p.name === e.courses.title.slice(0, 15));
                return (
                  <Card key={e.id} className="overflow-hidden hover:border-primary/40 transition-all group">
                    <div className="h-24 bg-gradient-to-br from-primary/20 to-accent/20 relative">
                      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{e.courses.title}</h3>
                      <p className="text-xs text-muted-foreground">{e.courses.category || "General"}</p>
                      <Progress value={prog?.progress || 0} className="mt-3 h-2" />
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{prog?.progress || 0}% complete</span>
                        <Button size="sm" variant="ghost" asChild className="h-8 text-xs">
                          <Link to={`/course/${e.course_id}/learn`}>
                            <Play className="mr-1 h-3 w-3" /> Resume
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* New Pending Enrollment Requests */}
        {!loading && pendingEnrollments.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" /> Pending Approvals
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingEnrollments.map((p) => (
                <Card key={p.id} className="border-amber-200/50 bg-amber-50/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600">PENDING</Badge>
                      <span className="text-[10px] text-muted-foreground">{new Date(p.enrolled_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-1">{p.courses?.title}</h4>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px]">
                        <div className={`h-1.5 w-1.5 rounded-full ${p.instructor_approved ? "bg-emerald-500" : "bg-slate-300"}`} />
                        <span className={p.instructor_approved ? "text-emerald-600 font-medium" : "text-muted-foreground"}>Instructor Approval</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <div className={`h-1.5 w-1.5 rounded-full ${p.admin_approved ? "bg-emerald-500" : "bg-slate-300"}`} />
                        <span className={p.admin_approved ? "text-emerald-600 font-medium" : "text-muted-foreground"}>Final Admin Approval</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Deadlines and Recommendations */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" /> Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : upcomingAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No upcoming deadlines. Great job!</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAssignments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                      <div>
                        <p className="font-medium text-foreground">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.courses?.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-destructive">
                          {new Date(a.due_date).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Due Date</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" /> AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((r) => (
                    <Link key={r.id} to={`/course/${r.id}`} className="block group">
                      <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm transition-colors hover:bg-accent/5">
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">{r.title}</p>
                          <p className="text-xs text-muted-foreground">{r.category}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Notifications</h2>
            <div className="space-y-2">
              {notifications.map((n) => (
                <Card key={n.id} className="p-4">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
