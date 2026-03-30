import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Sparkles, ClipboardCheck, ArrowLeft, FileText, User } from "lucide-react";
import { aiGradeSubmission } from "@/lib/ai-service";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="space-y-10 pb-32 max-w-5xl mx-auto">
        
        {/* Professional Header */}
        <section className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-950 p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-950" />
          <div className="relative z-10 flex items-center gap-8">
            <div className="h-20 w-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <ClipboardCheck className="h-10 w-10 text-indigo-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 border border-indigo-500/20">
                Evaluation Queue
              </div>
              <h1 className="font-display text-4xl font-bold">Scholastic Grading</h1>
              <p className="mt-2 text-slate-400 font-medium max-w-xl">
                Review and certify student submissions with precision. Leverage AI-assisted grading for rapid, high-quality feedback.
              </p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Accessing Evaluation Matrix...</p>
          </div>
        ) : submissions.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-none shadow-sm bg-white rounded-[3rem] p-20 text-center">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Queue Clear</h3>
              <p className="text-slate-500 font-medium max-w-xs mx-auto">All pending submissions have been evaluated and certified.</p>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {submissions.map((sub, i) => (
              <motion.div 
                key={sub._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-xl transition-all border border-transparent hover:border-indigo-100">
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest border border-indigo-100">Pending Evaluation</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1.5"><User className="h-3 w-3" /> {sub.student_id?.display_name || "Anonymous Scholar"}</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{sub.assignment_id?.title || "Assignment"}</CardTitle>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-1">Max Scholastic Score: {sub.assignment_id?.max_score || 100}</p>
                      </div>
                      <div className="text-right text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        Submitted: {new Date(sub.submitted_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner">
                       <div className="flex items-center gap-2 mb-4">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Submission Content</span>
                       </div>
                       <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{sub.content || "No textual narrative provided."}</p>
                       {sub.file_url && (
                        <Button variant="link" className="mt-6 h-auto p-0 text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2" asChild>
                          <a href={sub.file_url} target="_blank" rel="noreferrer">Download Attached Asset <ArrowLeft className="h-3 w-3 rotate-180" /></a>
                        </Button>
                      )}
                    </div>

                    <AnimatePresence mode="wait">
                      {gradingId === sub._id ? (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-6 border-t border-slate-100 space-y-6"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-4 w-full flex-1">
                               <div className="flex items-center justify-between">
                                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grade Assignment</Label>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    className="gap-2 border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl h-10 px-4 font-bold shadow-sm"
                                    onClick={() => handleAiGrade(sub)}
                                    disabled={aiLoading}
                                  >
                                    {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                    AI Assist
                                  </Button>
                               </div>
                               <div className="flex gap-6">
                                  <div className="space-y-2 w-32">
                                    <Label className="text-xs font-bold text-slate-600">Raw Score</Label>
                                    <Input type="number" min={0} max={sub.assignment_id?.max_score || 100} value={score} onChange={(e) => setScore(e.target.value)} className="h-12 rounded-xl text-lg font-bold bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-inner" />
                                  </div>
                                  <div className="space-y-2 flex-1">
                                    <Label className="text-xs font-bold text-slate-600">Qualitative Feedback</Label>
                                    <Textarea placeholder="Provide detailed instructional feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="min-h-[120px] rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all shadow-inner" />
                                  </div>
                               </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-4">
                            <Button variant="ghost" className="rounded-xl font-black text-xs uppercase tracking-widest text-slate-400" onClick={() => setGradingId(null)}>Discard</Button>
                            <Button className="bg-slate-950 hover:bg-indigo-600 text-white rounded-xl font-black h-12 px-8 transition-all shadow-lg" onClick={() => gradeSubmission(sub._id)}>Commit Evaluation</Button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex justify-end">
                           <Button size="lg" className="bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl font-black h-14 px-10 transition-all shadow-lg group" onClick={() => setGradingId(sub._id)}>
                             Evaluate Submission
                             <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                           </Button>
                        </div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Grading;
