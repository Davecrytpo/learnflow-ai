import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Shield } from "lucide-react";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setLogs(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = logs.filter(l =>
    (l.action || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.entity_type || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Audit</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Audit logs</h1>
            <p className="mt-2 text-sm text-muted-foreground">Monitor critical actions across the platform.</p>
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent activity</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Search logs" value={search} onChange={(e) => setSearch(e.target.value)} />
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No logs found.</p>
            ) : (
              <div className="space-y-2">
                {filtered.map(l => (
                  <div key={l.id} className="rounded-xl border border-border p-3 text-sm">
                    <p className="font-medium text-foreground">{l.action} - {l.entity_type}</p>
                    <p className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAuditLogs;
