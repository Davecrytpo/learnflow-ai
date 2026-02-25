import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, ShieldAlert, Zap, Loader2, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const AIGovernance = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ai_governance_logs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({ title: "Audit failed", description: error.message, variant: "destructive" });
    } else {
      setLogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const clearLogs = async () => {
    if (!confirm("Clear all governance logs? This is irreversible.")) return;
    await supabase.from("ai_governance_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    toast({ title: "Logs cleared" });
    fetchLogs();
  };

  const filtered = logs.filter(l => 
    l.model.toLowerCase().includes(search.toLowerCase()) || 
    l.request_type?.toLowerCase().includes(search.toLowerCase())
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
              <p className="text-2xl font-bold">GPT-4o, Claude 3.5</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tokens Consumed</CardTitle>
              <Zap className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{logs.reduce((acc, curr) => acc + (curr.tokens_used || 0), 0).toLocaleString()}</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Usage Logs</CardTitle>
                <CardDescription>Real-time oversight of AI-assisted activities.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Filter by model..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">No logs found.</div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="text-left p-4">Request Details</th>
                      <th className="text-left p-4">Model</th>
                      <th className="text-left p-4">Consumption</th>
                      <th className="text-right p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map(l => (
                      <tr key={l.id} className="hover:bg-accent/5 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-foreground uppercase text-[10px] tracking-widest">{l.request_type}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(l.created_at).toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-mono text-[10px]">{l.model}</Badge>
                        </td>
                        <td className="p-4 font-mono text-xs">
                          {l.tokens_used} tokens
                        </td>
                        <td className="p-4 text-right">
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-[9px] uppercase tracking-tighter">{l.status}</Badge>
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
