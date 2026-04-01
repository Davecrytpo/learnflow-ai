import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RefreshCw, Plus, Users, Loader2, Trash2, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";

const DirectorySync = () => {
  const { toast } = useToast();
  const [syncs, setSyncs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSync, setNewSync] = useState({ source: "", users_synced: "0" });

  const fetchSyncs = async () => {
    setLoading(true);
    try {
      const data = await apiClient.db.from("directory_syncs").select("*").order("created_at", { ascending: false }).execute();
      setSyncs(data || []);
    } catch (error: any) {
      toast({ title: "Sync failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyncs();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiClient.db.from("directory_syncs").insert({
        source: newSync.source,
        users_synced: parseInt(newSync.users_synced, 10),
        status: "synced",
        last_sync: new Date().toISOString(),
      }).execute();
      toast({ title: "Sync Connection Added", description: "The directory is now connected." });
      setIsModalOpen(false);
      setNewSync({ source: "", users_synced: "0" });
      await fetchSyncs();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteSync = async (id: string) => {
    if (!confirm("Terminate this directory sync connection?")) return;
    try {
      await apiClient.db.from("directory_syncs").delete().eq("id", id).execute();
      toast({ title: "Connection terminated" });
      await fetchSyncs();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Identity Governance</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Directory Sync</h1>
              <p className="mt-2 text-sm text-muted-foreground">Synchronize institutional user directories (LDAP, Active Directory).</p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> Connect Directory
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Directory Connection</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Source Name</Label>
                    <Input placeholder="e.g. Campus AD, HR Oracle" value={newSync.source} onChange={(e) => setNewSync({ ...newSync, source: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial User Count</Label>
                    <Input type="number" value={newSync.users_synced} onChange={(e) => setNewSync({ ...newSync, users_synced: e.target.value })} />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Initialize Sync
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Managed Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{syncs.reduce((acc, sync) => acc + (sync.users_synced || 0), 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Bridges</CardTitle>
              <RefreshCw className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{syncs.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Directory Connections</CardTitle>
            <CardDescription>Managed institutional data sources for the Global University Institute.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : syncs.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed py-12 text-center text-muted-foreground">No directories connected.</div>
            ) : (
              <div className="space-y-3">
                {syncs.map((sync) => (
                  <div key={sync.id} className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 transition-all hover:bg-accent/5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Database className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{sync.source}</p>
                        <p className="text-xs text-muted-foreground">Last Sync: {sync.last_sync ? new Date(sync.last_sync).toLocaleString() : "Not recorded"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="mr-4 text-right">
                        <p className="text-xs font-bold text-foreground">{sync.users_synced || 0} Users</p>
                        <Badge variant="outline" className="mt-1 text-[9px] uppercase">{sync.status}</Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteSync(sync.id)}>
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
    </DashboardLayout>
  );
};

export default DirectorySync;
