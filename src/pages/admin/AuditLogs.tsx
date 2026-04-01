import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Shield, User, Clock, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";

const AdminAuditLogs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const [data, users] = await Promise.all([
          apiClient.db.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100).execute(),
          apiClient.fetch("/admin/users"),
        ]);

        const userMap = new Map((users || []).map((user: any) => [user._id || user.id, user]));
        setLogs(
          (data || []).map((log: any) => ({
            ...log,
            actor: userMap.get(log.actor_id) || null,
          })),
        );
      } catch (err: any) {
        toast({ title: "Failed to load logs", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [toast]);

  const filtered = logs.filter((log) =>
    [log.action, log.entity_type, log.actor?.display_name, log.actor?.email]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Compliance</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Audit Logs</h1>
            <p className="mt-2 text-sm text-muted-foreground">Monitor system integrity and track critical administrative actions.</p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="text-lg">System Activity</CardTitle>
                <CardDescription>Latest 100 recorded events.</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by action, user, or entity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed py-12 text-center">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">No audit logs found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-medium">
                    <tr>
                      <th className="p-4 text-left">Action</th>
                      <th className="p-4 text-left">Actor</th>
                      <th className="hidden p-4 text-left md:table-cell">Entity</th>
                      <th className="p-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filtered.map((log) => (
                      <tr key={log.id} className="hover:bg-accent/5 transition-colors">
                        <td className="p-4">
                          <Badge variant="outline" className="bg-primary/5 font-mono text-xs uppercase tracking-wider text-primary">
                            {log.action}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium text-foreground">{log.actor?.display_name || log.actor?.email || "System"}</span>
                          </div>
                        </td>
                        <td className="hidden p-4 md:table-cell">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{log.entity_type || "Record"}</span>
                            <span className="text-xs font-mono opacity-50">#{String(log.entity_id || "").slice(0, 8) || "n/a"}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{log.created_at ? new Date(log.created_at).toLocaleString() : "Unknown"}</span>
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

export default AdminAuditLogs;
