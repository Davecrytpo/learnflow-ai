import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, FileCheck2, PlusCircle, Search, Loader2, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InstructorAssignments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  // New assignment form state
  const [open, setOpen] = useState(false);
  const [newAsgn, setNewAsgn] = useState({ title: "", course_id: "", due_date: "", max_score: "100" });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: myCourses } = await api.get("/instructor/courses");
      setCourses(myCourses || []);

      const { data: asgns } = await api.get("/assignments");
      // Filter for assignments belonging to my courses
      const myCourseIds = (myCourses || []).map((c: any) => c._id);
      const filteredAsgns = (asgns || []).filter((a: any) => myCourseIds.includes(a.course_id));
      setAssignments(filteredAsgns);
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
    if (!newAsgn.title || !newAsgn.course_id) return;
    setSaving(true);
    try {
      await api.post("/assignments", {
        title: newAsgn.title,
        course_id: newAsgn.course_id,
        due_date: newAsgn.due_date || null,
        max_score: parseInt(newAsgn.max_score)
      });
      toast({ title: "Assignment created" });
      setOpen(false);
      setNewAsgn({ title: "", course_id: "", due_date: "", max_score: "100" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Creation failed", description: err.response?.data?.error || err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteAssignment = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;
    try {
      await api.delete(`/assignments/${id}`);
      toast({ title: "Assignment deleted" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const filtered = assignments.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["instructor"]} sidebar={<InstructorSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Faculty Tools</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Coursework Management</h1>
              <p className="mt-2 text-sm text-muted-foreground">Manage and track student submissions across your active courses.</p>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Assignment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create New Assignment</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Target Course</Label>
                    <Select value={newAsgn.course_id} onValueChange={(v) => setNewAsgn({...newAsgn, course_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                      <SelectContent>
                        {courses.map(c => <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Assignment Title" value={newAsgn.title} onChange={e => setNewAsgn({...newAsgn, title: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Due Date (Optional)</Label>
                      <Input type="date" value={newAsgn.due_date} onChange={e => setNewAsgn({...newAsgn, due_date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Points</Label>
                      <Input type="number" value={newAsgn.max_score} onChange={e => setNewAsgn({...newAsgn, max_score: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Assignment
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
                  <FileCheck2 className="h-5 w-5 text-primary" /> Assignment Tracker
                </CardTitle>
                <CardDescription>Monitor {assignments.length} assignments.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Filter list..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                No assignments found.
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="text-left p-4">Assignment</th>
                      <th className="text-left p-4 hidden md:table-cell">Course</th>
                      <th className="text-left p-4">Due Date</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map(a => (
                      <tr key={a._id} className="hover:bg-accent/5 transition-colors">
                        <td className="p-4 font-medium text-foreground">{a.title}</td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">
                          {courses.find(c => c._id === a.course_id)?.title || "Course"}
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No deadline"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteAssignment(a._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InstructorAssignments;
