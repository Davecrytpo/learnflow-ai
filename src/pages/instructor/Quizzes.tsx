import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HelpCircle, PlusCircle, Timer, Search, Loader2, Trash2, Layout, Sparkles, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { generateQuiz } from "@/lib/ai-service";
import { motion } from "framer-motion";

const InstructorQuizzes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  // New quiz state
  const [open, setOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: "", course_id: "", time_limit: "30" });
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [myCourses, quizData] = await Promise.all([
        apiClient.fetch("/instructor/courses"),
        apiClient.fetch("/instructor/quizzes")
      ]);
      setCourses(myCourses || []);
      setQuizzes(quizData || []);
    } catch (err: any) {
      toast({ title: "Load failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuiz.title || !newQuiz.course_id) return;
    setSaving(true);
    try {
      await apiClient.fetch("/instructor/quizzes", {
        method: "POST",
        body: JSON.stringify({
          title: newQuiz.title,
          course_id: newQuiz.course_id,
          time_limit_minutes: parseInt(newQuiz.time_limit)
        })
      });
      toast({ title: "Quiz created", description: "You can now add questions in the editor." });
      setOpen(false);
      setNewQuiz({ title: "", course_id: "", time_limit: "30" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Creation failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm("Permanently remove this assessment registry?")) return;
    try {
      await apiClient.fetch(`/instructor/quizzes/${id}`, { method: "DELETE" });
      toast({ title: "Quiz removed" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleGenerateAiQuiz = async () => {
    if (!newQuiz.title || !newQuiz.course_id) {
      toast({ title: "Target required", description: "Enter a quiz title and select a course first.", variant: "destructive" });
      return;
    }

    setAiGenerating(true);
    try {
      const draft = await generateQuiz(newQuiz.title);
      await apiClient.fetch("/instructor/quizzes", {
        method: "POST",
        body: JSON.stringify({
          course_id: newQuiz.course_id,
          title: draft.title || newQuiz.title,
          description: draft.description || "",
          quiz_type: draft.quiz_type || "quiz",
          time_limit_minutes: draft.time_limit_minutes || parseInt(newQuiz.time_limit),
          passing_score: draft.passing_score || 70,
          max_attempts: draft.max_attempts || 3,
          questions: draft.questions?.map((q: any, idx: number) => ({
            question_text: q.question,
            question_type: "multiple_choice",
            options: q.options,
            correct_answer: q.options[q.correct_index],
            points: q.points || 10,
            order: idx,
            explanation: q.explanation
          })) || []
        })
      });
      toast({ title: "AI Curriculum Logic Applied", description: "A high-fidelity quiz draft has been added." });
      setOpen(false);
      setNewQuiz({ title: "", course_id: "", time_limit: "30" });
      fetchData();
    } catch (error: any) {
      toast({ title: "AI Generation failed", description: error.message, variant: "destructive" });
    } finally {
      setAiGenerating(false);
    }
  };

  const filtered = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase()) || 
    q.courses?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-10 pb-32 max-w-6xl mx-auto">
        
        {/* Professional Header */}
        <section className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-950 p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-950" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="h-20 w-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <HelpCircle className="h-10 w-10 text-indigo-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 border border-indigo-500/20">
                  Assessment Matrix
                </div>
                <h1 className="font-display text-4xl font-bold">Quiz Architect</h1>
                <p className="mt-2 text-slate-400 font-medium max-w-xl">
                  Engineer automated scholarly evaluations. Use AI to scaffold rigorous testing logic and track real-time student mastery.
                </p>
              </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black h-16 px-10 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 text-lg">
                  <PlusCircle className="mr-3 h-6 w-6" /> Create Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] p-10 max-w-lg border-slate-800 bg-slate-950 text-white">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-3xl font-display font-bold">New Scholastic Quiz</DialogTitle>
                  <DialogDescription className="text-slate-400">Initialize a new evaluation node for your curriculum.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-8 pt-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Curriculum</Label>
                    <Select value={newQuiz.course_id} onValueChange={(v) => setNewQuiz({...newQuiz, course_id: v})}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-900 border-slate-800 font-bold"><SelectValue placeholder="Select course" /></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white rounded-xl">
                        {courses.map(c => <SelectItem key={c._id || c.id} value={c._id || c.id} className="rounded-lg">{c.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quiz Identity</Label>
                    <Input placeholder="e.g. Theoretical Physics Midterm" value={newQuiz.title} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} required className="h-14 rounded-2xl bg-slate-900 border-slate-800 font-bold" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Chronological Limit (Min)</Label>
                    <Input type="number" value={newQuiz.time_limit} onChange={e => setNewQuiz({...newQuiz, time_limit: e.target.value})} className="h-14 rounded-2xl bg-slate-900 border-slate-800 font-bold" />
                  </div>
                  <DialogFooter className="flex-col sm:flex-col gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={handleGenerateAiQuiz} disabled={saving || aiGenerating} className="w-full h-14 rounded-2xl border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-black">
                      {(aiGenerating || saving) ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                      Execute AI Logic Scaffolding
                    </Button>
                    <div className="grid grid-cols-2 gap-4 w-full">
                       <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="h-14 rounded-2xl text-slate-500 font-bold">Discard</Button>
                       <Button type="submit" disabled={saving} className="h-14 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black">
                        {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Initialize"}
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <Card className="border-none shadow-sm bg-white rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Layout className="h-6 w-6 text-indigo-600" />
                Active Evaluation Registry
              </CardTitle>
              <CardDescription>Direct oversight of {quizzes.length} scholastic assessments.</CardDescription>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
              <Input placeholder="Filter registries..." value={search} onChange={e => setSearch(e.target.value)} className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 shadow-inner font-medium" />
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                 <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Synchronizing Matrix...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-100">
                <HelpCircle className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No matching evaluations found in the current registry.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filtered.map((q, i) => (
                  <motion.div 
                    key={q._id || q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between p-8 rounded-[2rem] border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-[1.2rem] bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 group-hover:rotate-6 transition-transform">
                          <Timer className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-md border border-slate-100">{q.courses?.title || "Unknown Program"}</span>
                          </div>
                          <p className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{q.title}</p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Timer className="h-3 w-3" /> {q.time_limit_minutes} Minutes</span>
                             <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> 42 Completions</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-emerald-50 text-emerald-700 border-none font-black px-4 py-1.5 rounded-xl uppercase tracking-tighter text-[10px]">Active Node</Badge>
                        <div className="h-10 w-px bg-slate-100 mx-2" />
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50"
                            onClick={() => navigate(`/instructor/courses/${q.course_id}`)}
                          >
                            <Layout className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50" onClick={() => deleteQuiz(q._id || q.id)}>
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstructorQuizzes;
