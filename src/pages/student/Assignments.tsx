import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const StudentAssignments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const enrollRes = await api.get("/enrollments/me");
      const courseIds = (enrollRes.data || []).map((e: any) => e.course_id?._id);

      if (courseIds.length > 0) {
        const [asgnRes, subRes] = await Promise.all([
          api.get("/assignments"),
          api.get("/submissions", { params: { student_id: user.id } })
        ]);

        // Filter assignments for enrolled courses
        const filteredAsgns = (asgnRes.data || []).filter((a: any) => courseIds.includes(a.course_id));
        setAssignments(filteredAsgns);
        setSubmissions(subRes.data || []);
      }
    } catch (err: any) {
      toast({ title: "Fetch failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const getStatus = (assignmentId: string, dueDate: string | null) => {
    const sub = submissions.find(s => s.assignment_id === assignmentId);
    if (sub) return sub.score !== null && sub.score !== undefined ? "Graded" : "Submitted";
    if (dueDate && new Date(dueDate) < new Date()) return "Overdue";
    return "Open";
  };

  const filtered = assignments.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const upcoming = filtered.filter(a => getStatus(a._id, a.due_date) === "Open");
  const completed = filtered.filter(a => ["Submitted", "Graded"].includes(getStatus(a._id, a.due_date)));
  const overdue = filtered.filter(a => getStatus(a._id, a.due_date) === "Overdue");

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Student Center</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">My Assignments</h1>
              <p className="mt-2 text-sm text-muted-foreground">Track deadlines, submit work, and review your performance.</p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="relative overflow-hidden border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">To Do</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">{upcoming.length}</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{completed.length}</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">{overdue.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Done</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search assignments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-9" />
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <AssignmentList list={filtered} loading={loading} submissions={submissions} getStatus={getStatus} />
          </TabsContent>
          <TabsContent value="upcoming" className="mt-0">
            <AssignmentList list={upcoming} loading={loading} submissions={submissions} getStatus={getStatus} />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <AssignmentList list={completed} loading={loading} submissions={submissions} getStatus={getStatus} />
          </TabsContent>
          <TabsContent value="overdue" className="mt-0">
            <AssignmentList list={overdue} loading={loading} submissions={submissions} getStatus={getStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const AssignmentList = ({ list, loading, submissions, getStatus }: any) => {
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (list.length === 0) return (
    <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">
      No assignments found in this category.
    </div>
  );

  return (
    <div className="space-y-3">
      {list.map((a: any) => {
        const status = getStatus(a._id, a.due_date);
        const sub = submissions.find((s: any) => s.assignment_id === a._id);
        
        return (
          <Card key={a._id} className="group hover:border-primary/30 transition-all">
            <CardContent className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{a.title}</h3>
                  <p className="text-xs text-muted-foreground">Course Assignment</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Deadline</p>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Calendar className="h-3 w-3" />
                    {a.due_date ? new Date(a.due_date).toLocaleDateString() : "Flexible"}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <Badge variant="secondary" className={`text-[10px] uppercase ${
                    status === 'Graded' ? 'bg-emerald-500/10 text-emerald-600' :
                    status === 'Overdue' ? 'bg-destructive/10 text-destructive' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {status}
                  </Badge>
                  {sub?.score !== null && sub?.score !== undefined && (
                    <p className="mt-1 text-sm font-bold text-primary">{sub.score}/{a.max_score}</p>
                  )}
                </div>

                <Button size="sm" variant={status === 'Open' || status === 'Overdue' ? 'default' : 'outline'} className="h-9">
                  {status === 'Open' || status === 'Overdue' ? 'Submit' : 'Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StudentAssignments;
