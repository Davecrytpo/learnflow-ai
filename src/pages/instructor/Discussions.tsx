import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Flag, MessageSquare, ShieldCheck, Loader2, BookOpen } from "lucide-react";
import DiscussionBoard from "@/components/discussion/DiscussionBoard";

const InstructorDiscussions = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openThreads: 0,
    flagged: 0,
    resolved: 7
  });

  useEffect(() => {
    if (!user) return;
    const fetchInstructorCourses = async () => {
      try {
        const { data } = await apiClient.db
          .from("courses")
          .select("*")
          .eq("author_id", user.id)
          .execute();
        
        const myCourses = data || [];
        setCourses(myCourses);
        if (myCourses.length > 0) {
          setSelectedCourseId(myCourses[0].id);
          
          // Fetch some stats for these courses
          const courseIds = myCourses.map((c: any) => c.id);
          const { data: discussions } = await apiClient.db
            .from("discussions")
            .select("id")
            .in("course_id", courseIds)
            .execute();
          
          setStats(prev => ({
            ...prev,
            openThreads: discussions?.length || 0
          }));
        }
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructorCourses();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Discussions</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Moderate and guide dialogue</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Highlight best answers, resolve flags, and keep conversations healthy.
              </p>
            </div>
            <Button className="bg-gradient-brand text-primary-foreground">
              <MessageSquare className="mr-2 h-4 w-4" /> Post announcement
            </Button>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open threads</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.openThreads}</p>
              <p className="text-xs text-muted-foreground">Across your courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Flagged</CardTitle>
              <Flag className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.flagged}</p>
              <p className="text-xs text-muted-foreground">Needs review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved today</CardTitle>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.resolved}</p>
              <p className="text-xs text-muted-foreground">Moderation actions</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : courses.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground italic">
            You haven't created any courses yet.
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Select Course
              </h3>
              <div className="space-y-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedCourseId === course.id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-sm font-medium line-clamp-1">{course.title}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px]">
                      {selectedCourseId === course.id ? "Moderating" : "Select"}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {selectedCourseId ? (
                <DiscussionBoard courseId={selectedCourseId} />
              ) : (
                <Card className="p-12 text-center text-muted-foreground italic">
                  Select a course to moderate discussions.
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstructorDiscussions;
