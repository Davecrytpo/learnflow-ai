import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, HelpCircle, Target, Loader2 } from "lucide-react";

const StudentQuizzes = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [qRes, aRes] = await Promise.all([
          apiClient.fetch("/quizzes/me"),
          apiClient.fetch("/quiz-attempts/me")
        ]);
        setQuizzes(qRes);
        setAttempts(aRes);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const badgeFor = (passed: boolean) => {
    return passed ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600";
  };

  const upcoming = quizzes.filter(q => !attempts.some(a => a.quiz_id?._id === q._id));
  const completed = attempts;

  if (loading) return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quizzes</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Stay assessment-ready</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Take quizzes, review attempts, and get instant feedback on mastery.
              </p>
            </div>
            <Button className="bg-gradient-brand text-primary-foreground">
              <HelpCircle className="mr-2 h-4 w-4" /> Start practice quiz
            </Button>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{upcoming.length}</p>
              <p className="text-xs text-muted-foreground">To be completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <Target className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{completed.length}</p>
              <p className="text-xs text-muted-foreground">View results</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
              <Badge className="bg-slate-500/10 text-slate-600" variant="secondary">
                {attempts.length > 0 ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length) : 0}%
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{attempts.length > 0 ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length) : 0}%</p>
              <p className="text-xs text-muted-foreground">Across all attempts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="bg-muted/40">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">No upcoming quizzes.</p>
            ) : upcoming.map((item) => (
              <Card key={item._id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.course_id?.title}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{item.time_limit_minutes} min</span>
                    <Button size="sm">Start</Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {completed.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">No completed quizzes.</p>
            ) : completed.map((item) => (
              <Card key={item._id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.quiz_id?.title}</p>
                    <p className="text-xs text-muted-foreground">Completed on {new Date(item.completed_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={badgeFor(item.passed)} variant="secondary">{item.passed ? "Passed" : "Failed"}</Badge>
                    <span className="text-xs font-semibold text-foreground">{item.score}/{item.total_points}</span>
                    <Button size="sm" variant="ghost">Review</Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizzes;
