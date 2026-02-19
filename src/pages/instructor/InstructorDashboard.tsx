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
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const coursesRes = await supabase
        .from("courses")
        .select("id, title, published, created_at")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      const myCourses = coursesRes.data || [];
      setCourses(myCourses);

      if (myCourses.length > 0) {
        const courseIds = myCourses.map((c) => c.id);
        const [enrollRes, subRes] = await Promise.all([
          supabase.from("enrollments").select("id, course_id").in("course_id", courseIds),
          supabase.from("submissions").select("id, assignment_id, graded_at").is("graded_at", null),
        ]);

        const enrollments = enrollRes.data || [];
        setEnrollmentCount(enrollments.length);
        setPendingSubmissions(subRes.data?.length || 0);

        const cData = myCourses.slice(0, 6).map((c) => ({
          name: c.title.slice(0, 15),
          students: enrollments.filter((e) => e.course_id === c.id).length,
        }));
        setChartData(cData);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Instructor Dashboard</h1>
          <Button asChild>
            <Link to="/instructor/courses/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Course
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-8 w-16 animate-pulse rounded-md bg-muted" /> : <p className="text-2xl font-bold">{courses.length}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-8 w-16 animate-pulse rounded-md bg-muted" /> : <p className="text-2xl font-bold">{enrollmentCount}</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Grading</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-8 w-16 animate-pulse rounded-md bg-muted" /> : <p className="text-2xl font-bold">{pendingSubmissions}</p>}
            </CardContent>
          </Card>
        </div>

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
                <Card key={c.id} className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1">{c.title}</h3>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${c.published ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {c.published ? "Published" : "Draft"}
                  </span>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/instructor/courses/${c.id}`}>Edit</Link>
                    </Button>
                  </div>
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
