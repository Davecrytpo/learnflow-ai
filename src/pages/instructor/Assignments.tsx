import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InstructorSidebar from "@/components/dashboard/InstructorSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, FileCheck2, PlusCircle, Search, Loader2, Trash2, Edit, BookOpen, ChevronRight, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";

const InstructorAssignments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      const [myCourses, asgns] = await Promise.all([
        apiClient.fetch("/instructor/courses"),
        apiClient.fetch("/instructor/assignments")
      ]);
      setCourses(myCourses || []);
      setAssignments(asgns || []);
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
      await apiClient.fetch("/instructor/assignments", {
        method: "POST",
        body: JSON.stringify({
          title: newAsgn.title,
          course_id: newAsgn.course_id,
          due_date: newAsgn.due_date || null,
          max_score: parseInt(newAsgn.max_score)
        })
      });
      toast({ title: "Assignment created", description: "Node added to curriculum registry." });
      setOpen(false);
      setNewAsgn({ title: "", course_id: "", due_date: "", max_score: "100" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Creation failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteAssignment = async (id: string) => {
    if (!confirm("Permanently remove this scholastic assignment?")) return;
    try {
      await apiClient.fetch(`/instructor/assignments/${id}`, { method: "DELETE" });
      toast({ title: "Assignment removed" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filtered = assignments.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.courses?.title?.toLowerCase().includes(search.toLowerCase())
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
                <FileCheck2 className="h-10 w-10 text-indigo-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 border border-indigo-500/20">
                  Instructional Controls
                </div>
                <h1 className="font-display text-4xl font-bold">Coursework Registry</h1>
                <p className="mt-2 text-slate-400 font-medium max-w-xl">
                  Orchestrate academic submissions and maintain scholarly standards across your institutional programs.
                </p>
              </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black h-16 px-10 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 text-lg">
                  <PlusCircle className="mr-3 h-6 w-6" /> Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2.5rem] p-10 max-w-lg border-slate-800 bg-slate-950 text-white">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-3xl font-display font-bold">New Scholarly Task</DialogTitle>
                  <DialogDescription className="text-slate-400">Establish a new submission node for student evaluation.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-8 pt-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Program</Label>
                    <Select value={newAsgn.course_id} onValueChange={(v) => setNewAsgn({...newAsgn, course_id: v})}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-900 border-slate-800 font-bold"><SelectValue placeholder="Select course" /></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white rounded-xl">
                        {courses.map(c => <SelectItem key={c._id || c.id} value={c._id || c.id} className="rounded-lg">{c.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Assignment Identity</Label>
                    <Input placeholder="e.g. Critical Research Thesis" value={newAsgn.title} onChange={e => setNewAsgn({...newAsgn, title: e.target.value})} required className="h-14 rounded-2xl bg-slate-900 border-slate-800 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scholastic Deadline</Label>
                      <Input type="date" value={newAsgn.due_date} onChange={e => setNewAsgn({...newAsgn, due_date: e.target.value})} className="h-14 rounded-2xl bg-slate-900 border-slate-800 font-bold" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Max Score</Label>
                      <Input type="number" value={newAsgn.max_score} onChange={e => setNewAsgn({...newAsgn, max_score: e.target.value})} className="h-14 rounded-2xl bg-slate-900 border-slate-800 font-bold" />
                    </div>
                  </div>
                  <DialogFooter className="gap-4 pt-4">
                    <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="h-14 rounded-2xl text-slate-500 font-bold">Discard</Button>
                    <Button type="submit" disabled={saving} className="h-14 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black flex-1">
                      {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Initialize Task"}
                    </Button>
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
                Instructional Registry
              </CardTitle>
              <CardDescription>Oversight of {assignments.length} curriculum submission nodes.</CardDescription>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
              <Input placeholder="Filter registry entries..." value={search} onChange={e => setSearch(e.target.value)} className="h-14 pl-12 rounded-2xl bg-slate-50 border-slate-100 shadow-inner font-medium" />
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                 <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Synchronizing Records...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-100">
                <FileCheck2 className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No scholastic tasks found in the active registry.</p>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-slate-100 overflow-hidden shadow-inner">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="text-left p-6 font-black uppercase tracking-widest text-[10px]">Assignment Node</th>
                      <th className="text-left p-6 hidden md:table-cell font-black uppercase tracking-widest text-[10px]">Academic Program</th>
                      <th className="text-left p-6 font-black uppercase tracking-widest text-[10px]">Scholastic Deadline</th>
                      <th className="text-right p-6 font-black uppercase tracking-widest text-[10px]">Registry Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((a, i) => (
                      <motion.tr 
                        key={a._id || a.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-indigo-50/30 transition-colors group"
                      >
                        <td className="p-6 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{a.title}</td>
                        <td className="p-6 hidden md:table-cell text-slate-500 font-medium">{a.courses?.title}</td>
                        <td className="p-6">
                          <span className="flex items-center gap-2 text-slate-400 font-bold">
                            <Calendar className="h-4 w-4 text-indigo-300" />
                            {a.due_date ? new Date(a.due_date).toLocaleDateString() : "Open Deadline"}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => navigate(`/instructor/courses/${a.course_id}`)}
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50" onClick={() => deleteAssignment(a._id || a.id)}>
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
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
