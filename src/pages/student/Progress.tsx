import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Loader2, BookOpen, Award, Zap } from "lucide-react";

const badgeFor = (progress: number) => {
  if (progress >= 80) return "bg-emerald-500/10 text-emerald-600";
  if (progress >= 50) return "bg-primary/10 text-primary";
  return "bg-amber-500/10 text-amber-600";
};

const statusFor = (progress: number) => {
  if (progress >= 80) return "Ahead";
  if (progress >= 50) return "On track";
  return "At risk";
};

const StudentProgress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    avgCompletion: 0,
    lessonsDone: 0,
    totalLessons: 0,
    streak: 11 // Mock streak as we don't have it in DB yet
  });

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      try {
        const [enrRes, subRes, lessonProgRes] = await Promise.all([
          apiClient.db.from("enrollments").select("*, courses(title)").eq("student_id", user.id).execute(),
          apiClient.db.from("submissions").select("*").eq("student_id", user.id).execute(),
          apiClient.db.from("lesson_progress").select("*").eq("user_id", user.id).execute()
        ]);

        const enrs = enrRes.data || [];
        const lessonProg = lessonProgRes.data || [];
        
        // Calculate mock progress based on lesson_progress
        const processedEnrs = enrs.map((enr: any) => {
          const courseLessons = lessonProg.filter((lp: any) => lp.course_id === enr.course_id);
          // For now, let's assume each course has 10 lessons for mock progress calculation
          const progress = Math.min(100, (courseLessons.length / 10) * 100);
          return {
            ...enr,
            title: enr.courses?.title || "Untitled Course",
            progress: Math.round(progress),
            status: statusFor(progress)
          };
        });

        setEnrollments(processedEnrs);
        
        const totalProg = processedEnrs.reduce((acc: number, curr: any) => acc + curr.progress, 0);
        setStats({
          avgCompletion: processedEnrs.length > 0 ? Math.round(totalProg / processedEnrs.length) : 0,
          lessonsDone: lessonProg.length,
          totalLessons: processedEnrs.length * 10,
          streak: 11
        });
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-8">
          <div className="absolute inset-0 bg-aurora opacity-40" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Progress Tracking</p>
              <h1 className="mt-3 font-display text-4xl font-bold text-foreground">Learning momentum</h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Monitor your mastery, assignment completion, and academic progress across all enrolled tracks.
              </p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="h-10 w-10" />
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average completion</CardTitle>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Award className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{stats.avgCompletion}%</p>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none" variant="outline">Good standing</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Across all enrolled tracks</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Lessons done</CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{stats.lessonsDone}</p>
                    <p className="text-sm font-medium text-muted-foreground">/ {stats.totalLessons}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Completed learning units</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Study streak</CardTitle>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                    <Zap className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{stats.streak} days</p>
                    <Badge className="bg-amber-500/10 text-amber-600 border-none" variant="outline">On fire</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Keep up the daily momentum!</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-lg overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-lg">Track progress</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border p-0">
                {enrollments.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground italic">
                    No active enrollments found.
                  </div>
                ) : (
                  enrollments.map((track) => (
                    <div key={track.id} className="p-6 transition-colors hover:bg-muted/20">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="space-y-1">
                          <p className="font-bold text-lg text-foreground">{track.title}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Module ID: {track.id.substring(0, 8)}</p>
                        </div>
                        <Badge className={`${badgeFor(track.progress)} border-none px-3 py-1 font-semibold`} variant="outline">
                          {track.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <Progress value={track.progress} className="h-3 rounded-full bg-muted shadow-inner" />
                        </div>
                        <span className="text-sm font-bold tabular-nums min-w-[3ch]">{track.progress}%</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentProgress;
