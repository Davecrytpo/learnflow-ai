import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { BookOpen, Users, ClipboardCheck, PlusCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const coursesRes = await supabase
        .from("courses")
        .select("id, title, published, created_at")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (coursesRes.error) throw coursesRes.error;
      const myCourses = coursesRes.data || [];
      setCourses(myCourses);

      if (myCourses.length > 0) {
        const courseIds = myCourses.map((c) => c.id);
        const [enrollRes, subRes, pendingRes, profilesRes] = await Promise.all([
          supabase.from("enrollments").select("id, course_id").in("course_id", courseIds).eq("status", "approved"),
          supabase.from("submissions").select("id, assignment_id, graded_at").is("graded_at", null),
          supabase.from("enrollments").select("*").in("course_id", courseIds).eq("instructor_approved", false).eq("status", "pending"),
          supabase.from("profiles").select("user_id, display_name")
        ]);

        const enrollments = enrollRes.data || [];
        setEnrollmentCount(enrollments.length);
        setPendingSubmissions(subRes.data?.length || 0);
        
        // Manual mapping to ensure stability
        const pendingWithData = (pendingRes.data || []).map(p => ({
          ...p,
          courses: myCourses.find(c => c.id === p.course_id),
          profiles: (profilesRes.data || []).find(prof => prof.user_id === p.student_id)
        }));
        setPendingStudents(pendingWithData);

        const cData = myCourses.slice(0, 6).map((c) => ({
          name: c.title.slice(0, 15),
          students: enrollments.filter((e) => e.course_id === c.id).length,
        }));
        setChartData(cData);
      }
    } catch (err: any) {
      console.error("Instructor Dashboard Error:", err);
      toast({ title: "Sync Failed", description: err.message || "Could not retrieve instructor data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const approveStudent = async (enrollId: string) => {
    const { error } = await supabase.from("enrollments").update({ instructor_approved: true }).eq("id", enrollId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Student Approved", description: "Waiting for final admin confirmation." }); fetchData(); }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Instructor</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course operations at a glance</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Monitor enrollments, grading workload, and learner momentum from a single workspace.
              </p>
            </div>
            <Button asChild className="h-11 px-5">
              <Link to="/instructor/courses/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Course
              </Link>
            </Button>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-brand" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-8 w-16 animate-pulse rounded-md bg-muted" /> : <p className="text-2xl font-bold">{courses.length}</p>}
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-accent to-amber-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-8 w-16 animate-pulse rounded-md bg-muted" /> : <p className="text-2xl font-bold">{enrollmentCount}</p>}
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Grading</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-8 w-16 animate-pulse rounded-md bg-muted" /> : <p className="text-2xl font-bold">{pendingSubmissions}</p>}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {chartData.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Enrollment by Course</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="students" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* New Pending Student Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending Students</CardTitle>
              {pendingStudents.length > 0 && <Badge className="bg-primary">{pendingStudents.length}</Badge>}
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No student requests to review.</p>
              ) : (
                pendingStudents.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                    <div>
                      <p className="text-sm font-semibold">{(s as any).profiles?.display_name || "New Student"}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{(s as any).courses?.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs border-primary/50 text-primary" onClick={() => approveStudent(s.id)}>Approve</Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive">Reject</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Your Courses</h2>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />)}
            </div>
          ) : courses.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">You haven't created any courses yet.</p>
              <Button asChild className="mt-4">
                <Link to="/instructor/courses/new"><PlusCircle className="mr-2 h-4 w-4" /> Create Your First Course</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <Card key={c.id} className="overflow-hidden">
                  <div className={`h-2 w-full ${c.published ? "bg-gradient-brand" : "bg-muted"}`} />
                  <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground line-clamp-1">{c.title}</h3>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${c.published ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {c.published ? "Published" : "Draft"}
                  </span>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/instructor/courses/${c.id}`}>Edit</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/instructor/courses/${c.id}/gradebook`}>Gradebook</Link>
                    </Button>
                  </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
