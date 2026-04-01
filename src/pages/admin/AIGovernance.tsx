import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, Loader2, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";

const AIGovernance = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await apiClient.db.from("ai_governance_logs").select("*").order("created_at", { ascending: false }).execute();
      setLogs(data || []);
    } catch (error: any) {
      toast({ title: "Audit failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const clearLogs = async () => {
    if (!confirm("Clear all governance logs? This is irreversible.")) return;
    try {
      await Promise.all((logs || []).map((log) => apiClient.db.from("ai_governance_logs").delete().eq("id", log.id).execute()));
      toast({ title: "Logs cleared" });
      await fetchLogs();
    } catch (error: any) {
      toast({ title: "Clear failed", description: error.message, variant: "destructive" });
    }
  };

  const filtered = logs.filter((log) =>
    [log.model, log.request_type]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">AI Ethics & Safety</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">AI Governance</h1>
              <p className="mt-2 text-sm text-muted-foreground">Monitor institutional AI usage, token consumption, and safety compliance.</p>
            </div>
            <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={clearLogs}>
              <Trash2 className="mr-2 h-4 w-4" /> Purge Audit Trail
            </Button>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Models</CardTitle>
              <Bot className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Platform AI</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tokens Consumed</CardTitle>
              <Zap className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{logs.reduce((acc, log) => acc + Number(log.tokens_used || 0), 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Safety Status</CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-600">Compliant</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">Secure</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle>Usage Logs</CardTitle>
                <CardDescription>Real-time oversight of AI-assisted activities.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Filter by model..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed py-12 text-center text-muted-foreground">No logs found.</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-medium">
                    <tr>
                      <th className="p-4 text-left">Request Details</th>
                      <th className="p-4 text-left">Model</th>
                      <th className="p-4 text-left">Consumption</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map((log) => (
                      <tr key={log.id} className="hover:bg-accent/5 transition-colors">
                        <td className="p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground">{log.request_type || "request"}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{log.created_at ? new Date(log.created_at).toLocaleString() : "Unknown"}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-mono text-[10px]">{log.model || "platform"}</Badge>
                        </td>
                        <td className="p-4 font-mono text-xs">{log.tokens_used || 0} tokens</td>
                        <td className="p-4 text-right">
                          <Badge variant="secondary" className="bg-emerald-500/10 text-[9px] uppercase tracking-tighter text-emerald-600">{log.status || "logged"}</Badge>
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

export default AIGovernance;
