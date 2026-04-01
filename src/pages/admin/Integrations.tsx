import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plug, Webhook, Plus, Trash2, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";

const AdminIntegrations = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const data = await apiClient.db.from("webhook_configs").select("*").order("created_at", { ascending: false }).execute();
      setWebhooks(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const addWebhook = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newUrl.trim()) return;
    setAdding(true);

    try {
      await apiClient.db.from("webhook_configs").insert({
        name: `Webhook ${webhooks.length + 1}`,
        endpoint: newUrl,
        events: ["all"],
        status: "active",
      }).execute();
      toast({ title: "Webhook added", description: "Events will now be streamed to this endpoint." });
      setNewUrl("");
      await fetchWebhooks();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm("Remove this webhook?")) return;
    try {
      await apiClient.db.from("webhook_configs").delete().eq("id", id).execute();
      toast({ title: "Webhook removed" });
      await fetchWebhooks();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Connectivity</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Integrations Ecosystem</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage SSO, webhooks, and external API connections.</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-4 w-4 text-primary" /> New Webhook
              </CardTitle>
              <CardDescription>Stream events to an external URL.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addWebhook} className="space-y-4">
                <Input
                  placeholder="https://api.domain.com/hook"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
                <Button className="w-full" type="submit" disabled={adding || !newUrl}>
                  {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Webhook
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Webhook className="h-4 w-4 text-primary" /> Active Webhooks
              </CardTitle>
              <CardDescription>Real-time event subscriptions.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : webhooks.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed py-8 text-center text-muted-foreground">No webhooks configured.</div>
              ) : (
                <div className="space-y-2">
                  {webhooks.map((hook) => (
                    <div key={hook.id} className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Plug className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="max-w-[200px] truncate text-sm font-medium">{hook.endpoint}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="secondary" className="h-5 text-[10px]">{hook.status}</Badge>
                            <span className="text-xs text-muted-foreground">{hook.created_at ? new Date(hook.created_at).toLocaleDateString() : "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteWebhook(hook.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminIntegrations;
