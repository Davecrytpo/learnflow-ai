import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ClipboardCheck } from "lucide-react";

const StudentGrades = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const [subs, quizAttempts] = await Promise.all([
          apiClient.fetch("/submissions/me"),
          apiClient.fetch("/quiz-attempts/me")
        ]);
        setSubmissions(subs || []);
        setAttempts(quizAttempts || []);
      } catch (err) {
        console.error("Failed to fetch grades", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [user]);

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Grades</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Your grades</h1>
            <p className="mt-2 text-sm text-muted-foreground">Assignment scores and quiz results.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Assignments</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions yet.</p>
            ) : (
              <div className="space-y-2">
                {submissions.map(s => (
                  <div key={s._id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-medium text-foreground">{s.assignment_id?.title || "Untitled Assignment"}</p>
                    <p className="text-xs text-muted-foreground">Score: {s.score ?? "Ungraded"}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Quizzes</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : attempts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>
            ) : (
              <div className="space-y-2">
                {attempts.map(a => (
                  <div key={a._id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-medium text-foreground">{a.quiz_id?.title || "Untitled Quiz"}</p>
                    <p className="text-xs text-muted-foreground">Score: {a.score ?? "Pending"}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
