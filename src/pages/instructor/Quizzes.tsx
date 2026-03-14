import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HelpCircle, PlusCircle, Timer, Search, Loader2, Trash2, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InstructorQuizzes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  // New quiz state
  const [open, setOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: "", course_id: "", time_limit: "30" });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: myCourses } = await api.get("/instructor/courses");
      setCourses(myCourses || []);

      const { data: quizData } = await api.get("/quizzes");
      // Filter for quizzes belonging to my courses
      const myCourseIds = (myCourses || []).map((c: any) => c._id);
      const filteredQuizzes = (quizData || []).filter((q: any) => myCourseIds.includes(q.course_id));
      setQuizzes(filteredQuizzes);
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
      await api.post("/quizzes", {
        title: newQuiz.title,
        course_id: newQuiz.course_id,
        time_limit_minutes: parseInt(newQuiz.time_limit)
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
    if (!confirm("Delete this quiz?")) return;
    try {
      await api.delete(`/quizzes/${id}`);
      toast({ title: "Quiz removed" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const filtered = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Assessments</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Quiz Builder</h1>
              <p className="mt-2 text-sm text-muted-foreground">Create automated assessments and track student performance in real-time.</p>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Quiz
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Setup New Quiz</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Target Course</Label>
                    <Select value={newQuiz.course_id} onValueChange={(v) => setNewQuiz({...newQuiz, course_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                      <SelectContent>
                        {courses.map(c => <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="e.g. Mid-term Assessment" value={newQuiz.title} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Time Limit (Minutes)</Label>
                    <Input type="number" value={newQuiz.time_limit} onChange={e => setNewQuiz({...newQuiz, time_limit: e.target.value})} />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Quiz
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" /> Active Quizzes
                </CardTitle>
                <CardDescription>Managing {quizzes.length} assessments.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search quizzes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                No quizzes found.
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(q => (
                  <div key={q._id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Timer className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{q.title}</p>
                        <p className="text-xs text-muted-foreground">{courses.find(c => c._id === q.course_id)?.title || "Course"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-xs font-medium">{q.time_limit_minutes}m limit</span>
                        <Badge variant="outline" className="mt-1 text-[10px] uppercase">Active</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Layout className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteQuiz(q._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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

export default InstructorQuizzes;
