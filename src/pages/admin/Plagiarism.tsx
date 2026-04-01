import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSearch, ShieldAlert, Loader2, Search, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";

const Plagiarism = () => {
  const { toast } = useToast();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    try {
      const [data, users] = await Promise.all([
        apiClient.db.from("plagiarism_cases").select("*").order("created_at", { ascending: false }).execute(),
        apiClient.fetch("/admin/users"),
      ]);
      const userMap = new Map((users || []).map((user: any) => [user._id || user.id, user]));
      setCases((data || []).map((item: any) => ({ ...item, student: userMap.get(item.student_id) || null })));
    } catch (error: any) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiClient.db.from("plagiarism_cases").update({ status }).eq("id", id).execute();
      toast({ title: "Case Updated", description: `Status changed to ${status}.` });
      await fetchCases();
    } catch (error: any) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  };

  const filtered = cases.filter((item) =>
    [item.student?.display_name, item.student?.email, item.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Academic Integrity</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Plagiarism Oversight</h1>
            <p className="mt-2 text-sm text-muted-foreground">Audit similarity reports and manage cases of unauthorized content duplication.</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Cases</CardTitle>
              <FileSearch className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{cases.filter((item) => item.status !== "resolved").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Similarity</CardTitle>
              <ShieldAlert className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{cases.filter((item) => Number(item.similarity_score || 0) > 70).length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle>Case Registry</CardTitle>
                <CardDescription>Comprehensive log of integrity investigations.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search student..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed py-12 text-center text-muted-foreground">No cases recorded.</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-medium">
                    <tr>
                      <th className="p-4 text-left">Student</th>
                      <th className="p-4 text-left">Similarity</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-accent/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{item.student?.display_name || item.student?.email || "Scholar"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <div className={Number(item.similarity_score || 0) > 50 ? "h-full bg-destructive" : "h-full bg-primary"} style={{ width: `${item.similarity_score || 0}%` }} />
                            </div>
                            <span className="text-[10px] font-bold">{item.similarity_score || 0}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter">{item.status}</Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => updateStatus(item.id, "resolved")}>Resolve</Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                              <FileText className="h-4 w-4" />
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

export default Plagiarism;
