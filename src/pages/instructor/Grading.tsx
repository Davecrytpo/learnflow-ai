import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

const Grading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      // Get instructor's courses first
      const coursesRes = await supabase.from("courses").select("id").eq("author_id", user.id);
      const courseIds = (coursesRes.data || []).map((c) => c.id);
      if (courseIds.length === 0) { setLoading(false); return; }

      // Get assignments for those courses
      const assignRes = await supabase.from("assignments").select("id, title, course_id, max_score").in("course_id", courseIds);
      const assignments = assignRes.data || [];
      if (assignments.length === 0) { setLoading(false); return; }

      // Get ungraded submissions
      const subRes = await supabase
        .from("submissions")
        .select("*")
        .in("assignment_id", assignments.map((a) => a.id))
        .is("graded_at", null)
        .order("submitted_at", { ascending: true });

      const subs = (subRes.data || []).map((s) => ({
        ...s,
        assignment: assignments.find((a) => a.id === s.assignment_id),
      }));
      setSubmissions(subs);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const gradeSubmission = async (subId: string) => {
    if (!user) return;
    const { error } = await supabase.from("submissions").update({
      score: Number(score),
      feedback,
      graded_at: new Date().toISOString(),
      graded_by: user.id,
    }).eq("id", subId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Graded!" });
      setSubmissions(submissions.filter((s) => s.id !== subId));
      setGradingId(null);
      setScore("");
      setFeedback("");
    }
  };

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Assessment</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Grading queue</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Review submissions, assign scores, and send feedback with a clear workflow.
            </p>
          </div>
        </section>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : submissions.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-accent" />
            <p className="mt-4 text-muted-foreground">All caught up! No pending submissions.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <Card key={sub.id}>
                <CardHeader>
                  <CardTitle className="text-base">{sub.assignment?.title || "Assignment"}</CardTitle>
                  <p className="text-xs text-muted-foreground">Max score: {sub.assignment?.max_score || 100}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{sub.content || "No text content"}</p>
                  {sub.file_url && (
                    <a href={sub.file_url} className="mt-2 text-xs text-primary hover:underline" target="_blank" rel="noreferrer">View attachment</a>
                  )}
                  {gradingId === sub.id ? (
                    <div className="mt-4 space-y-3 rounded-md border border-border p-4">
                      <div className="flex gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Score</label>
                          <Input type="number" min={0} max={sub.assignment?.max_score || 100} value={score} onChange={(e) => setScore(e.target.value)} className="w-24" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Feedback</label>
                        <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => gradeSubmission(sub.id)}>Submit Grade</Button>
                        <Button size="sm" variant="ghost" onClick={() => setGradingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" className="mt-3" onClick={() => setGradingId(sub.id)}>Grade</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Grading;
