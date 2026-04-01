import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScanEye, ShieldAlert, Loader2, Search, Trash2, User, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";

const Proctoring = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const [data, users] = await Promise.all([
        apiClient.db.from("proctoring_sessions").select("*").order("created_at", { ascending: false }).execute(),
        apiClient.fetch("/admin/users"),
      ]);
      const userMap = new Map((users || []).map((user: any) => [user._id || user.id, user]));
      setSessions((data || []).map((session: any) => ({ ...session, student: userMap.get(session.student_id) || null })));
    } catch (error: any) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const terminateSession = async (id: string) => {
    if (!confirm("Terminate this live proctoring session?")) return;
    try {
      await apiClient.db.from("proctoring_sessions").update({ status: "terminated" }).eq("id", id).execute();
      toast({ title: "Session Terminated", description: "The exam access has been revoked." });
      await fetchSessions();
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  };

  const filtered = sessions.filter((session) =>
    [session.student?.display_name, session.student?.email, session.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Exam Integrity</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Proctoring Console</h1>
            <p className="mt-2 text-sm text-muted-foreground">Monitor live assessments and investigate flagged academic integrity incidents.</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Live Sessions</CardTitle>
              <ScanEye className="h-4 w-4 animate-pulse text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{sessions.filter((session) => session.status === "live").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Flags</CardTitle>
              <ShieldAlert className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{sessions.filter((session) => Number(session.flag_count || 0) > 5).length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle>Assessment Monitoring</CardTitle>
                <CardDescription>Real-time audit of student exam behavior.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search student or status..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed py-12 text-center text-muted-foreground">No sessions found.</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-medium">
                    <tr>
                      <th className="p-4 text-left">Student</th>
                      <th className="p-4 text-left">Flags</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map((session) => (
                      <tr key={session.id} className="hover:bg-accent/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{session.student?.display_name || session.student?.email || "Scholar"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={Number(session.flag_count || 0) > 5 ? "destructive" : "outline"} className="text-[10px]">
                            {session.flag_count || 0} Flags
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-tighter">{session.status}</Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => terminateSession(session.id)}>
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

export default Proctoring;
