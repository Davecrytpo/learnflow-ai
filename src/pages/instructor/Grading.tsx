import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Sparkles } from "lucide-react";
import { aiGradeSubmission } from "@/lib/ai-service";
import { apiClient } from "@/lib/api-client";

const Grading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const subs = await apiClient.fetch("/instructor/submissions/pending");
        setSubmissions(subs || []);
      } catch (err: any) {
        console.error("Grading fetch error:", err);
        toast({ title: "Fetch failed", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleAiGrade = async (sub: any) => {
    setAiLoading(true);
    try {
      const result = await aiGradeSubmission(
        sub.assignment_id?.title || "Assignment",
        sub.content || "",
        "Refer to the assignment instructions."
      );
      const parsed = typeof result === 'string' ? JSON.parse(result.trim()) : result;
      setScore(Math.round((parsed.score / 100) * (sub.assignment_id?.max_score || 100)).toString());
      setFeedback(parsed.feedback);
      toast({ title: "AI Suggestion Ready", description: "Review and adjust before submitting." });
    } catch (err: any) {
      toast({ title: "AI Grade Assist Failed", description: err.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const gradeSubmission = async (subId: string) => {
    if (!user) return;
    try {
      await apiClient.fetch(`/instructor/submissions/${subId}/grade`, {
        method: "PATCH",
        body: JSON.stringify({
          score: Number(score),
          feedback
        })
      });
      toast({ title: "Graded!" });
      setSubmissions(submissions.filter((s) => s._id !== subId));
      setGradingId(null);
      setScore("");
      setFeedback("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
              <Card key={sub._id}>
                <CardHeader>
                  <CardTitle className="text-base">{sub.assignment_id?.title || "Assignment"}</CardTitle>
                  <p className="text-xs text-muted-foreground">Max score: {sub.assignment_id?.max_score || 100}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{sub.content || "No text content"}</p>
                  {sub.file_url && (
                    <a href={sub.file_url} className="mt-2 text-xs text-primary hover:underline" target="_blank" rel="noreferrer">View attachment</a>
                  )}
                  {gradingId === sub._id ? (
                    <div className="mt-4 space-y-3 rounded-md border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold">Grading Form</span>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 text-indigo-600 border-indigo-200"
                          onClick={() => handleAiGrade(sub)}
                          disabled={aiLoading}
                        >
                          {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          AI Grade Assist
                        </Button>
                      </div>
                      <div className="flex gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Score</label>
                          <Input type="number" min={0} max={sub.assignment_id?.max_score || 100} value={score} onChange={(e) => setScore(e.target.value)} className="w-24" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Feedback</label>
                        <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => gradeSubmission(sub._id)}>Submit Grade</Button>
                        <Button size="sm" variant="ghost" onClick={() => setGradingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" className="mt-3" onClick={() => setGradingId(sub._id)}>Grade</Button>
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
