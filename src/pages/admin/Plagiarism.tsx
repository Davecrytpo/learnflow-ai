import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSearch, ShieldAlert, Loader2, Search, Trash2, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const Plagiarism = () => {
  const { toast } = useToast();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCases = async () => {
    setLoading(true);
    const { data } = await (supabase
      .from as any)("plagiarism_cases")
      .select(`
        *,
        profiles:student_id (display_name)
      `)
      .order("created_at", { ascending: false });
    setCases(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await (supabase.from as any)("plagiarism_cases").update({ status }).eq("id", id);
    toast({ title: "Case Updated", description: `Status changed to ${status}.` });
    fetchCases();
  };

  const filtered = cases.filter(c => 
    (c.profiles?.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase())
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
              <p className="text-2xl font-bold">{cases.filter(c => c.status !== 'resolved').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Similarity</CardTitle>
              <ShieldAlert className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{cases.filter(c => c.similarity_score > 70).length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Case Registry</CardTitle>
                <CardDescription>Comprehensive log of integrity investigations.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">No cases recorded.</div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="text-left p-4">Student</th>
                      <th className="text-left p-4">Similarity</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map(c => (
                      <tr key={c.id} className="hover:bg-accent/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{c.profiles?.display_name || "Scholar"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${c.similarity_score > 50 ? 'bg-destructive' : 'bg-primary'}`} 
                                style={{ width: `${c.similarity_score}%` }} 
                              />
                            </div>
                            <span className="text-[10px] font-bold">{c.similarity_score}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter">
                            {c.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => updateStatus(c.id, 'resolved')}>Resolve</Button>
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
