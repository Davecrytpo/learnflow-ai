import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, FileCheck2, Loader2, Search, FileText, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const StudentAssignments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [asgnRes, subRes] = await Promise.all([
        apiClient.fetch("/assignments/me"),
        apiClient.fetch("/submissions/me")
      ]);

      const transformedAssignments = asgnRes.map((a: any) => ({
        ...a,
        id: a._id,
        courses: { title: a.course_id?.title || "Untitled Course" }
      }));

      const transformedSubmissions = subRes.map((s: any) => ({
        ...s,
        id: s._id
      }));

      setAssignments(transformedAssignments);
      setSubmissions(transformedSubmissions);
    } catch (err: any) {
      toast({ title: "Registry link failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const getStatus = (assignmentId: string, dueDate: string | null) => {
    const sub = submissions.find(s => (s.assignment_id?._id || s.assignment_id?.id || s.assignment_id) === assignmentId);
    if (sub) return sub.score !== null ? "Certified" : "Awaiting Review";
    if (dueDate && new Date(dueDate) < new Date()) return "Term Expired";
    return "Action Required";
  };

  const filtered = assignments.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.courses?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const upcoming = filtered.filter(a => getStatus(a.id, a.due_date) === "Action Required");
  const completed = filtered.filter(a => ["Awaiting Review", "Certified"].includes(getStatus(a.id, a.due_date)));
  const overdue = filtered.filter(a => getStatus(a.id, a.due_date) === "Term Expired");

  return (
    <DashboardLayout allowedRoles={["student"]} sidebar={<StudentSidebar />}>
      <div className="space-y-12 pb-32 max-w-6xl mx-auto">
        
        {/* Scholar Header */}
        <section className="relative overflow-hidden rounded-[3rem] border border-sky-100 bg-white p-12 shadow-2xl shadow-sky-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.4),transparent)]" />
          <div className="relative z-10 flex items-center gap-8">
            <div className="h-20 w-20 rounded-3xl bg-sky-600 shadow-xl shadow-sky-200 flex items-center justify-center">
              <FileCheck2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-sky-200">
                Scholarly Tasks
              </div>
              <h1 className="font-display text-4xl font-bold text-slate-900">Academic Assignments</h1>
              <p className="mt-2 text-slate-500 font-medium max-w-xl">
                Direct oversight of your curriculum tasks. Submit research entries and track institutional certifications.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            { label: "Action Required", count: upcoming.length, color: "bg-amber-50 text-amber-700", icon: Clock },
            { label: "Certified Nodes", count: completed.length, color: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
            { label: "Term Expired", count: overdue.length, color: "bg-rose-50 text-rose-700", icon: Calendar }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white rounded-[2.5rem] p-8">
               <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl ${stat.color.split(' ')[0]} flex items-center justify-center`}>
                     <stat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900">{stat.count}</h3>
               </div>
               <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
            <TabsList className="bg-slate-100 p-1.5 rounded-[1.5rem] h-auto">
              <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Registry</TabsTrigger>
              <TabsTrigger value="upcoming" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Priority</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Verified</TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
              <Input placeholder="Filter task registry..." value={search} onChange={e => setSearch(e.target.value)} className="h-14 pl-12 rounded-2xl bg-white border-sky-50 shadow-inner font-medium" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="all" className="mt-0 outline-none">
              <AssignmentList list={filtered} loading={loading} submissions={submissions} getStatus={getStatus} navigate={navigate} />
            </TabsContent>
            <TabsContent value="upcoming" className="mt-0 outline-none">
              <AssignmentList list={upcoming} loading={loading} submissions={submissions} getStatus={getStatus} navigate={navigate} />
            </TabsContent>
            <TabsContent value="completed" className="mt-0 outline-none">
              <AssignmentList list={completed} loading={loading} submissions={submissions} getStatus={getStatus} navigate={navigate} />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const AssignmentList = ({ list, loading, submissions, getStatus, navigate }: any) => {
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Synchronizing Scholar Data...</p>
    </div>
  );
  
  if (list.length === 0) return (
    <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-sky-50 shadow-inner">
      <FileText className="h-16 w-16 text-sky-100 mx-auto mb-4" />
      <p className="text-slate-400 font-bold">No tasks found in this registry segment.</p>
    </div>
  );

  return (
    <div className="grid gap-6">
      {list.map((a: any, i: number) => {
        const status = getStatus(a.id, a.due_date);
        const sub = submissions.find((s: any) => (s.assignment_id?._id || s.assignment_id?.id || s.assignment_id) === a.id);
        
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="group hover:border-sky-300 transition-all cursor-default border-none shadow-sm hover:shadow-xl hover:shadow-sky-500/5 bg-white rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="h-16 w-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shadow-inner border border-sky-100 group-hover:rotate-6 transition-transform">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">{a.courses?.title}</span>
                    </div>
                    <h3 className="font-bold text-2xl text-slate-900 group-hover:text-sky-600 transition-colors leading-tight line-clamp-1">{a.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Due {a.due_date ? new Date(a.due_date).toLocaleDateString() : "Flexible Term"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0 border-slate-50">
                  <div className="flex flex-col items-end mr-4">
                    <Badge className={`border-none font-black text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl shadow-sm ${
                      status === 'Certified' ? 'bg-emerald-50 text-emerald-700' :
                      status === 'Term Expired' ? 'bg-rose-50 text-rose-700' :
                      status === 'Awaiting Review' ? 'bg-sky-50 text-sky-700' :
                      'bg-slate-50 text-slate-400'
                    }`}>
                      {status}
                    </Badge>
                    {sub?.score !== null && sub?.score !== undefined && (
                      <p className="mt-2 text-xl font-black text-slate-900">{sub.score} <span className="text-xs text-slate-300">/ {a.max_score}</span></p>
                    )}
                  </div>

                  <Button
                    className={`h-14 px-10 rounded-2xl font-black transition-all shadow-lg group/btn ${
                      status === 'Action Required' || status === 'Term Expired' 
                      ? 'bg-slate-950 hover:bg-sky-600 text-white' 
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100 shadow-none'
                    }`}
                    onClick={() => navigate(`/course/${a.course_id?._id || a.course_id?.id}/learn`)}
                  >
                    {status === 'Action Required' || status === 'Term Expired' ? 'Execute Task' : 'Review Node'}
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StudentAssignments;
